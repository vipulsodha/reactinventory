import {Router, Route, hashHistory, IndexRoute, IndexRedirect} from 'react-router';
import React from 'react';
import Test from '../components/test';
import Parent from '../containers/parent';
import Home from '../components/home';
import Container from '../containers/container';
import * as LoginFunctions from '../utility/loginFunctions';

import SalesOrderList from '../containers/salesOrderList';
import PurchaseOrderList from '../containers/purchaseOrderList';
import ReturnOrderList from '../containers/returnOrderList';
import InventoryList from '../containers/inventoryList';

import AddSalesOrder from '../containers/addSalesOrder';
import AddPurchaseOrder from '../containers/addPurchaseOrder';
import AddProductInventory from '../containers/addInventoryProduct';
import AddInventoryWarehouse from '../containers/addInventoryWarehouse';
import ProductDetails from '../containers/productDetails';
import SalesOrderDetails from '../containers/salesOrderDetails';
import PurchaseOrderDetails from '../containers/purchaseOrderDetails';
import ReturnOrderDetails from '../containers/returnOrderDetails';
import EditProductDetails from '../containers/editProductDetails';
import InvoiceList from '../containers/invoiceList';
import InvoiceDetails from '../containers/invoiceDetails';
import WarehouseDetails from '../containers/warehouseDetails';
import NotFound from '../containers/Notfound';
import AddNewProductCategory from '../containers/addProductCategory';

import CustomerList from '../containers/customerList';
import SupplierList from '../containers/supplierList';
import AddNewCustomer from '../containers/addNewCustomer'
import AddNewSupplier from '../containers/addNewSupplier';
import CustomerDetails from '../containers/customerDetails';

import StockAdjustmentList from '../containers/stockAdjustmentList';
import StockAdjustmentAdd from '../containers/stockAdjustmentAdd';
import StockAdjustmentDetails from  '../containers/stockAdjustmentDetais';
import AddTransferOrder from '../containers/addTransferOrder';

import TransferOrderList from '../containers/transferOrderList';
import TransferOrderDetails from '../containers/transferOrderDetails';

import CustomerOrders  from '../containers/customerOrders';
import PurchaseRequestList from '../containers/purchaseRequestList';
import PurchaseRequestDetails from '../containers/purchaseRequestDetails';
import AddPurchaseRequest from '../containers/addPurchaseRequest';


import {showNotificationusBar} from '../actions/actions';
import {connect} from 'react-redux';

import {updateUserDetailsAction} from '../actions/actions';
import {getUserDetails} from '../actions/apiActions';

import Constants from '../constants/constants';

import AccessNotAllowed from '../containers/accessNotAllowed';
import store from "../store";


export  default  class AppRouter extends React.Component {

	constructor(props) {
		super(props);
		this.userCheckLoggedIn = this.userCheckLoggedIn.bind(this);
		this.checkUserRoles = this.checkUserRoles.bind(this);
		this.state = {};
		this.state.userDetails = getUserDetails();
	}

	userCheckLoggedIn(nextState, replace) {
			LoginFunctions.redirectLogin();
	}



	checkUserRoles(history, roles) {

		let myRoleId = this.state.userDetails.role_id;

		return (nextState, replace) => {
			if(!(myRoleId in roles)) {
				history.goBack();
				store.dispatch(showNotificationusBar("Not Allowed to access", "error"));
			}
		}
	}

	hello(history) {

		return (nextState, replace) => {
			store.dispatch(showNotificationusBar("Not Allowed to access", "error"));
		}
	}

	render() {

		return (
			<Router history={hashHistory} >
					<Route path="/" component={Parent} onEnter={this.userCheckLoggedIn}>
						{
							this.state.userDetails.role_id==4?
								<IndexRedirect to="inventory" />
								:
								<IndexRedirect to="dashboard" />

						}
						<Route path="/dashboard" component={Home}  onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
						<Route path="/inventory" component={InventoryList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.INVENTORY)}/>
						<Route path="/inventory/product/add" component={AddProductInventory} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.INVENTORY)}/>
                        <Route path="/inventory/adjust/add" component={StockAdjustmentAdd} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.WAREHOUSE_MANAGER)}/>
						<Route path="/inventory/adjust" component={StockAdjustmentList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.WAREHOUSE_MANAGER)}>
							<Route path=":adjustId" component={StockAdjustmentDetails}  onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.WAREHOUSE_MANAGER)}/>
						</Route>

						<Route path="/inventory/product/:productId" component={ProductDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.INVENTORY)}/>
						<Route path="/inventory/product/:productId/edit" component={EditProductDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.INVENTORY)}/>
						<Route path="/inventory/warehouse/add" component={AddInventoryWarehouse} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.INVENTORY)}/>

						{/*<Route path="/inventory/warehouse/:warehouseId" component={WarehouseDetails} />*/}
						{/*<Route path="/inventory/category/:categoryId" component={Test} />*/}
						{/*<Route path="/inventory/warehouse/:warehouseId/category/:categoryId" component={Test} />*/}
						<Route path="/order" component={Container} >
							<Route path="transfer" component={TransferOrderList} onEnter={this.checkUserRoles(hashHistory,Constants.userRoles.WAREHOUSE_MANAGER)}/>
							<Route path="transfer/add" component={AddTransferOrder} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.WAREHOUSE_MANAGER)}/>
							<Route path="transfer/:transferId" component={TransferOrderDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.WAREHOUSE_MANAGER)}/>
							<IndexRedirect to="sales" />
							<Route path="sales" component={SalesOrderList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>
							<Route path="sales/add" component={AddSalesOrder} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>
							<Route path="sales/:salesId" component={SalesOrderDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>

							<Route path="purchase" component={PurchaseOrderList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.PURCHASE)}/>
							<Route path="purchase/add" component={AddPurchaseOrder} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.PURCHASE)}/>
							<Route path="purchase/:purchaseId" component={PurchaseOrderDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.PURCHASE)}/>

							<Route path="return" component={ReturnOrderList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>
							{/*<Route path="return/add" component={Login}/>*/}
							<Route path="return/:returnId" component={ReturnOrderDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>
						</Route>
						<Route path="/invoice" component={InvoiceList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>
						<Route path="/invoice/:invoiceId" component={InvoiceDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>

						<Route path="/customer/add" component={AddNewCustomer} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
						<Route path="/customers" component={CustomerList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}>
							<Route path=":customerId" component={CustomerDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
							<Route path=":customerId/orders" component={CustomerOrders} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
						</Route>
						<Route path="/supplier" component={SupplierList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
						<Route path="/supplier/add" component={AddNewSupplier} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
						<Route path="/supplier" component={SupplierList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
						<Route path="/request" component={Container} >
							<IndexRedirect to="purchase" />
							<Route path="purchase/add" component={AddPurchaseRequest} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.SALES)}/>
							<Route path="purchase" component={PurchaseRequestList} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}>
								<Route path=":requestId" component={PurchaseRequestDetails} onEnter={this.checkUserRoles(hashHistory, Constants.userRoles.ORDERS)}/>
							</Route>
							{/*<Route path="purchase/:requestId" component={Test}/>*/}
						</Route>
						<Route path="*" component={NotFound}/>
					</Route>
			</Router>
		)
	}
}

