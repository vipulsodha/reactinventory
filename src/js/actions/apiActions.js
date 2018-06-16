// import alasql from 'alasql';
import Constants from '../constants/constants';
import {getTodayDate} from '../utility/dateFunctions'

const getProductList = (warehouseId = 0, productId = 0, personalWarehouseId = 0, categoryId=0, pattern="", show= "") => {
	warehouseId = parseInt(warehouseId);
	productId = parseInt(productId);
	personalWarehouseId = parseInt(personalWarehouseId);
	categoryId = parseInt(categoryId);
	let base_query = "select pc.* , pd.*,(select threshold from inventory_product_quantity where product_id = pd.product_id and warehouse_id = ?) as threshold, (select quantity_available from inventory_product_quantity where product_id = pd.product_id and warehouse_id = ?) as personal_warehouse_quantity, (select sum(quantity_available) from inventory_product_quantity where product_id = pd.product_id) as quantity from product_details as pd inner join product_category as pc on pd.category_id == pc.category_id ";
	let first = false;

	if(warehouseId != 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` pd.warehouse_id= ${warehouseId} `;
	} 
	if(productId != 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` pd.product_id = ${productId} `;
	}

	if(categoryId != 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` pd.category_id = ${categoryId} `;
	}

	if(pattern != "" && pattern.length > 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` ( pd.product_name like '%${pattern}%' OR pd.detail like '%${pattern}%' OR pd.code like '%${pattern}%' )`;
	}


	let res = alasql(base_query, [personalWarehouseId, personalWarehouseId]);


	if(show != "" && show.length > 0) {

		if(show == "low") {

			let temp = alasql("select * from ? where personal_warehouse_quantity < threshold", [res]);
			return temp;

		} else if(show== "near") {

			return alasql("select * from ? where personal_warehouse_quantity < (threshold + 100)", [res]);

		}
	}
	return res;

}

const getProductDetails = (productId = 0, warehouseId = 0) => {
	productId = parseInt(productId);
	warehouseId = parseInt(warehouseId);
    let res = {};
	res.productDetails = alasql("select *, (select sum(quantity_available) from inventory_product_quantity where product_id = pd.product_id) as total_quantity from product_details as pd inner join product_category as pc on pd.category_id = pc.category_id inner join inventory_product_quantity as ipq on pd.product_id = ipq.product_id where ipq.product_id = ? AND ipq.warehouse_id = ?", [productId, warehouseId])[0] || {};
	res.orderDetails = {};
	res.orderDetails.initialOrder = alasql("select * from inventory_initial_product_data where product_id = ? and warehouse_id = ?", [productId, warehouseId]);
	res.orderDetails.salesOrders = alasql("select * from sales_order as so inner join sales_order_product_list as sopl on so.order_id = sopl.order_id where sopl.product_id = ? and so.warehouse_id = ?", [productId, warehouseId]);
	res.orderDetails.purchaseOrders = alasql("select * from purchase_order as po inner join purchase_order_product_list as popl on po.order_id = popl.order_id where popl.product_id = ? and po.warehouse_id = ?", [productId, warehouseId]);
	res.otherWareHouseDetails = alasql("select * from product_details as pd inner join inventory_product_quantity as ipq on pd.product_id = ipq.product_id inner join warehouse_details as wd on wd.warehouse_id = ipq.warehouse_id where ipq.warehouse_id != ? and ipq.product_id = ?", [warehouseId, productId]);
	res.productAdjustDetails =  alasql("select * from adjust_product_list as apl inner join inventory_stock_adjust as isd on apl.adjust_id = isd.adjust_id where apl.product_id = ? and isd.warehouse_id = ?", [productId, warehouseId]);
	res.productTransferDetails = alasql("select *, (select warehouse_location from warehouse_details where warehouse_id = torder.from_warehouse_id) as from_warehouse_location, (select warehouse_location from warehouse_details where warehouse_id = torder.to_warehouse_id) as to_warehouse_location  from transfer_order as torder inner join transfer_order_product_list as tpl on tpl.order_id = torder.order_id where (torder.to_warehouse_id = ? OR torder.from_warehouse_id = ?) and tpl.product_id = ?", [warehouseId, warehouseId, productId]);
    // res.r

	return res;
}

const getUserDetails = () => {
	return JSON.parse(Constants.genericConstants.LocalStorage.getItem("userDetails"));
}

const getCategoryList = () => {
	return alasql("select * from product_category order by category_id");
}

const getProductMakerList = () => {
	return alasql("select * from product_maker");
}

const getWarehouseList = (warehouseId = 0) => {
	warehouseId = parseInt(warehouseId);
	let base_query = "select * from warehouse_details";

	if(warehouseId != 0) {
		base_query += ` where warehouse_id != ${warehouseId}`;
	}
	return alasql(base_query);
}

const getProductCount = () => {
	return alasql("select count(*) as row_count from product_details")[0] || [];
}

const getCustomersCount = () => {
	return alasql("select count(*) as row_count from customer_details")[0] || [];
}

const getCustomerAddressCount = () => {
	return alasql("select count(*) as row_count from customer_shipping_address")[0] || [];
}

const getSupplierCount = () => {
	return alasql("select count(*) as row_count from supplier_details")[0] || [];
}

const productMultipleInsert = (count, initial_quantity, warehouse_id, threshold) => {
	let wareHouseList = getWarehouseList();
	wareHouseList.forEach((elem) => {
		if(elem.warehouse_id == warehouse_id) {
			alasql("insert into inventory_product_quantity (product_id, quantity_available, warehouse_id, threshold) values(?,?,?,?)", [count, initial_quantity, warehouse_id, threshold]);
		} else {
			alasql("insert into inventory_product_quantity (product_id, quantity_available, warehouse_id, threshold) values(?,?,?,?)", [count, 0, elem.warehouse_id, 0]);
		}
	});
}


