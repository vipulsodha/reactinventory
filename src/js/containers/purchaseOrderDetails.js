import React from 'react';

import {connect} from 'react-redux';

import {getPurchaseOrderList, getPurchaseOrderDetails, updatePurchaseOrderReceived, markSalesOrderCompleted, getDataForClone} from '../actions/apiActions';
import {updatePurchaseOrderList, updateCurrentPurchaseOrderDetails, showNotificationusBar, saveProductListForClone} from '../actions/actions';

import {Link} from 'react-router';

import {padWithZeros} from '../utility/utility';
import {hashRedirect} from '../utility/redirectFunctions';

import DatePicker from 'react-datepicker';

import moment from 'moment';

const mapStateTopProps = (store) => {
    return {
        userDetails: store.userDetails,
        purchaseOrderList: store.purchaseOrderList,
        purchaseOrderDetails: store.currentPurchaseOrderDetails
    }
}

class SalesOrderDetails extends React.Component {
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
        this.showPurchaseDetialsModal = this.showPurchaseDetialsModal.bind(this);
        this.hidePurchaseDetailsModal = this.hidePurchaseDetailsModal.bind(this);
        this.newQuantityReceivedChanged = this.newQuantityReceivedChanged.bind(this);
        this.markOrderCompleted = this.markOrderCompleted.bind(this);
        this.commentChanged = this.commentChanged.bind(this);
        this.cloneToPurchaseOrder = this.cloneToPurchaseOrder.bind(this);
    }

    
    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let purchaseId = this.props.routeParams.purchaseId;
        this.props.dispatch(updatePurchaseOrderList(getPurchaseOrderList(warehouseId)));
        this.props.dispatch(updateCurrentPurchaseOrderDetails(getPurchaseOrderDetails(purchaseId)));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.routeParams.purchaseId != this.props.routeParams.purchaseId) {
            let purchaseId = nextProps.routeParams.purchaseId;
            this.props.dispatch(updateCurrentPurchaseOrderDetails(getPurchaseOrderDetails(purchaseId)));
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

    newQuantityReceivedChanged(e) {
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.productList.map((elem, index) => {
            if(elemIndex == index) {
                return {...elem, new_quantity_received:e.target.value};
            }
            return elem;
        });

        this.setState({productList: temp});
    }

    getOrderListPage(list) {
        let temp = list.map((elem, index) => {
            let link = `/order/purchase/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td>
                        <Link to={link} activeClassName="sidebar-link-active">
                            <div className="height-100">
                                <div className="row margin-0">
                                    <div className="col-sm-5 truncate">
                                        {elem.name}
                                    </div>
                                    <div className="col-sm-5 col-sm-offset-1 truncate">
                                        Rs. {elem.total_amount}
                                    </div>
                                </div>
                                <div className="row margin-0">
                                    <div className="col-sm-12 truncate">
                                        #{padWithZeros(elem.order_id, 5)} | {elem.order_datetime}
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
            return (
                <tr key={index}>
                    <td>
                        <Link to={link}> #{padWithZeros(elem.product_id, 5)}</Link>
                    </td>
                    <td>
                        {elem.product_name} <br/>({elem.detail})
                    </td>
                    <td className="text-center">
                        {elem.quantity_ordered}
                    </td>
                    <td className="text-center">
                        {elem.per_unit_price}
                    </td>
                    <td className="text-center+">
                        {elem.order_total_amount}
                    </td>
                    <td className="text-center">
                        {elem.quantity_received}
                    </td>
                </tr>
            )
        });
        return temp;
    }

    showPurchaseDetialsModal() {
        let productList = this.props.purchaseOrderDetails.productList.map((elem) => {
                return {...elem, new_quantity_received:0, comment:""};
        });

        this.setState({showPurchaseDetailsModal: true, receiveDate: moment(), packageNumber:"", receivedBy:"", productList: productList});
    }

    hidePurchaseDetailsModal() {

        this.setState({showPurchaseDetailsModal: false});
    }

    searchOrders(e) {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updatePurchaseOrderList(getPurchaseOrderList(warehouseId,0,0,e.target.value)));
    }

    orderReceived(e) {
        e.preventDefault();
        let data = {
            order_id:this.props.routeParams.purchaseId,
            receive_date: this.state.receiveDate.format("DD/MM/YYYY"),
            received_by: this.state.receivedBy,
            package_number: this.state.packageNumber,
            new_product_list: this.state.productList,
            comment: this.state.comment
        };

        data.new_product_list = data.new_product_list.filter((elem) => {
                return elem.new_quantity_received == 0 || elem.new_quantity_received == "" ? false: true;
        });

        if(data.new_product_list.length == 0) {
            this.props.dispatch(showNotificationusBar("Please Enter received product quantity", "error"));
            return false;
        }


        let wareohuseId = this.props.userDetails.warehouse_id;
        if(updatePurchaseOrderReceived(data, wareohuseId)) {
            this.props.dispatch(updateCurrentPurchaseOrderDetails(getPurchaseOrderDetails(data.order_id)));
            setTimeout(() => {
                this.props.dispatch(showNotificationusBar("Status Updated"));
                this.hidePurchaseDetailsModal();
            },0);
        } else {
            this.props.dispatch(showNotificationusBar("Something Went Wrong", "error"));
        }
        return false;
    }

    markOrderCompleted(e) {
        let order_id = this.props.routeParams.purchaseId;
        if(markSalesOrderCompleted(order_id)) {
            this.props.dispatch(updateCurrentPurchaseOrderDetails(getPurchaseOrderDetails(order_id)));
            setTimeout(() => {
                this.props.dispatch(showNotificationusBar("Order Completed"));
                this.hidePurchaseDetailsModal();
            },0);
        } else {
            this.props.dispatch(showNotificationusBar("Something Went Wrong", "error"));
        }
    }

    getReceiveLogsList(list) {

        if(list.length == 0) {
            return (
                <tr key={0}>
                    <td>No Records</td>
                </tr>
            )
        }

        var tempArray = {};

        list.forEach((elem) => {
            if(elem.package_number in tempArray) {
                // console.log(tempArray);
                tempArray[elem.package_number].products.push(elem);
            } else {
                tempArray[elem.package_number] = {
                    package_number: elem.package_number,
                    receive_date:elem.receive_date,
                    received_by: elem.received_by,
                    comment:elem.comment,
                    products:[elem]
                }
            }
        });

        var outerTemp = [];

        Object.keys(tempArray).forEach((oElem, oIndex) => {
            let temp = tempArray[oElem].products.map((elem, index) => {
                return (
                        <tr key={index} className="lightgray-background">
                            <td>{elem.product_name}</td>
                            <td>{elem.quantity_received}</td>
                        </tr>
                    )
            });
            temp = [(<tr key={`xyz${oIndex}`} className="light-background">
                <td><b>Pakage Number:</b> {tempArray[oElem].package_number} | <b>Date: </b>{tempArray[oElem].receive_date} | <b>Received by: </b>{tempArray[oElem].received_by}
                    <br/>
                    <b>Comment :</b> {tempArray[oElem].comment || 'No Comments'}
                </td><td></td>
            </tr>), ...temp];
            outerTemp.push(temp);

        });

        // console.log(outerTemp);
        return outerTemp;
        // let temp = list.map((elem, index) => {
        //     return (
        //         <tr key={index}>
        //             <td>{elem.product_name}</td>
        //             <td>{elem.quantity_received}</td>
        //             <td>{elem.receive_date}</td>
        //             <td>{elem.received_by}</td>
        //             <td>{elem.package_number}</td>
        //         </tr>
        //     )
        // });
        // return temp;
    }

    getModalProductList(list) {
        let temp = list.map((elem, index) => {
            let remaining = (elem.quantity_ordered - elem.quantity_received) - this.state.productList[index].new_quantity_received;
            return (
                <div className="row margin-0" key={index}>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>Product</label>
                            <div className="auto-complete-div"><span className="auto-complete-value">{elem.product_name}</span></div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>New quantity Received</label>
                            <input  data-index={index} className="form-control" type="number" required="required" min="0" value={this.state.productList[index].new_quantity_received} onChange={this.newQuantityReceivedChanged}/>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>Quantity Remaining</label>
                            <div className="auto-complete-div"><span className="auto-complete-value">{remaining }</span></div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>Quantity Ordered</label>
                            <div className="auto-complete-div"><span className="auto-complete-value">{elem.quantity_ordered}</span></div>
                        </div>
                    </div>
                </div>
            )
        });
        return temp;
    }

    cloneToPurchaseOrder() {

        this.props.dispatch(saveProductListForClone(getDataForClone(this.props.purchaseOrderDetails.productList, this.props.userDetails.warehouse_id)));

        hashRedirect("/order/purchase/add?clone=list");

    }
    componentDidMount() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });

    }

    render() {
        let opts ={};
        opts['className'] = this.state.showPurchaseDetailsModal? "custom-modal-large fadeIn": "display-none";
        console.log(this.props);
        return (
            <div className="custom-container">
                <div {...opts} id="purchase_details">
                    <div className="header">
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.hidePurchaseDetailsModal}></i>
                        <h3>Enter Receiving details</h3>
                    </div>
                    <form onSubmit={this.orderReceived} className="height-85p float-left">
                        <div className="info-container">
                            <div className="col-sm-3">
                                <div className="form-group">
                                    <label>Date</label>
                                    <DatePicker selected = {this.state.receiveDate} onChange={this.receiveDateChanged}/>
                                </div>
                            </div>
                            <div className="col-sm-3 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Package Number</label>
                                    <input className="form-control" type="text" required="required" value={this.state.packageNumber} onChange={this.packageNumberChanged}/>
                                </div>
                            </div>
                            <div className="col-sm-3 col-sm-offset-1">
                                <label>Received by</label>
                                <input className="form-control" type="text" required="required" value={this.state.receivedBy} onChange={this.receivedByChanged}/>
                            </div>

                        </div>
                        <div className="float-left width-100 height-65p overflow-auto">
                            {this.getModalProductList(this.state.productList)}
                        </div>
                        {/*<div className="row">*/}
                            <div className="col-sm-10">
                               <div className="form-group">
                                   <textarea className="form-control resize-off" placeholder="Enter Comment.." value={this.state.comment} onChange={this.commentChanged}>

                                   </textarea>
                               </div>
                            </div>
                            <div className="col-sm-2">
                                <div className="form-group">
                                    <input type="submit" className="form-control btn btn-primary"/>
                                </div>
                            </div>
                        {/*</div>*/}
                    </form>
                </div>
                <div className="left-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-7">
                            <h4>Order List</h4>
                        </div>
                        <div className="col-sm-4 col-sm-offset-1">
                            <div className="form-group">
                                <Link to="/order/purchase/add"><button className="btn btn-success form-control"><i className="glyphicon glyphicon-plus"></i> New</button></Link>
                            </div>
                        </div>
                    </div>
                    <input className="form-control" placeholder="search order id without 0, date, company name" onChange={this.searchOrders} />
                    <div className="inner-list">
                        <table className="table margin-top-10">

                            <tbody>
                            {this.getOrderListPage(this.props.purchaseOrderList)}

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-5 padding-0">
                            <h3>Purchase Order #{padWithZeros(this.props.purchaseOrderDetails.order_id, 5)}&nbsp;<br/>
                                {
                                    this.props.purchaseOrderDetails.order_received ?
                                        <span className="label label-success font-12"><i className="glyphicon glyphicon-ok"></i> Received</span>
                                        :
                                        this.props.purchaseOrderDetails.partially_received?
                                            <span className="label label-info font-12">Receiving</span>
                                            :
                                            <span className="label label-danger font-12">Not Received</span>
                                }
                            </h3>
                        </div>
                        <div className="col-sm-2">
                            {
                                this.props.purchaseOrderDetails.order_received ?
                                    ""
                                    :
                                    <div className="form-group">
                                        <button className="form-control btn btn-info margin-top-20 font-12"
                                                onClick={this.showPurchaseDetialsModal}><i className="glyphicon glyphicon-import"></i> Receive
                                        </button>
                                    </div>
                            }
                        </div>
                        <div className="col-sm-2">

                            {
                                this.props.purchaseOrderDetails.order_received ?
                                    ""
                                    :
                                    <div className="form-group">
                                        <button className="form-control btn btn-primary margin-top-20 font-12" onClick={this.markOrderCompleted}><i className="glyphicon glyphicon-ok"></i>Complete</button>
                                    </div>
                            }
                        </div>
                        <div className="col-sm-2">

                            <div className="form-group">
                                <button data-toggle="tooltip" title="Clone Order" className="btn btn-primary form-control margin-top-20 font-12" onClick={this.cloneToPurchaseOrder}><i className="glyphicon glyphicon-copy"></i> Clone</button>
                            </div>
                        </div>
                        <div className="col-sm-1">
                            <Link to="/order/purchase"><i className="glyphicon glyphicon-remove margin-top-20 font-24"></i></Link>
                        </div>
                    </div>
                    <div className="row margin-0">

                        <div className="col-sm-4">
                            <h4>Order Details:</h4>
                            <span className="span-class"><b>Order Id : </b> #{padWithZeros(this.props.purchaseOrderDetails.order_id, 5)}</span>
                            <span className="span-class"><b>Order Date : </b>{this.props.purchaseOrderDetails.order_datetime}</span>
                        </div>
                        <div className="col-sm-4 col-sm-offset-2">
                            <span className="span-class"><h4>Supplier Details:</h4></span>
                            <span className="span-class"><b>SupplierName : </b>{this.props.purchaseOrderDetails.name}</span>
                            <span className="span-class"><b>Email : </b>{this.props.purchaseOrderDetails.email_id}</span>
                            <span className="span-class"><b>Phone No. : </b>{this.props.purchaseOrderDetails.ph_no}</span>
                        </div>
                    </div>
                    <h4>Products Ordered</h4>
                    <table className="table margin-top-20 lightgray-background">
                        <thead>
                        <tr className="gray-background">
                            <th>Product Id</th>
                            <th>Product Name</th>
                            <th>Quantity Ordered</th>
                            <th>Purchase Price (Rs.)</th>
                            <th>Total Amount (Rs.)</th>
                            <th>Quantity Received</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getOrderProductList(this.props.purchaseOrderDetails.productList)}
                        </tbody>
                    </table>
                    <div className="row margin-0">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Sub Total</span>
                        </div>
                        <div className="col-sm-2 big-font">Rs. {this.props.purchaseOrderDetails.total_amount}</div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Total</span>
                        </div>
                        <div className="col-sm-2 big-font"> Rs. {this.props.purchaseOrderDetails.total_amount}</div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font"><h4>Cost of Received Stock:</h4></span>
                        </div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Total</span>
                        </div>
                        <div className="col-sm-2 big-font"> Rs. {this.props.purchaseOrderDetails.total_received_amount}</div>
                    </div>
                    <h4>Products Receive log</h4>
                    <table className="table margin-top-20">
                        <thead>
                        <tr className="gray-background">
                            <th>Product Name</th>
                            <th>Quantity Received</th>
                        </tr>
                        </thead>
                        <tbody>

                        {this.getReceiveLogsList(this.props.purchaseOrderDetails.receiveLogs)}

                        </tbody>
                    </table>
                </div>
            </div>
        )

    }
}

export default connect(mapStateTopProps)(SalesOrderDetails);