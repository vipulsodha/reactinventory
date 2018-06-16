/**
 * Created by vipulsodha on 05/12/16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {updateProductListAction, updateCurrentProductDetails} from '../actions/actions';
import {getProductList, getProductDetails} from  '../actions/apiActions';

import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        productList: store.productList,
        currentProductDetails: store.currentProductDetails,
        userDetails: store.userDetails
    }
}


class ProductDetails extends React.Component {
    constructor(props) {
        super(props);

        this.searchChanged = this.searchChanged.bind(this);

        this.state = {};
        this.state.searchPattern = "";
    }
    componentWillReceiveProps(nextProps) {
        let pattern = this.state.searchPattern;
        if(this.props.productList && this.props.productList.length != 0 && this.props.productList.toString() != nextProps.productList.toString()) {
            this.props.dispatch(updateProductListAction(getProductList(0,0,0,0,pattern)));
        }

        if(nextProps.routeParams.productId != this.props.routeParams.productId) {
            let warehouseId = this.props.userDetails.warehouse_id;
            let productId = nextProps.routeParams.productId;
            this.props.dispatch(updateCurrentProductDetails(getProductDetails(productId, warehouseId)));
        }
    }

    componentWillMount() {
        let pattern = this.state.searchPattern;
        let warehouseId = this.props.userDetails.warehouse_id;
        let productId = this.props.routeParams.productId;
        this.props.dispatch(updateProductListAction(getProductList(0,0,0,0,pattern)));
        this.props.dispatch(updateCurrentProductDetails(getProductDetails(productId, warehouseId)));
    }

    componentWillUpdate() {
        // console.log("Updating");
    }

    getProductPageList(products) {

        if(products.length < 1) {
            return (null);
        }

        let temp = products.map((elem, index) => {

            let link = `/inventory/product/${elem.product_id}`;
            return (
                <tr key ={index}>
                   <td><Link to={link} activeClassName="sidebar-link-active"> {elem.product_name} ({elem.detail})</Link></td>
                </tr>
            )
        });
        return temp;
    }

    getProductDetails(currentProductDetails) {
        return (
            <div className="info-container">
                <img className="product_image border-1" />
                <span className="span-class "><b>Category : </b>{currentProductDetails.category_name || ""}</span>
                <span className="span-class "><b>Code : </b>{currentProductDetails.code}</span>
                <span className="span-class "><b>Detail : </b>{currentProductDetails.detail}</span>
                <span className="span-class "><b>Maker : </b>{currentProductDetails.maker}</span>
                <span className="span-class "><b>
                    {
                        currentProductDetails.quantity_available > (currentProductDetails.threshold + 100 ) ?
                            <i className="glyphicon glyphicon-record success-font"></i>
                            :
                            currentProductDetails.quantity_available > currentProductDetails.threshold  ?
                                <i className="glyphicon glyphicon-record primary-font"></i>
                                :
                                <i className="glyphicon glyphicon-record error-font"></i>
                    }

                    Your warehouse quantity ({this.props.userDetails.warehouse_location}) : </b> {currentProductDetails.quantity_available}<br/>
                    {
                        currentProductDetails.quantity_available < (currentProductDetails.threshold + 100 ) ?
                            this.props.userDetails.role_id ==2?
                                <span><Link to="/order/purchase/add">Purchase Stock</Link></span>
                                    :
                                this.props.userDetails.role_id ==3?
                                    <span><Link to="/request/purchase/add">Create Purchase Request</Link></span>
                                        :
                                    this.props.userDetails.role_id ==1?
                                        <span><Link to="/order/purchase/add">Purchase Stock | </Link><Link to="/order/transfer/add">Transfer Stock</Link></span>
                                            :
                                            ""
                            :
                            ""
                    }
                </span>
                <span className="span-class "><b>Threshold : </b> {currentProductDetails.threshold}</span>
                <span className="span-class "><b>Total Quantity(All warehouse) : </b> {currentProductDetails.total_quantity}</span>
            </div>
        )
    }

    getInitialOrderList(initialOrders, selling_price) {
        let temp =  initialOrders.map((elem, index) => {
            return (
                <tr key={index}>
                   <td>#{padWithZeros(index + 1,5)}</td>
                    <td>{elem.datetime}</td>
                    <td>{elem.initial_quantity}</td>
                    <td>{elem.initial_quantity * selling_price}</td>
                    <td>{selling_price}</td>
                    <td><span className="label label-success">Completed</span></td>
                </tr>
            )
        });

        if(temp.length < 1) {
            temp = [(<tr key={Math.floor(Math.random() * 200)}><td>No Records</td></tr>)]
        }
        let header = (<tr className="gray-background" key={Math.floor(Math.random() * 200)}><th>Initial Stock</th><th></th><th></th><th></th><th></th><th></th></tr>);
        temp = [header, ...temp];
        return temp;
    }

    getAdjustmentList (list) {
        let temp = list.map((elem, index) => {
            let link = `/inventory/adjust/${elem.adjust_id}`;
            return (
                <tr key={index}>
                    <td><Link to={link}>#{padWithZeros(elem.adjust_id, 5)}</Link></td>
                    <td>{elem.adjust_datetime}</td>
                    <td>{elem.quantity}</td>
                    <td>{elem.adjust_reason}</td>
                </tr>
            )
        });

        if(temp.length < 1) {
            temp = [(<tr key={Math.floor(Math.random() * 200)}><td>No Records</td></tr>)]
        }


        return temp;
    }

    getSalesOrderList(orders, orderType) {

        let temp =  orders.map((elem, index) => {
            let link;
            if(orderType == "Sales Orders") {
                link = `/order/sales/${elem.order_id}`
            } else if(orderType == "Purchase Orders") {
                link = `/order/purchase/${elem.order_id}`
            }
            return (
                <tr key ={index}>
                    <td><Link to={link}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td>{elem.quantity}</td>
                    <td>{elem.total_price}</td>
                    <td>{elem.per_unit_price}</td>
                    <td>
                        {
                            elem.order_cancel?
                                <span className="label label-danger">Canceled</span>
                                :
                                elem.shipping_done?
                                    <span className="label label-success">Completed</span>
                                    :
                                    <span className="label label-info">Processing</span>
                        }
                    </td>
                </tr>
            )
        });

        if(temp.length < 1) {
            temp = [(<tr key={Math.floor(Math.random() * 200)}><td>No Records</td></tr>)]
        }
        let header = (<tr className="gray-background" key={Math.floor(Math.random() * 200)}><th>{orderType}</th><th></th><th></th><th></th><th></th><th></th></tr>);
        temp = [header, ...temp];
        return temp;
    }

    getPurchaseOrderList(orders, orderType) {

        let temp =  orders.map((elem, index) => {
            let link;
            if(orderType == "Sales Orders") {
                link = `/order/sales/${elem.order_id}`
            } else if(orderType == "Purchase Orders") {
                link = `/order/purchase/${elem.order_id}`
            }
            return (
                <tr key ={index}>
                    <td><Link to={link}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td>{elem.quantity_ordered}</td>
                    <td>{elem.order_total_amount}</td>
                    <td>{elem.per_unit_price}</td>
                    <td>
                        {
                            elem.order_received?
                                <span className="label label-success">Received</span>
                                :
                                <span className="label label-info">Waiting</span>
                        }
                    </td>
                </tr>
            )
        });

        if(temp.length < 1) {
            temp = [(<tr key={Math.floor(Math.random() * 200)}><td>No Records</td></tr>)]
        }
        let header = (<tr className="gray-background" key={Math.floor(Math.random() * 200)}><th>{orderType}</th><th></th><th></th><th></th><th></th><th></th></tr>);
        temp = [header, ...temp];
        return temp;
    }

    getOtherWareHouseList(list) {
        let temp = list.map((elem, index) => {

            return(
                <tr key={index}>
                    <td>{elem.warehouse_name}</td>
                    <td>{elem.warehouse_location}</td>
                    <td>{elem.quantity_available}</td>
                </tr>
            )
        });
        return temp;
    }

    searchChanged(e) {
        let pattern = e.target.value;
        this.state.searchPattern = pattern;

        this.props.dispatch(updateProductListAction(getProductList(0,0,0,0,pattern)));
    }

    getTransferOrderList(list) {
        if(list.length < 1) {
            let temp = [(<tr key="0"><td>No Records</td></tr>)];
            return temp;
        }

        let temp = list.map((elem, index) => {
            let link = `/order/transfer/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td><Link to = {link}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td>{elem.from_warehouse_location}</td>
                    <td>{elem.to_warehouse_location}</td>
                    <td>{elem.quantity_transfered}</td>
                </tr>
            )
        });
        return temp;
    }

    render() {
        console.log(this.props);
        return (
           <div className="custom-container">
               <div className="row margin-0">
                   <div className="col-sm-7">
                       <b>Status : </b>&nbsp;<i className="glyphicon glyphicon-record success-font"></i>&nbsp;Enough Stock&nbsp;<i className="glyphicon glyphicon-record primary-font"></i>&nbsp;Near threshold&nbsp;<i className="glyphicon glyphicon-record error-font"></i>&nbsp;Less than threshold&nbsp;
                   </div>
               </div>
               <div className="left-div">
                    <div className="row margin-0">
                        <div className="col-sm-7">
                            <h4>Product List</h4>
                        </div>
                        <div className="col-sm-4 col-sm-offset-1">
                            <div className="form-group">
                                <Link to="/inventory/product/add"><button className="btn btn-success form-control"><i className="glyphicon glyphicon-plus"></i> New</button></Link>
                            </div>
                        </div>
                    </div>
                   <div className="form-group">
                       <input className="form-control" placeholder="search product name, code, detail" onChange={this.searchChanged}/>
                   </div>

                   <div className="inner-list">

                        <table className="table">
                            <tbody>
                            {this.getProductPageList(this.props.productList)}
                            </tbody>
                        </table>
                   </div>
               </div>
               <div className="right-div">
                    
                    <div className="row margin-0">
                        <div className="col-sm-8 padding-0">
                            <h3>{
                                this.props.currentProductDetails.productDetails.quantity_available > (this.props.currentProductDetails.productDetails.threshold + 100 ) ?
                                    <i className="glyphicon glyphicon-record success-font"></i>
                                    :
                                    this.props.currentProductDetails.productDetails.quantity_available > this.props.currentProductDetails.productDetails.threshold  ?
                                        <i className="glyphicon glyphicon-record primary-font"></i>
                                        :
                                        <i className="glyphicon glyphicon-record error-font"></i>
                            }

                                &nbsp;{this.props.currentProductDetails.productDetails.product_name} <Link to={`/inventory/product/${this.props.routeParams.productId}/edit`}><i className="glyphicon glyphicon-pencil"></i></Link></h3>
                        </div>
                        <div className="col-sm-1 col-sm-offset-3">
                            <Link to="/inventory/"><i className="glyphicon glyphicon-remove margin-top-20 font-24"></i></Link>
                        </div>
                    </div>
                   {this.getProductDetails(this.props.currentProductDetails.productDetails)}

                   {
                       this.props.userDetails.role_id == 4 ?
                           ""
                           :


                           <div>

                               <div className="list-container">
                                   <h4>Adjustments</h4>
                                   <table className="table">
                                       <thead>
                                       <tr>
                                           <th>Adjustment Id</th>
                                           <th>Date</th>
                                           <th>Quantity Adjusted</th>
                                           <th>Reason</th>
                                       </tr>
                                       </thead>
                                       <tbody>
                                       {this.getAdjustmentList(this.props.currentProductDetails.productAdjustDetails)}
                                       </tbody>
                                   </table>
                               </div>
                               <div className="list-container">
                                   <h4>Transfers</h4>
                                   <table className="table">
                                       <thead>
                                       <tr>
                                           <th>Order Id</th>
                                           <th>Date</th>
                                           <th>From</th>
                                           <th>To</th>
                                           <th>Quantity</th>
                                       </tr>
                                       </thead>
                                       <tbody>
                                       {this.getTransferOrderList(this.props.currentProductDetails.productTransferDetails)}
                                       </tbody>
                                   </table>
                               </div>
                               <div className="list-container">
                                   <h4>Orders</h4>
                                   <table className="table">
                                       <thead>
                                       <tr>
                                           <th>Order Id</th>
                                           <th>Date</th>
                                           <th>Quantity</th>
                                           <th>Total Amount</th>
                                           <th>Price per quantity</th>
                                           <th>Status</th>
                                       </tr>
                                       </thead>
                                       <tbody>
                                       {this.getInitialOrderList(this.props.currentProductDetails.orderDetails.initialOrder, this.props.currentProductDetails.productDetails.selling_price_per_unit)}
                                       {this.getSalesOrderList(this.props.currentProductDetails.orderDetails.salesOrders, "Sales Orders")}
                                       {this.getPurchaseOrderList(this.props.currentProductDetails.orderDetails.purchaseOrders, "Purchase Orders")}
                                       </tbody>
                                   </table>
                               </div>
                               <div className="list-container">
                                   <h4>Other warehouse availability</h4>
                                   <table className="table">
                                       <thead>
                                       <tr>
                                           <th>Warehouse name</th>
                                           <th>Location</th>
                                           <th>Quantity</th>
                                       </tr>
                                       </thead>
                                       <tbody>
                                       {this.getOtherWareHouseList(this.props.currentProductDetails.otherWareHouseDetails)}
                                       </tbody>
                                   </table>
                               </div>
                               {/*This div*/}
                           </div>
                   }
               </div>
           </div>
        )
    }
}
ProductDetails.defaultProps = {

}

export default connect(mapStateToProps)(ProductDetails);
