/**
 * Created by vipulsodha on 04/12/16.
 */
import { combineReducers } from 'redux';

import sideBarReducer from './sideBarReducer';
import productListReducer from './productListReducer';
import currentProductDetails from './productDetailsReducer';
import userReducer from './userReducer'
import customerListReducer from './customerListReducer';
import customerDetailsReducer from './customerDetailsReducer';
import supplierListReducer from './supplierListReducer';
import adjustStockListReducer from './adjustStockListReducer';

import adjustStockDetailReducer from './adjustStockDetailReducer';

import salesOrderListReducer from './saleOrderListReducer';

import salesOrderDetailsReducer from './salesOrderDetailsReducer';

import notificationBarReducer from './notificationBarReducer';

import purchaseOrderListReducer from './purchaseOrderListReducer';
import purchaseOrderDetailReducer from './purchaseOrderDetailsReducer';

import warehouseListReduer from './warehouseListReducer';

import transferOrderListReducer from './transferOrderListReducer';
import transferOrderDetailReducer from  './transferOrderDetailsReducer';

import invoiceListReducer from './invoiceListReducer';
import invoiceDetailsReducer from './invoiceDetailsReducer';

import notificationReducer from './notificationReducer';

import returnOrderListReducer from './returnOrderListReducre';

import  returnOrderDetailsReducer from './returnOrderDetailsReducer';
import customerOrdersReducer from './customerOrdersReducer';

import purchaseRequestListReducer from './purchaseRequestListReducer';

import purchaseRequestDetailsReducer from './purchaseRequestDetailsReducer';
import productListForCloneReducer from './productListCloneReducer';

export default combineReducers({
    userDetails:userReducer,
    sideBar: sideBarReducer,
    productList: productListReducer,
    currentProductDetails:currentProductDetails,
    customerList:customerListReducer,
    currentCustomerDetails:customerDetailsReducer,
    supplierList: supplierListReducer,
    adjustStockList:adjustStockListReducer,
    currentAdjustStockDetails:adjustStockDetailReducer,
    salesOrderList:salesOrderListReducer,
    currentSalesOrderDetails: salesOrderDetailsReducer,
    notificationStatus:notificationBarReducer,
    purchaseOrderList: purchaseOrderListReducer,
    currentPurchaseOrderDetails: purchaseOrderDetailReducer,
    warehouseList: warehouseListReduer,
    transferOrderList: transferOrderListReducer,
    currentTransferOrderDetails:transferOrderDetailReducer,
    invoiceList: invoiceListReducer,
    currentInvoiceDetails: invoiceDetailsReducer,
    notifications: notificationReducer,
    returnOrderList: returnOrderListReducer,
    currentReturnOrderDetails: returnOrderDetailsReducer,
    customerOrderList: customerOrdersReducer,
    purchaseRequestList:purchaseRequestListReducer,
    purchaseRequestDetails: purchaseRequestDetailsReducer,
    productListClone: productListForCloneReducer
});
