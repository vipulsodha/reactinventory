import React from 'react';

import {connect} from 'react-redux';

import {getPurchaseOrderList, getPurchaseOrderDetails, updatePurchaseOrderReceived, markSalesOrderCompleted, getReturnOrderList, getReturnOrderDetails, updateReturnOrderDone} from '../actions/apiActions';
import {updatePurchaseOrderList, updateCurrentPurchaseOrderDetails, showNotificationusBar, updateReturnOrderList, updateCurrentReturnOrderDetails} from '../actions/actions';

import {Link} from 'react-router';

import {padWithZeros} from '../utility/utility';

import DatePicker from 'react-datepicker';
import Constants from '../constants/constants';

import moment from 'moment';

const mapStateTopProps = (store) => {
    return {
        userDetails: store.userDetails,
        returnOrderList: store.returnOrderList,
        returnOrderDetails: store.currentReturnOrderDetails
    }
}

class ReturnOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.subTotal = 0;
        this.state.receiveDate  = moment();
        this.state.receivedBy = "";
        this.state.packageNumber = "";
        this.state.showPurchaseDetailsModal = false;
        this.state.comment = "";
        this.state.productList = [];
        this.searchOrders = this.searchOrders.bind(this);
        this.orderReceived = this.orderReceived.bind(this);
        this.receiveDateChanged = this.receiveDateChanged.bind(this);
        this.receivedByChanged = this.receivedByChanged.bind(this);
        this.packageNumberChanged = this.packageNumberChanged.bind(this);
        this.markOrderCompleted = this.markOrderCompleted.bind(this);
        this.commentChanged = this.commentChanged.bind(this);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let returnId = this.props.routeParams.returnId;
        this.props.dispatch(updateReturnOrderList(getReturnOrderList(warehouseId)));
        this.props.dispatch(updateCurrentReturnOrderDetails(getReturnOrderDetails(returnId)));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.routeParams.returnId != this.props.routeParams.returnId) {
            let returnId = nextProps.routeParams.returnId;
            this.props.dispatch(updateCurrentReturnOrderDetails(getReturnOrderDetails(returnId)));
        }
    }

    receiveDateChanged(date) {
        this.setState({receiveDate: date});
    }
    receivedByChanged(e) {
        this.setState({receivedBy: e.target.value});
    }
    packageNumberChanged(e) {
        this.setState({packageNumber: e.target.value});
    }
    commentChanged(e) {
        this.setState({comment:e.target.value});
    }

    getOrderListPage(list) {
        let temp = list.map((elem, index) => {
            let link = `/order/return/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td>
                        <Link to={link} activeClassName="sidebar-link-active">
                            <div className="height-100">
                                <div className="row margin-0">
                                    <div className="col-sm-5 truncate">
                                        #{padWithZeros(elem.order_id, 5)}
                                    </div>
                                    <div className="col-sm-5 col-sm-offset-1 truncate">
                                        Rs. {elem.total_amount}
                                    </div>
                                </div>
                                <div className="row margin-0">
                                    <div className="col-sm-12 truncate">
                                        #{padWithZeros(elem.sales_order_id, 5)} | {elem.order_datetime}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </td>
                </tr>
            )
        });
        return temp;
    }

    getOrderProductList(list) {
        let temp = list.map((elem, index) => {
            let link = `/inventory/product/${elem.product_id}`;
            let total = parseInt(elem.quantity_returned) * parseInt(elem.price_per_unit);
            let discountedPrice = total - (total * elem.discount / 100);

            return (
                <tr key={index}>
                    <td>
                        <Link to={link}> #{padWithZeros(elem.product_id, 5)}</Link>
                    </td>
                    <td>
                        {elem.product_name} <br/>({elem.detail})
                    </td>
                    <td>
                        {elem.quantity_returned}
                    </td>
                    <td>
                        {elem.price_per_unit}
                    </td>
                    <td>
                        {elem.discount}
                    </td>
                    <td>
                        {discountedPrice}
                    </td>
                </tr>
            )
        });
        return temp;
    }


    searchOrders(e) {
        let warehouseId = this.props.userDetails.warehouse_id;
        // this.props.dispatch(updatePurchaseOrderList(getPurchaseOrderList(warehouseId,0,0,e.target.value)));
    }

    orderReceived(e) {
        // e.preventDefault();
        // let data = {
        //     order_id:this.props.routeParams.purchaseId,
        //     receive_date: this.state.receiveDate.format("DD/MM/YYYY"),
        //     received_by: this.state.receivedBy,
        //     package_number: this.state.packageNumber,
        //     new_product_list: this.state.productList,
        //     comment: this.state.comment
        // };
        //
        // data.new_product_list = data.new_product_list.filter((elem) => {
        //     return elem.new_quantity_received == 0 || elem.new_quantity_received == "" ? false: true;
        // });
        //
        // if(data.new_product_list.length == 0) {
        //     this.props.dispatch(showNotificationusBar("Please Enter received product quantity", "error"));
        //     return false;
        // }
        //
        // let wareohuseId = this.props.userDetails.warehouse_id;
        // if(updatePurchaseOrderReceived(data, wareohuseId)) {
        //     this.props.dispatch(updateCurrentPurchaseOrderDetails(getPurchaseOrderDetails(data.order_id)));
        //     setTimeout(() => {
        //         this.props.dispatch(showNotificationusBar("Status Updated"));
        //         this.hidePurchaseDetailsModal();
        //     },0);
        // } else {
        //     this.props.dispatch(showNotificationusBar("Something Went Wrong", "error"));
        // }
        // return false;
    }

    markOrderCompleted(e) {
        let order_id = this.props.routeParams.returnId;
        let product_list = this.props.returnOrderDetails.productList;
        let reason = this.props.returnOrderDetails.return_reason;
        let warehouseId = this.props.userDetails.warehouse_id;
        if(updateReturnOrderDone(order_id, product_list, reason, warehouseId)) {
            this.props.dispatch(updateCurrentReturnOrderDetails(getReturnOrderDetails(order_id)));
            setTimeout(() => {
                this.props.dispatch(showNotificationusBar("Return Order Completed"));
                // this.hidePurchaseDetailsModal();
            },0);
        } else {
            this.props.dispatch(showNotificationusBar("Something Went Wrong", "error"));
        }
    }

    getTotal(data, tax) {
        if(data.length == 0) {
            return 0;
        }

        var total = 0;

        data.forEach((elem) => {
            var subTotal = parseInt(elem.quantity_returned) * parseInt(elem.price_per_unit);
            total = total + ( subTotal - (subTotal * (elem.discount / 100)));
        });

        total = total + (tax/100 * total);
        return total;

    }

    render() {
        // let opts ={};
        // opts['className'] = this.state.showPurchaseDetailsModal? "custom-modal-large fadeIn": "display-none";
        console.log(this.props);
        return (
            <div className="custom-container">
                <div className="left-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-7">
                            <h4>Order List</h4>
                        </div>
                    </div>
                    {/*<input className="form-control" placeholder="search order id without 0, date, company name" onChange={this.searchOrders} />*/}
                    <div className="inner-list">
                        <table className="table margin-top-10">
                            <tbody>
                            {this.getOrderListPage(this.props.returnOrderList)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-5 padding-0">
                            <h3>Return Order #{padWithZeros(this.props.returnOrderDetails.order_id, 5)}&nbsp;<br/>
                                {
                                    this.props.returnOrderDetails.order_received?
                                        <span className="label label-info font-12">Received</span>
                                        :
                                        <span className="label label-danger font-12">Not Received</span>
                                }
                            </h3>
                        </div>
                        <div className="col-sm-3">
                            {
                                this.props.returnOrderDetails.order_received ?
                                    ""
                                    :
                                    <div className="form-group">
                                        <button className="form-control btn btn-info margin-top-20 font-12" onClick={this.markOrderCompleted}><i className="glyphicon glyphicon-ok"></i> Order Received</button>
                                    </div>
                            }
                        </div>
                        <div className="col-sm-1 col-sm-offset-3">
                            <Link to="/order/return"><i className="glyphicon glyphicon-remove margin-top-20 font-24"></i></Link>
                        </div>
                    </div>
                    <div className="row margin-0">
                        <div className="col-sm-4">
                            <h4>Order Details:</h4>
                            <span className="span-class"><b>Order Id : </b> #{padWithZeros(this.props.returnOrderDetails.order_id, 5)}</span>
                            <span className="span-class"><b>Order Date : </b>{this.props.returnOrderDetails.order_datetime}</span>
                            <span className="span-class"><b>Sales Order : </b><Link to = {`/order/sales/${this.props.returnOrderDetails.sales_order_id}`}>#{padWithZeros(this.props.returnOrderDetails.sales_order_id,5)}</Link></span>
                            <span className="span-class"><b>Return reason: </b> {Constants.returnReasons[this.props.returnOrderDetails.return_reason]}</span>
                            <span className="span-class"><b>Comments : </b> #{padWithZeros(this.props.returnOrderDetails.order_id, 5)}</span>
                            {
                                this.props.returnOrderDetails.order_received ?
                                    <span className="span-class"><b>Receive Date : </b> {this.props.returnOrderDetails.received_datetime}</span>

                                    :
                                  ""
                            }
                        </div>
                        <div className="col-sm-4 col-sm-offset-2">
                            <span className="span-class"><h4>Customer Details:</h4></span>
                            <span className="span-class"><b>Company Name : </b>{this.props.returnOrderDetails.company_name}</span>
                            <span className="span-class"><b>Customer Name : </b>{this.props.returnOrderDetails.name}</span>
                            <span className="span-class"><b>Email : </b>{this.props.returnOrderDetails.email_id}</span>
                            <span className="span-class"><b>Phone No. : </b>{this.props.returnOrderDetails.ph_no}</span>
                            <span className="span-class"><b>Billing/Shipping Address :</b></span>
                            <span className="span-class">{this.props.returnOrderDetails.company_name}</span>
                            <span className="span-class">{this.props.returnOrderDetails.name}</span>
                            <span className="span-class">{this.props.returnOrderDetails.shipping_address}</span>
                        </div>
                    </div>
                    <h4>Products Returned</h4>
                    <table className="table margin-top-20 lightgray-background">
                        <thead>
                        <tr className="gray-background">
                            <th>Product Id</th>
                            <th>Product Name</th>
                            <th>Quantity Returned</th>
                            <th>Selling Price</th>
                            <th>Discount</th>
                            <th>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getOrderProductList(this.props.returnOrderDetails.productList)}
                        </tbody>
                    </table>
                    <div className="row margin-0">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Tax</span>
                        </div>
                        <div className="col-sm-2 big-font"> {this.props.returnOrderDetails.tax} %</div>
                    </div>
                    <div className="row margin-0">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Total</span>
                        </div>
                        <div className="col-sm-2 big-font">Rs. {this.getTotal(this.props.returnOrderDetails.productList, this.props.returnOrderDetails.tax)}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateTopProps)(ReturnOrderDetails);