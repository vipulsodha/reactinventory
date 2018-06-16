import React from 'react';

import {connect} from 'react-redux';

import {getTransferOrderList, getTransferOrderDetails, updateTransferOrderApproved, updateTransferOrderReceived, updateTransferOrderReject, saveNotification} from '../actions/apiActions';
import {updateTransferOrderList, updateCurrectTransferOrderDetails, showNotificationusBar} from '../actions/actions';

import {Link} from 'react-router';

import {padWithZeros} from '../utility/utility';

const mapStateTopProps = (store) => {
    return {
        userDetails: store.userDetails,
        transferOrderList: store.transferOrderList,
        transferOrderDetails: store.currentTransferOrderDetails
    }
}

class SalesOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.subTotal = 0;
        this.state.rejectReason = "";
        this.state.showRejectReasonModal = false;
        this.searchOrders = this.searchOrders.bind(this);
        this.orderReceived = this.orderReceived.bind(this);
        this.orderApprove = this.orderApprove.bind(this);
        this.closeRejectModal = this.closeRejectModal.bind(this);
        this.showRejectModal = this.showRejectModal.bind(this);
        this.rejectReasonChanged = this.rejectReasonChanged.bind(this);
        this.orderReject = this.orderReject.bind(this);
        this.updateAndNotify = this.updateAndNotify.bind(this);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let transferId = this.props.routeParams.transferId;
        this.props.dispatch(updateTransferOrderList(getTransferOrderList(warehouseId)));
        this.props.dispatch(updateCurrectTransferOrderDetails(getTransferOrderDetails(transferId)));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.routeParams.transferId != this.props.routeParams.transferId) {
            let transferId = nextProps.routeParams.transferId;
            this.props.dispatch(updateCurrectTransferOrderDetails(getTransferOrderDetails(transferId)));
        }
    }

    getOrderListPage(list) {
        let temp = list.map((elem, index) => {
            let link = `/order/transfer/${elem.order_id}`;
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
                                        {elem.quantity_transfered} units
                                    </div>
                                </div>
                                <div className="row margin-0">
                                    <div className="col-sm-12 truncate">
                                        {elem.order_datetime}
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
                    <td>
                        {elem.quantity_transfered}
                    </td>
                </tr>
            )
        });
        return temp;
    }

    searchOrders(e) {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateTransferOrderList(getTransferOrderList(warehouseId, e.target.value)));
    }

    updateAndNotify(orderId, message) {
        this.props.dispatch(updateCurrectTransferOrderDetails(getTransferOrderDetails(orderId)));
        setTimeout(()=> {
            this.props.dispatch(showNotificationusBar(message));
        },0);
    }

    orderReceived(e) {
        let transferId = this.props.routeParams.transferId;
        let wareohuseId = this.props.userDetails.warehouse_id;
        if(updateTransferOrderReceived(transferId, wareohuseId)) {
            this.updateAndNotify(transferId, "Order Approved");
        }
    }

    orderApprove(e) {
        let transferId = this.props.routeParams.transferId;
        let wareohuseId = this.props.userDetails.warehouse_id;

        if(updateTransferOrderApproved(transferId, wareohuseId)) {
            this.updateAndNotify(transferId, "Order Approved");
            let to_warehouse_id = this.props.transferOrderDetails.to_warehouse_id;
            let transferId = this.props.transferOrderDetails.order_id;
            saveNotification("Transfer Approved", to_warehouse_id, `/order/transfer/${transferId}`);
        }
    }

    orderReject(e) {
        let transferId = this.props.routeParams.transferId;
        let wareohuseId = this.props.userDetails.warehouse_id;

        let rejectReason = this.state.rejectReason;
        if(rejectReason == "" && rejectReason.length == 0) {
            this.props.dispatch(showNotificationusBar("Enter Reject Reason", "error"));
            return;
        }

        if(updateTransferOrderReject(transferId, wareohuseId, rejectReason)) {
            let to_warehouse_id = this.props.transferOrderDetails.to_warehouse_id;
            let transferId = this.props.transferOrderDetails.order_id;
            saveNotification("Transfer Order Rejected", to_warehouse_id, `/order/transfer/${transferId}`);
            this.updateAndNotify(transferId, "Order Rejected");
            this.closeRejectModal();
        }
    }

    closeRejectModal() {
        this.setState({showRejectReasonModal:false});
    }

    showRejectModal() {
        this.setState({showRejectReasonModal: true});
    }

    rejectReasonChanged(e) {
        this.setState({rejectReason: e.target.value});
    }
    render() {
        let opts = {};
        if(this.state.showRejectReasonModal) {
            opts['className'] = "custom-modal-small fadeIn";
        } else {
            opts['className'] = "display-none";
        }
        return (
            <div className="custom-container">
                <div {...opts}>
                        <div className="header">
                            <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeRejectModal}></i>
                            <h3>Reject Reason</h3>
                        </div>
                    <div className="info-container height-110px">
                        <div className="form-group">
                            <textarea onChange={this.rejectReasonChanged} className="form-control resize-off" value={this.state.rejectReason}>

                            </textarea>
                        </div>
                        <div className="col-sm-5 col-sm-offset-7">
                            <div className="form-group">
                                <button className="btn btn-danger form-control" onClick={this.orderReject}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="left-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-7">
                            <h4>Order List</h4>
                        </div>
                        <div className="col-sm-4 col-sm-offset-1">
                            <div className="form-group">
                                <Link to="/order/transfer/add"><button className="btn btn-success form-control"><i className="glyphicon glyphicon-plus"></i> New</button></Link>
                            </div>
                        </div>
                    </div>
                    <input className="form-control" placeholder="search for order dates DD/MM/YYYY" onChange={this.searchOrders} />
                    <div className="inner-list">
                        <table className="table margin-top-10">

                            <tbody>
                            {this.getOrderListPage(this.props.transferOrderList)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-6 padding-0">
                            <h3>Transfer Order #{padWithZeros(this.props.transferOrderDetails.order_id, 5)}&nbsp;<br/>
                                {
                                    this.props.transferOrderDetails.order_reject?
                                        <span className="label label-danger font-12">Rejected</span>
                                        :
                                    this.props.transferOrderDetails.order_received ?
                                        this.props.transferOrderDetails.to_warehouse_id == this.props.userDetails.warehouse_id ?
                                            <span className="label label-success font-12"><i className="glyphicon glyphicon-ok"></i> Received</span>
                                            :
                                            <span className="label label-success font-12"><i className="glyphicon glyphicon-ok"></i> Sent</span>
                                        :
                                        this.props.transferOrderDetails.order_approved?
                                            <span className="label label-primary font-12"><i className="glyphicon glyphicon-ok"></i> Approved</span>
                                            :
                                        <span className="label label-info font-12">Waiting for approval</span>
                                }
                            </h3>
                        </div>
                        <div className="col-sm-3">
                            {
                                this.props.transferOrderDetails.order_reject?
                                    ""
                                    :
                                this.props.transferOrderDetails.order_received ?
                                    ""
                                    :
                                    this.props.transferOrderDetails.order_approved?
                                        this.props.userDetails.warehouse_id == this.props.transferOrderDetails.to_warehouse_id ?
                                            <div className="form-group">
                                                <button className="form-control btn btn-primary margin-top-20 font-12" onClick={this.orderReceived}><i className="glyphicon glyphicon-ok"></i> Mark order as received</button>
                                            </div>
                                            :
                                            ""
                                        :
                                        this.props.transferOrderDetails.from_warehouse_id == this.props.userDetails.warehouse_id ?
                                            <div className="form-group">
                                                <button className="form-control btn btn-primary margin-top-20 font-12" onClick={this.orderApprove}><i className="glyphicon glyphicon-ok"></i> Approve</button>
                                            </div>
                                            :
                                            ""
                            }
                        </div>
                        <div className="col-sm-2">
                            {
                                this.props.transferOrderDetails.order_reject?
                                    ""
                                    :
                                this.props.transferOrderDetails.order_received ?
                                    ""
                                    :
                                    this.props.transferOrderDetails.order_approved?
                                            ""
                                            :
                                        this.props.transferOrderDetails.from_warehouse_id == this.props.userDetails.warehouse_id?
                                        <div className="form-group">
                                            <button className="form-control btn btn-danger margin-top-20 font-12" onClick={this.showRejectModal}><i className="glyphicon glyphicon-remove"></i> Reject</button>
                                        </div>
                                            :
                                            ""

                            }
                        </div>
                        <div className="col-sm-1">

                            <Link to="/order/transfer"><i className="glyphicon glyphicon-remove margin-top-20 font-24"></i></Link>
                        </div>
                    </div>
                    <div className="row margin-0">

                        <div className="col-sm-6">
                            <h4>Order Details:</h4>
                            <span className="span-class"><b>Order Id : </b> #{padWithZeros(this.props.transferOrderDetails.order_id, 5)}</span>
                            <span className="span-class"><b>Order Date : </b>{this.props.transferOrderDetails.order_datetime}</span>
                            <span className="span-class"><b>From warehouse : </b>{this.props.transferOrderDetails.from_warehouse_location}</span>
                            <span className="span-class"><b>To warehouse : </b>{this.props.transferOrderDetails.to_warehouse_location}</span>

                            {
                                this.props.transferOrderDetails.order_approved ?
                                    <span className="span-class"><b>Approve Date: </b>{this.props.transferOrderDetails.approve_date}</span>
                                    :
                                    ""
                            }
                            {
                                this.props.transferOrderDetails.order_received ?
                                    <span className="span-class"><b>Receive Date: </b>{this.props.transferOrderDetails.receive_date}</span>
                                    :
                                    ""
                            }
                            {
                                this.props.transferOrderDetails.order_reject ?
                                    <div>
                                        <span className="span-class"><b>Reject Date: </b>{this.props.transferOrderDetails.reject_date}</span>
                                        <span className="span-class"><b>Reject Reason: </b>{this.props.transferOrderDetails.reject_reason}</span>
                                    </div>
                                    :
                                    ""
                            }
                        </div>
                        <div className="col-sm-6">
                            {/*<span className="span-class"><h4>Sender/Receiver Details:</h4></span>*/}
                            {/*<span className="span-class"><b>SupplierName : </b>{this.props.purchaseOrderDetails.name}</span>*/}
                            {/*<span className="span-class"><b>Email : </b>{this.props.purchaseOrderDetails.email_id}</span>*/}
                            {/*<span className="span-class"><b>Phone No. : </b>{this.props.purchaseOrderDetails.ph_no}</span>*/}
                        </div>
                    </div>
                    <table className="table margin-top-20 lightgray-background">
                        <thead>
                        <tr className="gray-background">
                            <th>Product Id</th>
                            <th>Product Name</th>
                            <th>Quantity Transfered</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getOrderProductList(this.props.transferOrderDetails.productList)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}


export default connect(mapStateTopProps)(SalesOrderDetails);