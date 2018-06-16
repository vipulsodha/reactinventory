/**
 * Created by vipulsodha on 04/12/16.
 */


const Constants = {};

Constants.sideBarRoles = {
	1:[
		{
			key: "Quick Links",
			link:"/order/purchase",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-star",
			defaultOpen:true,
			subList:[
				{
					key:"Transfer Requests",
					link:"/order/transfer?show=request"
				},
				{
					key:"Low  Quantity Stock",
					link: "/inventory?show=low"

				},
				{
					key:"Pending purchase Orders",
					link: "/order/purchase?show=pending"

				},
				{
					key:"Pending return Orders",
					link: "/order/return?show=pending"

				},
				{
					key: "Pending Payments",
					link:"/invoice?show=pending"
				}
			]
		},
		{
			key:"Dashboard",
			link:"/dashboard",
			giveHeaderLink:true,
			icon:"glyphicon glyphicon-home",
			subList:[]
		},
		{
			key:"Inventory",
			link:"/inventory",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-shopping-cart",
			defaultOpen:false,
			subList:[
				{
					key:"Show Stock List",
					link:"/inventory"
				},
				{
					key:"Add New Stock",
					link:"/inventory/product/add"
				},
				{
					key:"Stock Adjustment",
					link:"/inventory/adjust"
				},
				{
					key:"Stock Transfer",
					link:"/order/transfer"
				}
			]
		},
		{
			key: "Sales Order",
			link:"/order/sales",
			giveHeaderLink:false,
			icon: "glyphicon glyphicon-export",
			defaultOpen:false,
			subList:[
				{
					key: "Sales Order List",
					link:"/order/sales"
				},
				{
					key:"Add Sales Order",
					link:"/order/sales/add"
				},
				{
					key: "Invoices",
					link:"/invoice"
				},
				{
					key:"Return Orders",
					link:"/order/return"
				}
			]
		},
		{
			key: "Purchase Order",
			link:"/order/purchase",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-import",
			defaultOpen:false,
			subList:[
				{
					key: "Purchase Order List",
					link:"/order/purchase"
				},
				{
					key:"Add Purchase Order",
					link:"/order/purchase/add"
				}
			]
		},
		{
			key: "Customers",
			link:"/customers",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-user",
			defaultOpen:false,
			subList:[
				{
					key: "Customers List",
					link:"/customers"
				},
				{
					key:"Add new Customer",
					link:"/customer/add"
				}
			]
		},
		{
			key: "Suppliers",
			link:"/supplier",
			giveHeaderLink:false,
			icon: "glyphicon glyphicon-road",
			defaultOpen:false,
			subList:[
				{
					key: "Supplier List",
					link:"/supplier"
				},
				{
					key:"Add new Supplier",
					link:"/supplier/add"
				}
			]
		}
	],
	2:[
		{
			key: "Quick Links",
			link:"/order/purchase",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-star",
			defaultOpen:true,
			subList:[
				{
					key:"Low  Quantity Stock",
					link: "/inventory?show=low"

				},
				{
					key:"Pending purchase Orders",
					link: "/order/purchase?show=pending"

				},
				{
					key:"Add Purchase Order",
					link:"/order/purchase/add"
				},
				{
					key: "Pending purchase Request",
					link:"/request/purchase?show=pending"
				}
			]
		},
		{
			key:"Dashboard",
			link:"/dashboard",
			giveHeaderLink:true,
			icon:"glyphicon glyphicon-home",
			defaultOpen:false,
			subList:[]
		},
		{
			key:"Inventory",
			link:"/inventory",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-shopping-cart",
			defaultOpen:false,
			subList:[
				{
					key:"Show Stock List",
					link:"/inventory"
				},
				{
					key:"Add New Stock",
					link:"/inventory/product/add"
				},
				{
					key:"Purchase Requests",
					link:"/request/purchase"
				}
			]
		},
		{
			key: "Purchase Order",
			link:"/order/purchase",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-import",
			defaultOpen:false,
			subList:[
				{
					key: "Purchase Order List",
					link:"/order/purchase"
				},
				{
					key:"Add Purchase Order",
					link:"/order/purchase/add"
				}
			]
		},
		{
			key: "Suppliers",
			link:"/supplier",
			giveHeaderLink:false,
			icon: "glyphicon glyphicon-road",
			defaultOpen:false,
			subList:[
				{
					key: "Supplier List",
					link:"/supplier"
				},
				{
					key:"Add new Supplier",
					link:"/supplier/add"
				}
			]
		}
	],
	3:[
		{
			key: "Quick Links",
			link:"/order/sales",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-star",
			defaultOpen:true,
			subList:[
				{
					key:"Pending sales Orders",
					link: "/order/sales?show=pending"

				},
				{
					key: "Pending Payments",
					link:"/invoice?show=pending"
				},
				{
					key:"Pending Return Orders",
					link:"/order/return?show=pending"
				},
				{
					key:"Add Sales Order",
					link:"/order/sales/add"
				},
				{
					key:"Create Purchase Request",
					link:"/request/purchase/add"
				}
			]
		},
		{
			key:"Dashboard",
			link:"/dashboard",
			giveHeaderLink:true,
			icon:"glyphicon glyphicon-home",
			defaultOpen:false,
			subList:[]
		},
		{
			key:"Inventory",
			link:"/inventory",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-shopping-cart",
			defaultOpen:false,
			subList:[
				{
					key:"Show Stock List",
					link:"/inventory"
				},
				{
					key:"Add New Stock",
					link:"/inventory/product/add"
				},
				{
					key:"Purchase Request List",
					link:"/request/purchase"
				},
				{
					key:"Create Purchase Request",
					link:"/request/purchase/add"
				}
			]
		},

		{
			key: "Sales Order",
			link:"/order/sales",
			giveHeaderLink:false,
			icon: "glyphicon glyphicon-export",
			defaultOpen:false,
			subList:[
				{
					key: "Sales Order List",
					link:"/order/sales"
				},
				{
					key:"Add Sales Order",
					link:"/order/sales/add"
				},
				{
					key: "Invoices",
					link:"/invoice"
				},
				{
					key:"Return Orders",
					link:"/order/return"
				}
			]
		},
		{
			key: "Customers",
			link:"/customers",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-user",
			defaultOpen:false,
			subList:[
				{
					key: "Customers List",
					link:"/customers"
				},
				{
					key:"Add new Customer",
					link:"/customer/add"
				}
			]
		}
	],
	4:[
		{
			key:"Inventory",
			link:"/inventory",
			giveHeaderLink:false,
			icon:"glyphicon glyphicon-shopping-cart",
			defaultOpen:true,
			subList:[
				{
					key:"Show Stock List",
					link:"/inventory"
				},
				{
					key:"Add New Stock",
					link:"/inventory/product/add"
				}
			]
		}
	]
}