const saveNewProduct = (data) => {
	let count = getProductCount().row_count;
	count = parseInt(count) + 1;
	let category_id = parseInt(data.productCategoryId);

	let initial_quantity = parseInt(data.initialProductQuantity);
	let selling_price_per_unit = parseInt(data.sellingPricePerUnit);
	let purchase_price_per_unit = parseInt(data.purchasePricePerUnit);
	let warehouse_id = parseInt(data.productWarehouseId);
	let threshold = parseInt(data.productThreshold);
	let date = getTodayDate();
	alasql("insert into product_details (product_id, product_name, category_id, code, detail, maker, selling_price_per_unit, purchase_price_per_unit) values(?,?,?,?,?,?,?,?)", [count, data.productName, category_id, data.productCode, data.productDetail, data.productMaker, selling_price_per_unit, purchase_price_per_unit]);

	//Todo Stoped here
	alasql("insert into inventory_initial_product_data (product_id, initial_quantity, warehouse_id, datetime) values(?,?,?,?,?)", [count, initial_quantity, warehouse_id, date]);
	productMultipleInsert(count, initial_quantity, warehouse_id, threshold);
	return count;
}

const getCustomerList = () => {
	return alasql("select *, (select count(*) as address_count from customer_shipping_address where customer_id = cd.customer_id) as address_count from customer_details as cd order by name");
}

const getCustomerDetails = (customerId) => {
	customerId = parseInt(customerId);
	let customerDetails = alasql("select * from customer_details where customer_id = ?", [customerId]);
	if(customerDetails.length == 1) {
		customerDetails = customerDetails[0];
	} else {
		return {};
	}
	let addressDetails = alasql("select * from customer_shipping_address where customer_id = ?", [customerId]);
	customerDetails.addressDetails = addressDetails;
	return customerDetails;
}

const saveNewCustomer = (data) => {

	let count = getCustomersCount().row_count;
	count = parseInt(count) + 1;
	data.phNo = parseInt(data.phNo);
	alasql("insert into customer_details (customer_id, name, ph_no, email_id, company_name) values(?,?,?,?,?)", [count, data.customerName, data.phNo, data.email, data.companyName]);
	let addressCount = getCustomerAddressCount().row_count;
	addressCount = parseInt(addressCount);
	let  addressDetails = data.addressDetails;
	addressDetails.forEach((elem) => {
		addressCount++;
		alasql("insert into customer_shipping_address (customer_id, shipping_address, address_id, address_name) values(?,?,?,?)", [count, elem.address, addressCount, elem.address_name]);
	});
	return count;
}


const saveNewSupplier = (data) => {
	let count = getSupplierCount().row_count;
	count = parseInt(count) + 1;
	data.phNo = parseInt(data.phNo);
	alasql("insert into supplier_details (supplier_id, name, ph_no, email_id) values(?,?,?,?)", [count, data.supplierName, data.phNo, data.email]);
	return count;
}

const getSupplierList = () =>{
	return alasql("select * from supplier_details order by name");
}

const getAdjustCount = () => {
    return alasql("select * from inventory_stock_adjust").length;
}


const saveNewAdjustRequest = (data) => {

    let count = parseInt(getAdjustCount()) + 1;
    let warehouse_id = parseInt(data.adjustDetails.warehouse_id);
    alasql("insert into inventory_stock_adjust (adjust_id, adjust_datetime, warehouse_id, emp_id, adjust_reason, adjust_description) values(?,?,?,?,?,?)", [count, data.adjustDetails.adjustDateTime, warehouse_id, data.adjustDetails.user_id, data.adjustDetails.adjust_reason, data.adjustDetails.adjust_description]);
    data.product_details.forEach((elem) => {
        let product_id = parseInt(elem.productId);
        let quantity = parseInt(elem.quantityAdjusted);
        let quantity_available = parseInt(elem.newQuantityAvailable);
        alasql("insert into adjust_product_list (adjust_id, product_id, quantity) values(?,?,?)", [count, product_id, quantity]);
        alasql("update inventory_product_quantity SET quantity_available = ? where product_id = ? and warehouse_id = ?", [quantity_available, product_id, warehouse_id]);
    });
    return count;
}


const getStockAdjustList = (warehouse_id = 0) => {
    warehouse_id = parseInt(warehouse_id);
    let first = false;
    let base_query = "select *, (select count(*) from adjust_product_list as apl where isa.adjust_id = apl.adjust_id) as product_count, (select sum(quantity) from adjust_product_list as apl where isa.adjust_id = apl.adjust_id) as adjusted_quantity from inventory_stock_adjust as isa inner join warehouse_details as wd on wd.warehouse_id = isa.warehouse_id";
    if (warehouse_id != 0) {
        if(!first) {
            base_query += " where ";
        } else {
            base_query += " AND ";
        }

        base_query += ` isa.warehouse_id = ${warehouse_id}`;
    }

    return alasql(base_query);
}

const getSingleProductAdjustList = (warehouse_id = 0, product_id = 0) => {
    warehouse_id = parseInt(warehouse_id);
    product_id = parseInt(product_id);
    let first = false;
    return alasql("select * from adjust_product_list as apl inner join inventory_stock_adjust as isd on apl.adjust_id = isd.adjust_id where apl.product_id = ? and isd.warehouse_id = ?", [product_id, warehouse_id]);

}

const getStockAdjustDetails = (adjust_id=0, warehouse_id=0) => {
    adjust_id = parseInt(adjust_id);
    warehouse_id = parseInt(warehouse_id);
    let adjustDetails = alasql("select * from inventory_stock_adjust where adjust_id =?", [adjust_id]);
    if(adjustDetails.length == 1) {
        adjustDetails  = adjustDetails[0];
    } else {
        return {}
    }

    let adjustedProductList = alasql("select *, (select quantity_available from inventory_product_quantity where product_id = apl.product_id and warehouse_id = ?) as quantity_available from adjust_product_list as apl inner join product_details as pd on apl.product_id == pd.product_id where apl.adjust_id = ?", [warehouse_id, adjust_id]);

    adjustDetails.adjustProductList = adjustedProductList;
    return adjustDetails;
}

const getCustomerAddressList = (customerId) => {
	customerId = parseInt(customerId);
	return alasql("select * from customer_shipping_address where customer_id = ?", [customerId]);
}

const getSalesOrderCount = () => {
	return alasql("select * from sales_order").length;
}


const getPurchaseOrderCount = () => {
	return alasql("select * from purchase_order").length;
}

