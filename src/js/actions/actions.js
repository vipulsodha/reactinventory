import  Constants from '../constants/constants';


const toggleSideBarAction = ()  => {
    return {
        type: Constants.actionConstants.TOGGLE_SIDE_BAR
    }
}


const updateProductListAction = (data) => {
    return {
        type:Constants.actionConstants.UPDATE_PRODUCT_LIST,
        payload:  data
    }
}

const updateCurrentProductDetails = (data) => {
    return {
        type:Constants.actionConstants.UPDATE_CURRENT_PRODUCT_DETAILS,
        payload:data
    }
}

const updateUserDetailsAction = (data) => {
    return {
        type:Constants.actionConstants.UPDATE_USER_DETAILS,
        payload: data
    }
}

const updateCustomerList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CUSTOMER_LIST,
        payload:data
    }
}

const updateCurrentCusotmerDetails = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CURRENT_CUSTOMER_DETAILS,
        payload: data
    }
}

const updateSupplierList = (data) => {
    return {
        type:Constants.actionConstants.UPDATE_SUPPLIER_LIST,
        payload: data
    }
}

const updateAdjustStockList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_ADJUST_STOCK_LIST,
        payload: data
    }
}

const updateCurrentAdjustStockDetails = (data) => {
    return {
        type:Constants.actionConstants.UPDATE_CURRENT_ADJUST_STOCK_DETAILS,
        payload: data
    }
}

const updateSalesOrderList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_SALES_ORDER_LIST,
        payload: data
    }
}

const updateCurrentSalesOrderDetails = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CURRENT_SALES_ORDER_DETAILS,
        payload: data
    }
}

const showNotificationusBar = (message, type = "message") => {
    return {
        type:Constants.actionConstants.SHOW_NOTIFICATION_BAR,
        payload: {message: message, show: true, type: type}
    }
}

const hideNotificationBar = () => {
    return {
        type: Constants.actionConstants.CLOSE_NOTIFICATION_BAR,
        payload:{message:"", show:false}
    }
}

const updatePurchaseOrderList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_PURCHASE_ORDER_LIST,
        payload: data
    }
}

const updateCurrentPurchaseOrderDetails = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CURRENT_PURCHASE_ORDER_DETAILS,
        payload:data
    }
}

const updateWarehouseList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_WAREHOUSE_LIST,
        payload: data
    }
}

const updateTransferOrderList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_TRANSFER_ORDER_LIST,
        payload: data
    }
}

const updateCurrectTransferOrderDetails = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CURRENT_TRANSFER_ORDER_DETAILS,
        payload:data
    }
}

const updateInoviceList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_INVOICE_LIST,
        payload:data
    }
}

const updateCurrentInovoiceDetails =  (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CURRENT_INVOICE_DETAILS,
        payload:data
    }
}

const updateCurrentNotification = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_NOTIFICATIONS,
        payload:data
    }
}

const updateReturnOrderList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_RETURN_ORDER_LIST,
        payload: data
    }
}

const updateCurrentReturnOrderDetails = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CURRENT_RETURN_ORDER_DETAILS,
        payload: data
    }
}

const updateCustomerOrderList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_CUSTOMER_ORDER_LIST,
        payload:data
    }

}


const updatePurchaseRequestList = (data) => {
    return {
        type: Constants.actionConstants.UPDATE_PURCHASE_REQUEST_LIST,
        payload: data
    }
}

const updateCurrentPurchaseRequestDetails = (data) => {
    return {
        type:Constants.actionConstants.UPDATE_PURCHASE_REQUEST_DETAILS,
        payload: data
    }
}


const saveProductListForClone = (data) => {
    return {
        type: Constants.actionConstants.SAVE_PRODUCT_LIST_FOR_CLONE,
        payload: data
    }
}


exports.saveProductListForClone = saveProductListForClone;
exports.updateCurrentPurchaseRequestDetails = updateCurrentPurchaseRequestDetails;
exports.updatePurchaseRequestList = updatePurchaseRequestList;
exports.updateCustomerOrderList = updateCustomerOrderList;
exports.updateReturnOrderList = updateReturnOrderList;
exports.updateCurrentReturnOrderDetails = updateCurrentReturnOrderDetails;
// export default { toggleSideBarAction };
exports.updateCurrentNotification = updateCurrentNotification;
exports.updateInoviceList = updateInoviceList;
exports.updateCurrentInovoiceDetails = updateCurrentInovoiceDetails;
exports.toggleSideBarAction = toggleSideBarAction;
exports.updateProductListAction = updateProductListAction;
exports.updateCurrentProductDetails = updateCurrentProductDetails;
exports.updateUserDetailsAction = updateUserDetailsAction;
exports.updateCustomerList = updateCustomerList;
exports.updateCurrentCusotmerDetails = updateCurrentCusotmerDetails;
exports.updateSupplierList = updateSupplierList;
exports.updateAdjustStockList = updateAdjustStockList;
exports.updateSalesOrderList = updateSalesOrderList;
exports.updateCurrentSalesOrderDetails = updateCurrentSalesOrderDetails;
exports.updateCurrentAdjustStockDetails = updateCurrentAdjustStockDetails;
exports.showNotificationusBar = showNotificationusBar;
exports.hideNotificationBar = hideNotificationBar;
exports.updatePurchaseOrderList = updatePurchaseOrderList;
exports.updateCurrentPurchaseOrderDetails = updateCurrentPurchaseOrderDetails;
exports.updateWarehouseList = updateWarehouseList;
exports.updateTransferOrderList = updateTransferOrderList;
exports.updateCurrectTransferOrderDetails = updateCurrectTransferOrderDetails;