Constants.returnReasons = {
	1:"Defective/Damaged/Broken",
	2:"Not Required",
	3: "Delivery Missed"
};

Constants.genericConstants = {
	LocalStorage: localStorage
	// LocalStorage: sessionStorage
};


Constants.roleConstants = {
	1:"Warehouse Manager",
	2:"Purchase Manager",
	3:"Sales Manager",
	4:"Data Entry Employee"
};

Constants.paymentTypeConstant = {
	2: "Cash",
	3: "Card",
	1: "Net Banking"
};


Constants.userRoles = {
	INVENTORY: {
		1:true,
		2:true,
		3:true,
		4:true
	},
	WAREHOUSE_MANAGER: {
		1:true
	},
	SALES: {
		1:true,
		3:true
	},
	PURCHASE: {
		1:true,
		2:true
	},
	CUSTOMERS: {
		1:true,
		2:true,
		3:true
	},
	SUPPLIERS: {
		1:true,
		2:true,
		3:true
	},
	ORDERS: {
		1:true,
		2:true,
		3:true
	}
};


Constants.purchaseRequestReasons = {
	1:"Low Stock",
	2:"Demand spike in near future"
}

Constants.actionConstants = {
	TOGGLE_SIDE_BAR: "toggle_side_bar",
	UPDATE_PRODUCT_LIST:"update_product_list",
	UPDATE_CURRENT_PRODUCT_DETAILS:"update_current_product_details",
	UPDATE_USER_DETAILS:"update_user_details",
	UPDATE_CUSTOMER_LIST:"update_customer_list",
	UPDATE_CURRENT_CUSTOMER_DETAILS: "update_customer_details",
	UPDATE_SUPPLIER_LIST:"update_supplier_list",
	UPDATE_ADJUST_STOCK_LIST: "update_adjust_stock_list",
    UPDATE_CURRENT_ADJUST_STOCK_DETAILS:"update_current_adjust_details",
	UPDATE_SALES_ORDER_LIST:"update_sale_order_list",
	UPDATE_CURRENT_SALES_ORDER_DETAILS:"update_current_sales_order_details",
	SHOW_NOTIFICATION_BAR:"show_status_bar",
	CLOSE_NOTIFICATION_BAR: "close_notifcation_bar",
	UPDATE_PURCHASE_ORDER_LIST: "update_purchase_order_list",
	UPDATE_CURRENT_PURCHASE_ORDER_DETAILS: "update_current_purchase_order_details",
	UPDATE_WAREHOUSE_LIST: "update_warehouse_list",
	UPDATE_TRANSFER_ORDER_LIST:"update_transfer_order_list",
	UPDATE_CURRENT_TRANSFER_ORDER_DETAILS: "update_current_transfer_order_detials",
	UPDATE_INVOICE_LIST:"update_invoice_list",
	UPDATE_CURRENT_INVOICE_DETAILS:"update_current_invoice_details",
	UPDATE_NOTIFICATIONS:"update_notifications",
	UPDATE_RETURN_ORDER_LIST: "update_return_order_list",
	UPDATE_CURRENT_RETURN_ORDER_DETAILS: "update_curent_return_order_details",
	UPDATE_CUSTOMER_ORDER_LIST:'update_customer_order_list',
	UPDATE_PURCHASE_REQUEST_LIST:'update_purchase_request_list',
	UPDATE_PURCHASE_REQUEST_DETAILS:'update_purchase_request_details',
	SAVE_PRODUCT_LIST_FOR_CLONE:"save_product_list_for_clone"
};
export default Constants;