const getTransferOrderCount = () => {
	return alasql("select * from transfer_order").length;
}

const saveNewSalesOrder = (data) => {
	let count = getSalesOrderCount() + 1;
	let warehouse_id = parseInt(data.warehouse_id);
	let total_amount = parseInt(data.total_amount);
	let tax = parseInt(data.tax);
	let customer_id = parseInt(data.customer_id);
	let customer_address_id = parseInt(data.customer_address_id);
	alasql("insert into sales_order (order_id, order_datetime, total_amount, tax, warehouse_id, customer_id, customer_address_id, order_approved, invoice_generated, payment_done, packaging_done, shipping_done, returned, order_cancel ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [count, data.order_datetime, total_amount, tax, warehouse_id, customer_id, customer_address_id,1,0,0,0,0,0,0]);

	data.product_list.forEach((elem) => {
		let product_id = parseInt(elem.product_id);
		let quantity = parseInt(elem.order_quantity);
		let price_per_unit = parseInt(elem.selling_price);
		let discount = parseInt(elem.discount);
		let total_price = parseInt(elem.total_price);

		alasql("insert into sales_order_product_list (order_id, product_id, quantity, discount, total_price, per_unit_price) values(?,?,?,?,?,?)", [count, product_id, quantity, discount, total_price, price_per_unit]);
		alasql("update inventory_product_quantity SET quantity_available = quantity_available - ? where product_id = ? and warehouse_id = ?", [quantity, product_id, warehouse_id]);
	});

	return count;
}

const saveNewPurchaseOrder = (data) => {
	let count = getPurchaseOrderCount() + 1;
	let warehouse_id = parseInt(data.warehouse_id);
	let total_amount = parseInt(data.total_amount);
	let supplier_id = parseInt(data.supplier_id);

	alasql("insert into purchase_order (order_id, order_datetime, total_amount, warehouse_id, supplier_id, order_received, bill_generated) values(?,?,?,?,?,?,?)", [count, data.order_datetime, total_amount, warehouse_id, supplier_id, 0,0]);
	data.product_list.forEach((elem) => {
		let product_id = parseInt(elem.product_id);
		let quantity = parseInt(elem.order_quantity);
		let price_per_unit = parseInt(elem.purchase_price);
		let total_price = parseInt(elem.total_price);
		alasql("insert into purchase_order_product_list (order_id, product_id, quantity_ordered, order_total_amount, per_unit_price, quantity_received) values(?,?,?,?,?,?)", [count, product_id, quantity, total_price, price_per_unit,0]);
	});

	return count;
}

const saveNewTransferOrder = (data) => {
	let count = getTransferOrderCount() + 1;
	let to_warehouse_id = parseInt(data.to_warehouse_id);
	let from_warehouse_id = parseInt(data.from_warehouse_id);

	alasql("insert into transfer_order (order_id, order_datetime, to_warehouse_id, from_warehouse_id, order_received, order_approved, order_reject) values(?,?,?,?,?,?,?)", [count, data.order_datetime, to_warehouse_id, from_warehouse_id, 0,0,0]);
	data.product_list.forEach((elem) => {
		let product_id = parseInt(elem.product_id);
		let quantity = parseInt(elem.order_quantity);
		alasql("insert into transfer_order_product_list (order_id, product_id, quantity_transfered) values(?,?,?)", [count, product_id, quantity]);
	});

	return count;
}

const getPurchaseOrderList = (warehouseId=0, productId=0, categoryId=0, pattern = "", show = "") => {
	warehouseId = parseInt(warehouseId);
	let  first = false;

	let base_query = "select *, (select sum(quantity_ordered) from purchase_order_product_list where order_id = po.order_id) as quantity_ordered from purchase_order as po inner join supplier_details as sd on sd.supplier_id = po.supplier_id";

	if(warehouseId != 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` po.warehouse_id = ${warehouseId}`;
	}

	if(show != "") {

		if(show == "received") {
			if(!first) {
				base_query += " where ";
				first = true;
			} else {
				base_query += " AND ";
			}

			base_query += ` po.order_received = 1 `
		} else if(show == "pending") {
			if(!first) {
				base_query += " where ";
				first = true;
			} else {
				base_query += " AND ";
			}
			base_query += ` po.order_received = 0 `
		}
	}


	if(pattern != "" && pattern.length > 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` (CAST(po.order_id AS varchar) like '%${pattern}%' OR sd.name like '%${pattern}%' OR po.order_datetime like '%${pattern}%' ) `;
	}

	base_query += "  order by po.order_datetime ";
	return alasql(base_query);
}
const getSalesOrderList = (warehouseId=0, productId=0, categoryId=0, pattern = "", show = "") => {
	warehouseId = parseInt(warehouseId);
	productId = parseInt(productId);
	categoryId = parseInt(categoryId);
	let first  = false;
	let base_query = "select so.*, cd.*, (select sum(quantity) from sales_order_product_list where order_id = so.order_id) as quantity_ordered from sales_order as so inner join customer_details as cd on cd.customer_id = so.customer_id";

	if(warehouseId != 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` so.warehouse_id = ${warehouseId}`;
	}
	if(show != "") {

		if(show == "completed") {
			if(!first) {
				base_query += " where ";
				first = true;
			} else {
				base_query += " AND ";
			}

			base_query += ` so.shipping_done = 1 `;
		} else if(show == "pending") {
			if(!first) {
				base_query += " where ";
				first = true;
			} else {
				base_query += " AND ";
			}
			base_query += ` ( so.shipping_done = 0 AND so.order_cancel = 0 ) `;
		} else if(show == "canceled") {
			if(!first) {
				base_query += " where ";
				first = true;
			} else {
				base_query += " AND ";
			}
			base_query += ` so.order_cancel = 1 `;
		}
	}

	if(pattern != "" && pattern.length > 0) {
		if(!first) {
			base_query += " where ";
			first = true;
		} else {
			base_query += " AND ";
		}
		base_query += ` ( CAST(so.order_id AS varchar) LIKE '%${pattern}%' OR cd.company_name LIKE '%${pattern}%'  OR so.order_datetime like '%${pattern}%') `;
	}
	base_query += "  order by order_datetime ";
	// console.log(base_query);
	return alasql(base_query);
}

const getSalesOrderDetails = (orderId = 0) => {
	orderId = parseInt(orderId);
	let saleOrderDetails = alasql("select * from sales_order as so inner join customer_details as cd on so.customer_id = cd.customer_id inner join customer_shipping_address as csa on so.customer_address_id = csa.address_id outer join order_invoice as oi on oi.order_id = so.order_id where so.order_id = ?", [orderId]);
	if(saleOrderDetails.length == 1) {
		saleOrderDetails = saleOrderDetails[0];
	} else {
		return {};
	}

	saleOrderDetails.productList = alasql("select *, (select sum(quantity_returned) from return_order_product_list as ropl inner join return_order as ro on ro.order_id = ropl.order_id where ro.sales_order_id = sopl.order_id and ropl.product_id == sopl.product_id) as quantity_returned from sales_order_product_list as sopl inner join product_details as pd on sopl.product_id = pd.product_id where sopl.order_id = ?", [orderId]);
	saleOrderDetails.paymentDetails = alasql("select * from sales_payment_details where order_id = ?", [orderId]);
	if(saleOrderDetails.paymentDetails.length == 1) {
		saleOrderDetails.paymentDetails = saleOrderDetails.paymentDetails[0];
	} else {
		saleOrderDetails.paymentDetails = [];
	}
	saleOrderDetails.packageDetails = alasql("select * from sales_package_details where order_id = ?", [orderId]);
	if(saleOrderDetails.packageDetails.length == 1) {
		saleOrderDetails.packageDetails = saleOrderDetails.packageDetails[0];
	} else {
		saleOrderDetails.packageDetails = [];
	}
	saleOrderDetails.shippingDetails = alasql("select * from sales_shipping_details where order_id = ?", [orderId]);
	if(saleOrderDetails.shippingDetails.length == 1) {
		saleOrderDetails.shippingDetails = saleOrderDetails.shippingDetails[0];
	} else {
		saleOrderDetails.shippingDetails = [];
	}

	saleOrderDetails.returnOrderDetails = alasql("select * from return_order where sales_order_id = ?", [orderId]);


	return saleOrderDetails;
}

const getPurchaseOrderDetails = (orderId = 0) => {
	orderId = parseInt(orderId);
	let purchaseOrderDetails = alasql("select * from purchase_order as po inner join supplier_details as sd on po.supplier_id = sd.supplier_id where po.order_id = ?", [orderId]);
	if(purchaseOrderDetails.length  == 1) {
		purchaseOrderDetails = purchaseOrderDetails[0];
	} else {
		return {};
	}

	purchaseOrderDetails.productList = alasql("select * from purchase_order_product_list as popl inner join product_details as pd on popl.product_id = pd.product_id where popl.order_id =?", [orderId]);
	purchaseOrderDetails.receiveLogs = alasql("select *, (select popl.per_unit_price * qrl.quantity_received from purchase_order_product_list as popl where popl.product_id = qrl.product_id and popl.order_id = qrl.order_id) as total_cost from quantity_received_log as qrl inner join product_details as pd on pd.product_id = qrl.product_id where order_id = ? order by receive_date,  package_number", [orderId]);
	purchaseOrderDetails.total_received_amount = alasql("select sum(total_cost) as total_cost from ?", [purchaseOrderDetails.receiveLogs])[0].total_cost;
	return purchaseOrderDetails;
}

const getTransferOrderDetails = (orderId = 0, warehouseId = 0) => {
	orderId =parseInt(orderId);
	let base_query = "select *, (select warehouse_location from warehouse_details where warehouse_id = torder.from_warehouse_id) as from_warehouse_location, (select warehouse_location from warehouse_details where warehouse_id = torder.to_warehouse_id) as to_warehouse_location, (select sum(quantity_transfered)  from transfer_order_product_list where order_id = torder.order_id) as quantity_transfered from transfer_order as torder where order_id = ?";

	let transferOrderDetails  = alasql(base_query, [orderId]);

	if(transferOrderDetails.length  == 1) {
		transferOrderDetails = transferOrderDetails[0];
	} else {
		return {};
	}
	transferOrderDetails.productList = alasql("select * from transfer_order_product_list as topl inner join product_details as pd on topl.product_id = pd.product_id  where topl.order_id = ?", [orderId]);
	return transferOrderDetails;
}

const updatePurchaseOrderReceived = (data, warehouseId=0) => {

	data.order_id = parseInt(data.order_id);
	warehouseId = parseInt(warehouseId);
	let dateToday = getTodayDate();
	// let product_list = alasql("select * from purchase_order_product_list as popl where popl.order_id =?", [data.order_id]);


		data.new_product_list.forEach((elem) => {
			elem.new_quantity_received = parseInt(elem.new_quantity_received);
			alasql("insert into quantity_received_log (order_id, product_id, quantity_received, receive_date, package_number, received_by, comment) values(?,?,?,?,?,?,?)",[data.order_id, elem.product_id, elem.new_quantity_received, data.receive_date, data.package_number, data.received_by, data.comment]);
			alasql("update purchase_order_product_list set quantity_received = quantity_received + ? where order_id = ? and product_id = ?", [elem.new_quantity_received, data.order_id, elem.product_id]);
			alasql("update inventory_product_quantity set quantity_available = quantity_available + ? where product_id = ? and warehouse_id = ?", [elem.new_quantity_received, elem.product_id, warehouseId]);
		});

		// alasql("insert into purchase_receive_details (order_id, receive_date, received_by, package_number) values(?,?,?,?)", [data.order_id, data.receive_date, data.received_by, data.package_number]);
	// let res = alasql("select sum(quantity_ordered) as quantity_ordered, sum(quantity_received) as quantity_received from purchase_order_product_list where order_id = ? ", [data.order_id]);
	// if(res.length == 1) {
	// 	res = res[0];
	// } else {
	// 	return 0;
	// }
	//
	// if (res.)


	return alasql("update purchase_order set partially_received = 1 where order_id = ?", [data.order_id]);

	return 1;
}

const getProductDetailsForEdit = (productId, warehouseId) => {
	productId = parseInt(productId);
	warehouseId = parseInt(warehouseId);

	let temp = alasql("select * from product_details as pd inner join product_category as pc on pd.category_id = pc.category_id inner join inventory_product_quantity as ipq on ipq.product_id = pd.product_id  where ipq.warehouse_id = ? and pd.product_id = ?", [warehouseId, productId]);
	if (temp.length == 1) {
		temp = temp[0];
		return temp;
	}

	return {};
}


const updateProduct = (data, productId = 0) => {
	productId = parseInt(productId);
	let category_id = parseInt(data.productCategoryId);
	let selling_price_per_unit = parseInt(data.sellingPricePerUnit);
	let purchase_price_per_unit = parseInt(data.purchasePricePerUnit);
	let warehouse_id = parseInt(data.productWarehouseId);
	let threshold = parseInt(data.productThreshold);

	alasql("update product_details set product_name = ?, category_id =?, code = ?, detail = ?, maker = ?, selling_price_per_unit = ?, purchase_price_per_unit = ? where product_id = ?", [data.productName, category_id, data.productCode, data.productDetail, data.productMaker, selling_price_per_unit, purchase_price_per_unit, productId]);
	alasql("update inventory_product_quantity set threshold = ? where product_id = ? and warehouse_id = ?", [threshold, productId, warehouse_id]);
}

const getDashboardData = (warehouseId = 0) => {
	warehouseId = parseInt(warehouseId);
	let warehouseData = {};
	warehouseData.summary = {};
	let stock_in_hand = alasql("select sum(quantity_available) as stock_in_hand from inventory_product_quantity where warehouse_id = ?", [warehouseId]);
	if(stock_in_hand.length == 1) {
		warehouseData.summary.stock_in_hand = stock_in_hand[0].stock_in_hand;
	} else {
		warehouseData.summary.stock_in_hand = 0;
	}
	let stock_to_be_received = alasql("select sum(popl.quantity_ordered) as stock_to_be_received from purchase_order_product_list as popl inner join purchase_order as po on po.order_id = popl.order_id where po.warehouse_id = ? and po.order_received = 0", [warehouseId]);
	if(stock_to_be_received.length == 1) {
		warehouseData.summary.stock_to_be_received = stock_to_be_received[0].stock_to_be_received;
	} else {
		warehouseData.summary.stock_to_be_received = 0;
	}

	warehouseData.otherWarehouseQuantity = alasql("select sum(ipq.quantity_available) as total_quantity, wd.warehouse_location from inventory_product_quantity as ipq inner join warehouse_details as wd on ipq.warehouse_id = wd.warehouse_id where ipq.warehouse_id != ? group by wd.warehouse_location", [warehouseId]);
	let low_quantity = alasql("select count(*)  as low_quantity from inventory_product_quantity as ipq where warehouse_id = ? and quantity_available < threshold", [warehouseId]);
	if(low_quantity.length == 1) {
		warehouseData.low_quantity = low_quantity[0].low_quantity;
	}  else {
		warehouseData.low_quantity = 0;
	}

	let near_low_quantity = alasql("select count(*)  as near_low_quantity from inventory_product_quantity as ipq where warehouse_id = ? and quantity_available < (threshold + 100)", [warehouseId]);

	if(near_low_quantity.length == 1) {
		warehouseData.near_low_quantity = near_low_quantity[0].near_low_quantity;
	} else {
		warehouseData.near_low_quantity = 0;
	}

	warehouseData.total_threshold_quantity = warehouseData.low_quantity + warehouseData.near_low_quantity;

	warehouseData.top_five  = alasql("select sum(quantity) as quantity, pd.product_name from sales_order_product_list as sopl inner join sales_order as so on so.order_id = sopl.order_id inner join product_details as pd on pd.product_id = sopl.product_id where so.warehouse_id = ? group by sopl.product_id, pd.product_name order by quantity DESC limit 5", [warehouseId]);
	return warehouseData;
}

const getInvoiceCount = () => {
	return alasql("select * from order_invoice").length;
}


const createNewInvoice = (orderId=0) => {
	orderId = parseInt(orderId);
	let dateToday = getTodayDate();
	let invoiceId = getInvoiceCount() + 1;
	alasql("insert into order_invoice (invoice_id, order_id) values(?,?)", [invoiceId, orderId]);
	alasql("update sales_order set invoice_generated = 1, invoice_date = ? where order_id = ?", [dateToday, orderId]);

	return invoiceId;
}

const salesOrderPaymentDone = (data) => {
	let order_id = parseInt(data.order_id);
	let amount_paid = parseInt(data.amount_paid);
	let payment_method = parseInt(data.payment_method);
	let dateToday = getTodayDate();
	alasql("insert into sales_payment_details (order_id, amount_paid, payment_method, transaction_id, payment_date) values(?,?,?,?,?)", [order_id, amount_paid, payment_method, data.transaction_id, data.payment_date]);
	alasql("update sales_order set payment_done = 1, payment_date = ? where order_id = ?", [dateToday, order_id]);

}

const salesOrderPackagingDone = (data) => {
	let order_id = parseInt(data.order_id);
	let package_number = parseInt(data.package_number);
	let dateToday = getTodayDate();
	alasql("insert into sales_package_details (order_id, package_number, handling_user, package_date) values(?,?,?,?)", [order_id, package_number, data.handling_user, data.package_date]);
	alasql("update sales_order set packaging_done = 1, packaging_date = ? where order_id = ?", [dateToday, order_id]);
}

const salesOrderShippingDone = (data) => {
	let order_id = parseInt(data.order_id);
	let dateToday = getTodayDate();

	alasql("insert into sales_shipping_details (order_id, shipping_method, shipping_company_name, tracking_id, shipping_date) values(?,?,?,?,?)", [order_id, data.shipping_method, data.shipping_company_name, data.tracking_id, data.shipping_date]);
	alasql("update sales_order set shipping_done = 1, shipping_date = ? where order_id = ?", [dateToday, order_id]);
}

const  getInvoiceId = (orderId = 0) => {
	orderId = parseInt(orderId);
	let res = alasql("select * from order_invoice where order_id = ?", [orderId]);
	if(res.length == 1) {
		res = res[0];
	}  else {
		return {}
	}
}

const getTransferOrderList = (warehouseId = 0, pattern = "", show="") => {
	warehouseId=parseInt(warehouseId);
	let first = false;
	let base_query = "select *, (select warehouse_location from warehouse_details where warehouse_id = torder.from_warehouse_id) as from_warehouse_location, (select warehouse_location from warehouse_details where warehouse_id = torder.to_warehouse_id) as to_warehouse_location, (select sum(quantity_transfered)  from transfer_order_product_list where order_id = torder.order_id) as quantity_transfered from transfer_order as torder";

	if(show !== "" && show.length > 0 ) {
		if(!first) {
			base_query += ' where ';
		} else {
			base_query += ' AND ';
		}
		if(show == "request") {
			base_query += ` from_warehouse_id = ${warehouseId} `;
		} else if(show == "order") {
			base_query += ` to_warehouse_id = ${warehouseId} `;
		} else {
			base_query += ` (to_warehouse_id = ${warehouseId} OR from_warehouse_id = ${warehouseId}) `;
		}
	} else {
		if(!first) {
			base_query += ' where ';
		} else {
			base_query += ' AND ';
		}
		base_query += ` (to_warehouse_id = ${warehouseId} OR from_warehouse_id = ${warehouseId}) `;
	}

	if(pattern != "" && pattern.length > 0) {
		if(!first) {
			base_query += ' where ';
		} else {
			base_query += ' AND ';
		}
		base_query += ` AND order_datetime like '%${pattern}%' `;
	}
	return alasql(base_query, [warehouseId, warehouseId]);
}

const updateTransferOrderApproved = (orderId = 0, warehouseId = 0) => {
	orderId = parseInt(orderId);
	warehouseId = parseInt(warehouseId);
	let dateToday = getTodayDate();

	let product_list = alasql("select * from transfer_order_product_list as topl where topl.order_id =?", [orderId]);
	if(product_list.length > 0) {

		product_list.forEach((elem) => {
			alasql("update inventory_product_quantity set quantity_available = quantity_available - ? where product_id = ? and warehouse_id = ?", [elem.quantity_transfered, elem.product_id, warehouseId]);
		});
	}
	return alasql("update transfer_order set order_approved = 1, approve_date = ? where order_id = ?", [dateToday,orderId]);

}

const updateTransferOrderReceived = (orderId=0, warehouseId = 0) => {
	orderId = parseInt(orderId);
	warehouseId = parseInt(warehouseId);
	let dateToday = getTodayDate();
	let product_list = alasql("select * from transfer_order_product_list as topl where topl.order_id =?", [orderId]);
	if(product_list.length > 0) {

		product_list.forEach((elem) => {
			alasql("update inventory_product_quantity set quantity_available = quantity_available + ? where product_id = ? and warehouse_id = ?", [elem.quantity_transfered, elem.product_id, warehouseId]);
		});
	}
	return alasql("update transfer_order set order_received = 1, receive_date = ? where order_id = ?", [dateToday, orderId]);
}

const updateTransferOrderReject = (orderId = 0, warehouseId = 0, rejectReason) => {
	orderId = parseInt(orderId);
	warehouseId = parseInt(warehouseId);
	let dateToday = getTodayDate();
	return alasql("update transfer_order set order_reject = 1, reject_date = ?, reject_reason = ? where order_id = ?", [dateToday, rejectReason, orderId]);
}

const getInvoiceList = (warehouseId = 0, show="") => {
	warehouseId = parseInt(warehouseId);
	let base_query = "select * from order_invoice as oi inner join sales_order as so on so.order_id = oi.order_id";
	let first = false;
	if(warehouseId != 0) {
		if(!first) {
			first = true;
			base_query += " where ";
		} else {
			base_query += " AND ";
		}
		base_query += ` so.warehouse_id = ${warehouseId} `;
	}


	if(show != "") {
		if(!first) {
			first = true;
			base_query += " where ";
		} else {
			base_query += " AND ";
		}
		if(show == "pending") {
			base_query += ` so.payment_done = 0 `;
		} else if(show == "paid") {
			base_query += ` so.payment_done = 1 `;
		}
	}
	return alasql(base_query);

}

const getInvoiceDetails = (invoiceId= 0, warehouseId = 0) => {
	warehouseId = parseInt(warehouseId);
	invoiceId = parseInt(invoiceId);

	let base_query = "select * from order_invoice where invoice_id = ?";
	let res = alasql(base_query, [invoiceId]);
	if(res.length == 1) {
		res = res[0];
	} else {
		return {};
	}
	let order_id = res.order_id;


	let temp = getSalesOrderDetails(order_id);
	temp.invoice_id = invoiceId;

	return temp;
}
const saveNotification = (message = "", warehouseId = 0, link ="", role_id) => {
	warehouseId = parseInt(warehouseId);
	role_id = parseInt(role_id);
	alasql("insert into user_notification (message, warehouse_id, link, role_id) values(?,?,?,?)", [message, warehouseId, link, role_id]);
}

const getNotification = (warehouseId = 0, role_id = 0) => {
	warehouseId = parseInt(warehouseId);
	role_id = parseInt(role_id);
	return alasql("select * from user_notification where warehouse_id = ? and role_id = ?", [warehouseId, role_id]);
}

const cancelSalesOrder = (orderId = 0, reason = "") => {
	orderId = parseInt(orderId);
	let product_list = alasql("select * from sales_order_product_list where order_id = ?", [orderId]);
	product_list.forEach((elem) => {
		let quantity = parseInt(elem.quantity);
		let product_id = parseInt(elem.product_id);
		alasql("update inventory_product_quantity set quantity_available = quantity_available + ? where product_id = ?", [quantity, product_id]);
	});
	let dateToday = getTodayDate();

	alasql("update sales_order set order_cancel = 1, cancel_date = ?, cancel_reason = ? where order_id = ?", [dateToday, reason, orderId]);
}

const markSalesOrderCompleted = (orderId) => {
	orderId = parseInt(orderId);
	return alasql("update purchase_order set order_received = 1 where order_id = ?", [orderId]);
}

const getReturnOrderCount =() => {
	return alasql("select * from return_order").length;
}

const createNewReturnOrder =(data) => {
	data.sales_order_id = parseInt(data.sales_order_id);
	data.warehouse_id = parseInt(data.warehouse_id);
	let order_id = getReturnOrderCount() + 1;

	alasql("insert into return_order (sales_order_id, order_id, order_datetime, order_received, return_reason, comment, warehouse_id, product_quantity, total_amount) values(?,?,?,?,?,?,?,?,?)", [data.sales_order_id, order_id, data.order_datetime, 0, data.return_reason, data.comment, data.warehouse_id, data.total_quantity, data.total_amount]);
	data.productList.forEach((elem) => {
		elem.return_quantity = parseInt(elem.return_quantity);
		alasql("insert into return_order_product_list (order_id, product_id, quantity_returned) values(?,?,?)", [order_id, elem.product_id, elem.return_quantity]);
	});

	alasql("update sales_order set returned = 1 where order_id = ?", [data.sales_order_id]);

	return 1;
}

const getReturnOrderDetails = (orderId = 0) => {
	orderId = parseInt(orderId);
	let returnOrderDetails = alasql("select ro.*, cd.*, csd.*, so.tax as tax  from return_order as ro inner join sales_order as so on so.order_id = ro.sales_order_id  inner join customer_details as cd on cd.customer_id = so.customer_id inner join customer_shipping_address as csd on csd.address_id = so.customer_address_id where ro.order_id = ?", [orderId]);
	if(returnOrderDetails.length == 1) {
		returnOrderDetails = returnOrderDetails[0];
	} else {
		return {};
	}

	returnOrderDetails.productList = alasql("select ropl.*, pd.*, sopl.per_unit_price as price_per_unit, sopl.discount as discount from return_order_product_list as ropl inner join product_details as pd on pd.product_id = ropl.product_id inner join return_order as ro on ro.order_id = ropl.order_id inner join sales_order_product_list as sopl on sopl.order_id = ro.sales_order_id where ropl.order_id = ?  and ropl.product_id = sopl.product_id", [orderId]);
	return returnOrderDetails;
}


const getReturnOrderList = (warehouseId = 0, show = "") => {
	warehouseId = parseInt(warehouseId);
	let base_query = "select * from return_order where warehouse_id = ?";

	if(show != "" && show.length > 0) {
		if(show == "pending") {
			base_query += " AND order_received = 0 "
		} else if( show == "received") {
			base_query += " AND order_received = 1 "
		}
	}

	console.log(base_query);
	return alasql(base_query, [warehouseId]);
}

const updateReturnOrderDone = (orderId = 0, productList = [], reason = 0, warehouseId = 0) => {
	orderId = parseInt(orderId);
	reason = parseInt(reason);
	let warehouse_id = parseInt(warehouseId);
	console.log(productList);

	orderId = parseInt(orderId);
	let todayDay = getTodayDate();
	alasql("update return_order set order_received = 1, received_datetime = ? where order_id = ?", [todayDay, orderId]);

	if(reason == 1) {

		let count = parseInt(getAdjustCount()) + 1;
		alasql("insert into inventory_stock_adjust (adjust_id, adjust_datetime, warehouse_id, emp_id, adjust_reason, adjust_description) values(?,?,?,?,?,?)", [count, todayDay, warehouse_id, 0, "Return Damaged Goods", `Damaged goods were returned for sales id ${orderId}`]);

		productList.forEach((elem) => {
			let product_id = parseInt(elem.product_id);
			let quantity = -parseInt(elem.quantity_returned);
			alasql("insert into adjust_product_list (adjust_id, product_id, quantity) values(?,?,?)", [count, product_id, quantity]);
		});
	} else {
		productList.forEach((elem) => {
			let product_id = parseInt(elem.product_id);
			let quantity = parseInt(elem.quantity_returned);
			alasql("update inventory_product_quantity SET quantity_available = quantity_available + ? where product_id = ? and warehouse_id = ?", [quantity, product_id, warehouse_id]);
		});
	}

	return 1;

}

const getCustomerOrderList = (customerId, warehouse_id = 0) => {
	customerId = parseInt(customerId);
	warehouse_id = parseInt(warehouse_id);
	let customer_details = getCustomerDetails(customerId);
	customer_details.orderDetails = alasql("select * from sales_order where customer_id = ? and warehouse_id =?", [customerId, warehouse_id]);
	return customer_details;
}


const getPurchaseRequestCount = () => {
	return alasql("select *  from purchase_request").length;
}

const saveNewPurchaseRequest = (data) => {
	let warehouse_id = parseInt(data.warehouse_id);
	let count = getPurchaseRequestCount() + 1;

	data.product_list.forEach((elem) => {
		elem.product_id = parseInt(elem.product_id);
		alasql("insert into request_product_list (request_id, product_id, quantity) values(?,?,?)", [count, elem.product_id, elem.quantity])
	});
	let todayDate = getTodayDate();
	alasql("insert into purchase_request (request_id, warehouse_id, request_datetime, request_reason, request_approved, request_rejected) values(?,?,?,?,?,?)", [count, data.warehouse_id, todayDate, data.request_reason,0,0]);
	let link = `/request/purchase/${count}`;
	alasql("insert into user_notification (message, warehouse_id, link, role_id) values(?,?,?,?)", ["New Purchase request", warehouse_id, link, 2])
	return count;
}

const getPurchaseRequestList = (warehouseId= 0, show = "") => {
	warehouseId = parseInt(warehouseId);

	let base_query = "select * from purchase_request where warehouse_id = ?"

	if(show != "" && show.length !=0) {
		if(show == "seen") {
			base_query += " AND request_approved=1 ";

		} else if(show == "pending") {
			base_query += " AND request_approved=0 AND request_rejected != 1 ";
		} else if(show == "rejected") {
			base_query += " AND request_rejected == 1 ";
		}
	}

	return alasql(base_query, [warehouseId]);

}

const getDataForCloneSales = (productList, warehouseId) => {
	warehouseId = parseInt(warehouseId);
	// {product_id:"", product_name: "", order_quantity: "", selling_price:"",discount:"", total_price:"", quantity_available:""}

	let res = alasql("select * from ? as pl inner join inventory_product_quantity as ipq on pl.product_id = ipq.product_id where ipq.warehouse_id = ?", [productList, warehouseId]);

	let temp = res.map((elem) => {


		let quantity = elem.quantity || elem.quantity_ordered || 0;
		let selling_price = elem.per_unit_price || elem.selling_price_per_unit;
		let total =  parseInt(selling_price) * parseInt(elem.quantity);
		let discount = elem.discount || 0;

		return {product_id:elem.product_id, product_name: elem.product_name, order_quantity: quantity, selling_price:selling_price,discount:discount, total_price:total, quantity_available:elem.quantity_available};
	});
	console.log(temp);
	return temp;
}


const getDataForClone = (productList, warehouseId) => {
	warehouseId = parseInt(warehouseId);
	// {product_id:"", product_name: "", order_quantity: "", purchase_price:"", total_price:"", quantity_available:""}

	let res = alasql("select * from ? as pl inner join inventory_product_quantity as ipq on pl.product_id = ipq.product_id where ipq.warehouse_id = ?", [productList, warehouseId]);

	let temp = res.map((elem) => {


		let quantity = elem.quantity || elem.quantity_ordered || 0;
		let purchase_price = elem.per_unit_price || elem.purchase_price_per_unit;
		let total =  parseInt(purchase_price) * parseInt(elem.quantity);

		return {product_id:elem.product_id, product_name: elem.product_name, order_quantity: quantity, purchase_price:purchase_price, total_price:total, quantity_available:elem.quantity_available};
	});
	console.log(temp);
	return temp;
}

const getPurchaseRequestDetails = (requestId = 0, warehouse_id = 0) => {
	requestId = parseInt(requestId);
	warehouse_id = parseInt(warehouse_id);
	let reqestDetails = alasql("select * from purchase_request where request_id = ?", [requestId]);
	if(reqestDetails.length == 1) {
		reqestDetails = reqestDetails[0];
	} else {
		return {};
	}

	reqestDetails.productList = alasql("select * from request_product_list as rpl inner join product_details as pd on pd.product_id = rpl.product_id inner join inventory_product_quantity as ipq on ipq.product_id = rpl.product_id where rpl.request_id =? and ipq.warehouse_id = ?", [requestId, warehouse_id]);
	return reqestDetails;
}

const approvePurchaseRequest = (requestId = 0, warehouse_id = 0) => {
	requestId = parseInt(requestId);
	warehouse_id = parseInt(warehouse_id);
	saveNotification("Purchase request Seen", warehouse_id, `/request/purchase${requestId}`, 3);
	return alasql("update purchase_request set request_approved = 1 where request_id = ?", [requestId]);
}

const rejectPurchaseRequest = (requestId = 0, reject_reason="", warehouse_id = 0) => {
	requestId = parseInt(requestId);
	warehouse_id = parseInt(warehouse_id);
	saveNotification("Purchase request Rejected", warehouse_id, `/request/purchase/${requestId}`, 3);
	return alasql("update purchase_request set request_rejected = 1, reject_reason = ? where request_id = ?", [reject_reason ,requestId]);
}

exports.getDataForCloneSales =getDataForCloneSales;
exports.getDataForClone = getDataForClone;
exports.rejectPurchaseRequest = rejectPurchaseRequest;
exports.approvePurchaseRequest = approvePurchaseRequest;
exports.getPurchaseRequestDetails = getPurchaseRequestDetails;
exports.getPurchaseRequestList = getPurchaseRequestList;
exports.saveNewPurchaseRequest =saveNewPurchaseRequest;
exports.getCustomerOrderList = getCustomerOrderList;
exports.updateReturnOrderDone = updateReturnOrderDone;
exports.getReturnOrderList = getReturnOrderList;
exports.getReturnOrderDetails = getReturnOrderDetails;
exports.createNewReturnOrder = createNewReturnOrder;
exports.markSalesOrderCompleted = markSalesOrderCompleted;
exports.cancelSalesOrder = cancelSalesOrder;
exports.getNotification = getNotification;
exports.saveNotification = saveNotification;
exports.getInvoiceId = getInvoiceId;
exports.getInvoiceDetails = getInvoiceDetails;
exports.getInvoiceList = getInvoiceList;
exports.updateTransferOrderApproved = updateTransferOrderApproved;
exports.updateTransferOrderReceived = updateTransferOrderReceived;
exports.updateTransferOrderReject = updateTransferOrderReject;
exports.salesOrderPaymentDone = salesOrderPaymentDone;
exports.salesOrderPackagingDone = salesOrderPackagingDone;
exports.salesOrderShippingDone = salesOrderShippingDone;
exports.getProductList = getProductList;
exports.getProductDetails = getProductDetails;
exports.getUserDetails = getUserDetails;
exports.getCategoryList = getCategoryList;
exports.getProductMakerList = getProductMakerList;
exports.getWarehouseList = getWarehouseList;
exports.saveNewProduct = saveNewProduct;
exports.getCustomerList = getCustomerList;
exports.getCustomerDetails = getCustomerDetails;
exports.saveNewCustomer = saveNewCustomer;
exports.saveNewSupplier = saveNewSupplier;
exports.getSupplierList = getSupplierList;
exports.getStockAdjustList = getStockAdjustList;
exports.getStockAdjustDetails = getStockAdjustDetails;
exports.saveNewAdjustRequest = saveNewAdjustRequest;
exports.getCustomerAddressList = getCustomerAddressList;
exports.saveNewSalesOrder = saveNewSalesOrder;
exports.getSalesOrderList = getSalesOrderList;
exports.getSalesOrderDetails = getSalesOrderDetails;
exports.saveNewPurchaseOrder = saveNewPurchaseOrder;
exports.getPurchaseOrderList = getPurchaseOrderList;
exports.getPurchaseOrderDetails = getPurchaseOrderDetails;
exports.updatePurchaseOrderReceived = updatePurchaseOrderReceived;
exports.getProductDetailsForEdit = getProductDetailsForEdit;
exports.updateProduct = updateProduct;
exports.getDashboardData = getDashboardData;
exports.createNewInvoice = createNewInvoice;
exports.saveNewTransferOrder = saveNewTransferOrder;
exports.getTransferOrderList = getTransferOrderList;
exports.getTransferOrderDetails = getTransferOrderDetails;