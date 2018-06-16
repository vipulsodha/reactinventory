var DB = {};

DB.init = function() {
	if (window.confirm('are you sure to initialize database?')) {
		DB.load();
	}
};

DB.load = function() {
	
	alasql('DROP TABLE IF EXISTS user_details;');
	alasql('CREATE TABLE user_details(name STRING, age INT, sex INT, ph_no INT, emp_id STRING);');
	var user_details = alasql.promise('SELECT MATRIX * FROM CSV("data/USERDETAILS.csv", {headers: true})').then(function(users) {
		for (var i = 0; i < users.length; i++) {
			alasql('INSERT INTO user_details VALUES(?,?,?,?,?);', users[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS user_role;');
	alasql('CREATE TABLE user_role(emp_id STRING, role_id INT);');
	var user_role = alasql.promise('SELECT MATRIX * FROM CSV("data/USERROLE.csv", {headers: true})').then(function(roles) {
		for (var i = 0; i < roles.length; i++) {
			alasql('INSERT INTO user_role VALUES(?,?);', roles[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS user_warehouse;');
	alasql('CREATE TABLE user_warehouse(emp_id STRING, warehouse_id INT);');
	var user_warehouse = alasql.promise('SELECT MATRIX * FROM CSV("data/USERWAREHOUSE.csv", {headers: true})').then(function(user_warehouses) {
		for (var i = 0; i < user_warehouses.length; i++) {
			alasql('INSERT INTO user_warehouse VALUES(?,?);', user_warehouses[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS warehouse_details;');
	alasql('CREATE TABLE warehouse_details(warehouse_id INT, warehouse_name STRING, warehouse_location STRING);');
	var warehouse_details = alasql.promise('SELECT MATRIX * FROM CSV("data/WAREHOUSES.csv", {headers: true})').then(function(warehouses) {
		for (var i = 0; i < warehouses.length; i++) {
			alasql('INSERT INTO warehouse_details VALUES(?,?,?);', warehouses[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS product_maker;');
	alasql('CREATE TABLE product_maker(maker_id INT PRIMARY KEY AUTOINCREMENT, maker_name STRING);');
	var product_maker = alasql.promise('SELECT MATRIX * FROM CSV("data/PRODUCT_MAKER.csv", {headers: true})').then(function(makers) {
		for (var i = 0; i < makers.length; i++) {
			alasql('INSERT INTO product_maker VALUES(?,?);', makers[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS product_details;');
	alasql('CREATE TABLE product_details(product_id INT, product_name STRING, product_image STRING, category_id INT, code STRING, detail STRING, maker STRING, selling_price_per_unit INT, purchase_price_per_unit INT);');
	var product_details = alasql.promise('SELECT MATRIX * FROM CSV("data/PRODUCTDETAILS.csv", {headers: true})').then(function(products_d) {
		for (var i = 0; i < products_d.length; i++) {
			alasql('INSERT INTO product_details VALUES(?,?,?,?,?,?,?,?,?);', products_d[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS product_category;');
	alasql('CREATE TABLE product_category(category_id INT, category_name STRING);');
	var product_category = alasql.promise('SELECT MATRIX * FROM CSV("data/PRODUCTCATEGORY.csv", {headers: true})').then(function(categories) {
		for (var i = 0; i < categories.length; i++) {
			alasql('INSERT INTO product_category VALUES(?,?);', categories[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS customer_details;');
	alasql('CREATE TABLE customer_details(customer_id INT, name STRING, ph_no INT, email_id STRING, company_name STRING);');
	var customer_details = alasql.promise('SELECT MATRIX * FROM CSV("data/CUSTOMERDETAILS.csv", {headers: true})').then(function(customers) {
		for (var i = 0; i < customers.length; i++) {
			alasql('INSERT INTO customer_details VALUES(?,?,?,?,?);', customers[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS inventory_product_quantity;');
	alasql('CREATE TABLE inventory_product_quantity(product_id INT, quantity_available INT, warehouse_id INT, threshold INT);');
	var inventory_product_quantity = alasql.promise('SELECT MATRIX * FROM CSV("data/PRODUCT_QUANTITY.csv", {headers: true})').then(function(products) {
		for (var i = 0; i < products.length; i++) {
			alasql('INSERT INTO inventory_product_quantity VALUES(?,?,?,?);', products[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS supplier_details;');
	alasql('CREATE TABLE supplier_details(supplier_id INT, name STRING, ph_no INT, email_id STRING, address STRING);');
	var supplier_details = alasql.promise('SELECT MATRIX * FROM CSV("data/SUPPLIER_DETAILS.csv", {headers: true})').then(function(details) {
		for (var i = 0; i < details.length; i++) {
			alasql('INSERT INTO supplier_details (name, ph_no, email_id,supplier_id) VALUES(?,?,?,?,?);', details[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS customer_shipping_address;');
	alasql('CREATE TABLE customer_shipping_address(address_id INT, customer_id INT, shipping_address STRING, address_name STRING);');
	var customer_shipping_address = alasql.promise('SELECT MATRIX * FROM CSV("data/CUSTOMER_ADDRESSES.csv", {headers: true})').then(function(addresses) {
		for (var i = 0; i < addresses.length; i++) {
			alasql('INSERT INTO customer_shipping_address VALUES(?,?,?,?);', addresses[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS sales_order;');
	alasql('CREATE TABLE sales_order(order_id INT PRIMARY KEY AUTOINCREMENT, order_datetime DATETIME, total_amount INT, products_quantity INT, order_approved INT DEFAULT 0, approved_date STRING, invoice_generated INT DEFAULT 0, invoice_date STRING, payment_done INT DEFAULT 0, payment_date STRING,  packaging_done INT DEFAULT 0, packaging_date STRING, shipping_done INT DEFAULT 0, shipping_date STRING, tax INT DEFAULT 0, warehouse_id INT, returned INT, customer_id INT, customer_address_id INT, order_cancel INT, cancel_date STRING, cancel_reason STRING);');
	var sales_order = alasql.promise('SELECT MATRIX * FROM CSV("data/SALES_ORDER.csv", {headers: true})').then(function(sales) {
		for (var i = 0; i < sales.length; i++) {
			alasql('INSERT INTO sales_order VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', sales[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS sales_order_product_list;');
	alasql('CREATE TABLE sales_order_product_list(order_id INT, product_id INT, quantity INT, discount INT, total_price INT, per_unit_price INT);');
	var sales_order_product_list = alasql.promise('SELECT MATRIX * FROM CSV("data/SALES_ORDER_PRODUCTS.csv", {headers: true})').then(function(sales_products) {
		for (var i = 0; i < sales_products.length; i++) {
			alasql('INSERT INTO sales_order_product_list VALUES(?,?,?,?,?,?);', sales_products[i]);
		}	
	});

	alasql('DROP TABLE IF EXISTS products_outgoing_log;');
	alasql('CREATE TABLE products_outgoing_log(order_id INT, total_quantity INT, warehouse_id INT, datetime_outgoing DATETIME, order_type INT);');
	var products_outgoing_log = alasql.promise('SELECT MATRIX * FROM CSV("data/OUTGOING_PRODUCTS.csv", {headers: true})').then(function(out_products) {
		for (var i = 0; i < out_products.length; i++) {
			alasql('INSERT INTO products_outgoing_log VALUES(?,?,?,?,?);', out_products[i]);
		}
	});

		alasql('DROP TABLE IF EXISTS order_invoice;');
	alasql('CREATE TABLE order_invoice(order_id INT, invoice_id INT PRIMARY KEY AUTOINCREMENT);');
	var order_invoice = alasql.promise('SELECT MATRIX * FROM CSV("data/ORDER_INVOICES.csv", {headers: true})').then(function(invoices) {
		for (var i = 0; i < invoices.length; i++) {
			alasql('INSERT INTO order_invoice VALUES(?,?);', invoices[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS purchase_order;');
	alasql('CREATE TABLE purchase_order(order_id INT PRIMARY KEY AUTOINCREMENT, order_datetime DATETIME, total_amount INT, products_quantity INT, order_received INT DEFAULT 0, bill_generated INT DEFAULT 0, supplier_id INT, warehouse_id INT, tax INT DEFAULT 0, receive_date STRING, partially_received INT);');
	var purchase_order = alasql.promise('SELECT MATRIX * FROM CSV("data/PURCHASE_ORDER.csv", {headers: true})').then(function(purchase) {
		for (var i = 0; i < purchase.length; i++) {
			alasql('INSERT INTO purchase_order VALUES(?,?,?,?,?,?,?,?,?,?,?);', purchase[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS purchase_order_product_list;');
	alasql('CREATE TABLE purchase_order_product_list(order_id INT, product_id INT, quantity_ordered INT, order_total_amount INT, per_unit_price INT, quantity_received INT);');
	var purchase_order_product_list = alasql.promise('SELECT MATRIX * FROM CSV("data/PURCHASE_ORDER_PRODUCTS.csv", {headers: true})').then(function(purchase_products) {
		for (var i = 0; i < purchase_products.length; i++) {
			alasql('INSERT INTO purchase_order_product_list VALUES(?,?,?,?,?,?);', purchase_products[i]);
		}
	});


	// QUANTITY_RECEIVED_LOG
	alasql('DROP TABLE IF EXISTS quantity_received_log;');
	alasql('CREATE TABLE quantity_received_log(order_id INT, product_id INT, quantity_received INT, receive_date STRING, package_number STRING, received_by STRING, comment STRING);');
	var quantity_received_log = alasql.promise('SELECT MATRIX * FROM CSV("data/QUANTITY_RECEIVED_LOG.csv", {headers: true})').then(function(receive_log) {
		for (var i = 0; i < receive_log.length; i++) {
			alasql('INSERT INTO quantity_received_log VALUES(?,?,?,?,?,?,?);', receive_log[i]);
		}
	});




	alasql('DROP TABLE IF EXISTS products_incoming_log;');
	alasql('CREATE TABLE products_incoming_log(order_id INT, total_quantity INT, warehouse_id INT, datetime_outgoing DATETIME, order_type INT);');
	var products_incoming_log = alasql.promise('SELECT MATRIX * FROM CSV("data/INCOMING_PRODUCTS.csv", {headers: true})').then(function(incoming_products) {
		for (var i = 0; i < incoming_products.length; i++) {
			alasql('INSERT INTO products_incoming_log VALUES(?,?,?,?,?);', incoming_products[i]);
		}
	});


	alasql('DROP TABLE IF EXISTS return_order;');
	alasql('CREATE TABLE return_order(order_id INT, order_datetime DATETIME, product_quantity INT, total_amount INT, order_received INT DEFAULT 0, sales_order_id INT, return_reason INT,comment STRING, warehouse_id INT, received_datetime STRING);');
	var return_order = alasql.promise('SELECT MATRIX * FROM CSV("data/RETURN_ORDER.csv", {headers: true})').then(function(returns) {
		for (var i = 0; i < returns.length; i++) {
			alasql('INSERT INTO return_order (sales_order_id, order_id, order_datetime, order_received,return_reason,comment,warehouse_id,product_quantity,total_amount,received_datetime) VALUES(?,?,?,?,?,?,?,?,?,?);', returns[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS return_order_product_list;');
	alasql('CREATE TABLE return_order_product_list(order_id INT, product_id INT, quantity_returned INT);');
	var return_order_product_list = alasql.promise('SELECT MATRIX * FROM CSV("data/RETURN_PRODUCTS.csv", {headers: true})').then(function(return_produts) {
		for (var i = 0; i < return_produts.length; i++) {
			alasql('INSERT INTO return_order_product_list VALUES(?,?,?);', return_produts[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS login_details;');
	alasql('CREATE TABLE login_details(emp_id STRING, password STRING);');
	var login_details = alasql.promise('SELECT MATRIX * FROM CSV("data/LOGIN_DETAILS.csv", {headers: true})').then(function(login) {
		for (var i = 0; i < login.length; i++) {
			alasql('INSERT INTO login_details VALUES(?,?);', login[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS inventory_initial_product_data;');
	alasql('CREATE TABLE inventory_initial_product_data(product_id INT, initial_quantity INT DEFAULT 0, warehouse_id INT, datetime STRING);');
	var inventory_initial_product_data = alasql.promise('SELECT MATRIX * FROM CSV("data/INVENTORY_INITIAL_PRODUCT_DATE.csv", {headers: true})').then(function(initial_data) {
		for (var i = 0; i < initial_data.length; i++) {
			alasql('INSERT INTO inventory_initial_product_data (initial_quantity, product_id,warehouse_id,datetime) VALUES(?,?,?,?);', initial_data[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS inventory_stock_adjust;');
	alasql('CREATE TABLE inventory_stock_adjust(adjust_id INT, adjust_datetime STRING, warehouse_id INT, emp_id STRING, adjust_reason STRING, adjust_description STRING);');
	var inventory_stock_adjust = alasql.promise('SELECT MATRIX * FROM CSV("data/STOCK_ADJUST.csv", {headers: true})').then(function(adjust_data) {
		for (var i = 0; i < adjust_data.length; i++) {
			alasql('INSERT INTO inventory_stock_adjust VALUES(?,?,?,?,?,?);', adjust_data[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS adjust_product_list;');
	alasql('CREATE TABLE adjust_product_list(adjust_id INT, product_id INT, quantity INT);');
	var adjust_product_list = alasql.promise('SELECT MATRIX * FROM CSV("data/STOCK_ADJUST_LIST.csv", {headers: true})').then(function(adjust_list) {
		for (var i = 0; i < adjust_list.length; i++) {
			alasql('INSERT INTO adjust_product_list VALUES(?,?,?);', adjust_list[i]);
		}
	});


	alasql('DROP TABLE IF EXISTS transfer_order');
	alasql('create table transfer_order (order_id INT, order_datetime STRING, order_approved INT, order_received INT, order_reject INT, reject_date STRING, reject_reason STRING, receive_date STRING, approve_date STRING, from_warehouse_id INT, to_warehouse_id INT)');
	var transfer_order = alasql.promise('SELECT MATRIX * FROM CSV("data/TRANSFER_ORDER.csv", {headers: true})').then(function(transfer_data) {
		for (var i = 0; i < transfer_data.length; i++) {
			alasql('INSERT INTO transfer_order (order_id, order_datetime, to_warehouse_id, from_warehouse_id, order_received,order_approved,order_reject) VALUES(?,?,?,?,?,?,?);', transfer_data[i]);
		}
	});


	alasql('DROP TABLE IF EXISTS transfer_order_product_list');
	alasql('CREATE table transfer_order_product_list (order_id INT, product_id INT, quantity_transfered INT)');
	var transfer_order_product_list = alasql.promise('SELECT MATRIX * FROM CSV("data/TRANSFER_ORDER_PRODUCTS.csv", {headers: true})').then(function(transfer_list) {
		for (var i = 0; i < transfer_list.length; i++) {
			alasql('INSERT INTO transfer_order_product_list VALUES(?,?,?);', transfer_list[i]);
		}
	});

	alasql('DROP TABLE IF EXISTS user_notification');
	alasql('CREATE table user_notification (message STRING, warehouse_id STRING, link STRING, role_id INT)');
	var user_notification = alasql.promise('SELECT MATRIX * FROM CSV("data/USER_NOTIFICATION.csv", {headers: true})').then(function(notifications) {
		for (var i = 0; i < notifications.length; i++) {
			alasql('INSERT INTO user_notification VALUES(?,?,?,?);', notifications[i]);
		}
	});


	//SALE_PAYMENT_DETAILS
	alasql('DROP TABLE IF EXISTS sales_payment_details');
	alasql('CREATE TABLE sales_payment_details (order_id INT, amount_paid INT, payment_method INT, transaction_id STRING, payment_date STRING)');
	var sales_payment_details = alasql.promise('SELECT MATRIX * FROM CSV("data/SALE_PAYMENT_DETAILS.csv", {headers: true})').then(function(sales_p) {
		for (var i = 0; i < sales_p.length; i++) {
			alasql('INSERT INTO sales_payment_details VALUES(?,?,?,?,?);', sales_p[i]);
		}
	});


	//SALE_PACKAGE_DETAILS
	alasql('DROP TABLE IF EXISTS sales_package_details');
	alasql('CREATE TABLE sales_package_details (order_id INT, package_number STRING, handling_user STRING, package_date STRING)');
	var sales_package_details = alasql.promise('SELECT MATRIX * FROM CSV("data/SALE_PACKAGE_DETAILS.csv", {headers: true})').then(function(sales_pa) {
		for (var i = 0; i < sales_pa.length; i++) {
			alasql('INSERT INTO sales_package_details VALUES(?,?,?,?);', sales_pa[i]);
		}
	});


	//SALE_SHIPPING_DETAILS
	alasql('DROP TABLE IF EXISTS sales_shipping_details');
	alasql('CREATE TABLE sales_shipping_details (order_id INT, shipping_method STRING, shipping_company_name STRING, tracking_id STRING, shipping_date STRING)');
	var sales_shipping_details = alasql.promise('SELECT MATRIX * FROM CSV("data/SALE_SHIPPING_DETAILS.csv", {headers: true})').then(function(sales_pd) {
		for (var i = 0; i < sales_pd.length; i++) {
			alasql('INSERT INTO sales_shipping_details VALUES(?,?,?,?,?);', sales_pd[i]);
		}
	});

	//PURCHASE_RECEIVE_DETAILS
	alasql('DROP TABLE IF EXISTS purchase_receive_details');
	alasql('CREATE TABLE purchase_receive_details (order_id INT, receive_date STRING, received_by STRING, package_number STRING)');
	var purchase_receive_details = alasql.promise('SELECT MATRIX * FROM CSV("data/PURCHASE_RECEIVED_DETAILS.csv", {headers: true})').then(function(details) {
		for (var i = 0; i < details.length; i++) {
			alasql('INSERT INTO purchase_receive_details VALUES(?,?,?,?);', details[i]);
		}
	});

	//PURCHASE_REQUEST
	alasql('DROP TABLE IF EXISTS purchase_request');
	alasql('CREATE TABLE purchase_request (request_id INT, warehouse_id INT, role_id INT, request_datetime STRING, request_reason STRING, request_approved INT, request_rejected INT, reject_reason STRING)');
	var purchase_request = alasql.promise('SELECT MATRIX * FROM CSV("data/PURCHASE_REQUEST.csv", {headers: true})').then(function(pr) {
		for (var i = 0; i < pr.length; i++) {
			alasql('INSERT INTO purchase_request VALUES(?,?,?,?,?,?,?,?);', pr[i]);
		}
	});

	//REQUEST_PRODUCT_LIST
	alasql('DROP TABLE IF EXISTS request_product_list');
	alasql('CREATE TABLE request_product_list (request_id INT, product_id INT, quantity INT)');
	var request_product_list = alasql.promise('SELECT MATRIX * FROM CSV("data/REQUEST_PRODUCT_LIST.csv", {headers: true})').then(function(rpl) {
		for (var i = 0; i < rpl.length; i++) {
			alasql('INSERT INTO purchase_request VALUES(?,?,?);', rpl[i]);
		}
	});

	// reload html
	Promise.all([return_order,return_order_product_list,purchase_receive_details,request_product_list,purchase_request,purchase_receive_details,sales_shipping_details,sales_package_details,sales_payment_details, user_notification,transfer_order_product_list,transfer_order,adjust_product_list, user_details, user_role, user_warehouse, warehouse_details, product_details, product_category, customer_details, inventory_product_quantity, supplier_details, customer_shipping_address, sales_order,sales_order_product_list, products_outgoing_log, order_invoice, products_incoming_log, inventory_initial_product_data, inventory_stock_adjust, adjust_product_list]).then(function() {
		window.location.reload(true);
	});
};
// connect to database
try {
	alasql('ATTACH localStorage DATABASE INVENTORY');
	alasql('USE INVENTORY');
} catch (e) {
	alasql('CREATE localStorage DATABASE INVENTORY');
	alasql('ATTACH localStorage DATABASE INVENTORY');
	alasql('USE INVENTORY');
	DB.load();
}


