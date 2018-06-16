import React from 'react';
import {connect} from 'react-redux';

import {getPurchaseRequestDetails, approvePurchaseRequest, rejectPurchaseRequest, getPurchaseRequestList, getDataForClone} from '../actions/apiActions';
import {updateCurrentPurchaseRequestDetails, showNotificationusBar, updatePurchaseRequestList, saveProductListForClone} from '../actions/actions';
import { hashRedirect } from '../utility/redirectFunctions';

import {padWithZeros} from '../utility/utility';
import Constants from '../constants/constants';

import {Link} from 'react-router';

const mapStateToProps = (store) => {
    return {
        purchaseRequestDetails: store.purchaseRequestDetails,
        userDetails: store.userDetails
    }
}

class PurchaseRequestDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.rejectReason = "";
        this.state.showRejectModal = false;
        this.rejectReasonChanged = this.rejectReasonChanged.bind(this);
        this.updateReject = this.updateReject.bind(this);
        this.updateApprove = this.updateApprove.bind(this);
        this.showRejectModal = this.showRejectModal.bind(this);
        this.hideRejectModal = this.hideRejectModal.bind(this);
        this.updateAndNotify = this.updateAndNotify.bind(this);
        this.cloneToPurchaseOrder = this.cloneToPurchaseOrder.bind(this);
    }

    rejectReasonChanged(e) {
        this.setState({rejectReason: e.target.value});
    }

    componentWillMount() {
        let requestId = this.props.routeParams.requestId;
        let warehouseid = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateCurrentPurchaseRequestDetails(getPurchaseRequestDetails(requestId, warehouseid)));
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        if(this.props.routeParams.requestId != nextProps.routeParams.requestId) {
            let requestId = nextProps.routeParams.requestId ;
            let warehouseid = this.props.userDetails.warehouse_id;
            this.props.dispatch(updateCurrentPurchaseRequestDetails(getPurchaseRequestDetails(requestId, warehouseid)));
        }
    }

    showRejectModal() {
        this.setState({showRejectModal: true});

    }
    hideRejectModal() {
        this.setState({showRejectModal: false});
    }

    updateAndNotify(requestId, message) {
        let warehouseid = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateCurrentPurchaseRequestDetails(getPurchaseRequestDetails(requestId, warehouseid)));

        setTimeout(()=> {
            this.props.dispatch(showNotificationusBar(message));
        },0);
        setTimeout(() => {
            let warehouseid = this.props.userDetails.warehouse_id;
            this.props.dispatch(updatePurchaseRequestList(getPurchaseRequestList(warehouseid)));
        },0);
    }

    updateApprove() {
        let requestId= this.props.routeParams.requestId;
        let warehouse_id = this.props.userDetails.warehouse_id;
        if(approvePurchaseRequest(requestId, warehouse_id)) {
            this.updateAndNotify(requestId, "Request Approved");
            this.hideRejectModal();
        } else {
            this.props.dispatch(showNotificationusBar("Something went wrong", "error"));
        }
    }

    updateReject() {
        if(this.state.rejectReason == "") {
            this.props.dispatch(showNotificationusBar("Enter Reject Reason", "error"));
            return;
        }
        let requestId= this.props.routeParams.requestId;
        let reason = this.state.rejectReason;
        let warehouse_id = this.props.userDetails.warehouse_id;
        if(rejectPurchaseRequest(requestId, reason, warehouse_id)) {

            this.updateAndNotify(requestId, "Request Rejected");
            this.hideRejectModal();
        } else {
            this.props.dispatch(showNotificationusBar("Something went wrong", "error"));
        }
    }

    getOrdersList(list) {

        if(list.length == 0 ){
            let  temp = [(<tr key={0}><td>No Records</td></tr>)];
            return temp;
        }

        let temp = list.map((elem, index) => {
            return (
                <tr key={index}>
                    <td><Link to={`/inventory/product/${elem.product_id}`}>#{padWithZeros(elem.product_id, 5)}</Link></td>
                    <td>{elem.product_name}</td>
                    <td>{elem.quantity}</td>
                    <td>{elem.quantity_available}</td>
                </tr>
            )
        });
        return temp;
    }

    componentDidMount() {

    }

    closeModal() {
        hashRedirect("/request/purchase");
    }

    cloneToPurchaseOrder() {

        this.props.dispatch(saveProductListForClone(getDataForClone(this.props.purchaseRequestDetails.productList, this.props.userDetails.warehouse_id)));

        hashRedirect("/order/purchase/add?clone=list");

    }

    render() {
        let opts = {};
        opts['className'] = this.state.showRejectModal? "custom-modal-small fadeIn" : "display-none";
        console.log(this.props);

        return (
            <div>
                <div {...opts}>
                    <div className="header">
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.hideRejectModal}></i>
                        <h3>Reject Reason</h3>
                    </div>
                    <div className="info-container height-110px">
                        <div className="form-group">
                            <textarea className="form-control resize-off" placeholder="reason" value={this.state.rejectReason} onChange={this.rejectReasonChanged}></textarea>
                        </div>
                        <div className="col-sm-5 col-sm-offset-7">
                            <div className="form-group">
                                <button className="btn btn-danger form-control" onClick={this.updateReject}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="custom-modal fadeIn">
                    <div className="header">
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeModal}></i>
                        <h3>Purchase Request  &nbsp;

                            {
                            this.props.purchaseRequestDetails.request_approved?
                                <span className="label label-success font-12">Seen</span>
                                :
                                this.props.purchaseRequestDetails.request_rejected?
                                    <span className="label label-danger font-12">Rejected</span>
                                    :
                                    <span className="label label-info font-12">Waiting</span>
                        }</h3>
                    </div>
                    <div className="info-container">
                      <div className="row margin-0">
                          <div className="col-sm-5">
                              <b>Request Id :</b> #{padWithZeros(this.props.purchaseRequestDetails.request_id)}
                          </div>
                          <div className="col-sm-5 col-sm-offset-1">
                              <b>Request date :</b> {this.props.purchaseRequestDetails.request_datetime}
                          </div>
                      </div>
                        <div className="row margin-0 margin-top-10">
                            <div className="col-sm-5 truncate">
                                <b>Request Reason:</b> {Constants.purchaseRequestReasons[this.props.purchaseRequestDetails.request_reason]}
                            </div>
                            {
                                this.props.purchaseRequestDetails.request_rejected?
                                    <div className="col-sm-5 col-sm-offset-1">
                                        <b>Reject Reason:</b> {this.props.purchaseRequestDetails.reject_reason}
                                    </div>
                                    :
                                    ""

                            }
                        </div>
                    </div>
                    <div className=" height-200 float-left overflow-auto width-100">
                        <h4>Product Details</h4>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Product Id</th>
                                <th>Product name</th>
                                <th>Quantity Required</th>
                                <th>Quantity Available</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.getOrdersList(this.props.purchaseRequestDetails.productList)}
                            </tbody>
                        </table>
                    </div>
                    {
                        this.props.userDetails.role_id == 2 ?
                            this.props.purchaseRequestDetails.request_approved == 1 || this.props.purchaseRequestDetails.request_rejected == 1?
                            ""
                            :
                            <div className="row margin-0">
                                <div className="col-sm-2 col-sm-offset-8">
                                    <div className="form-group">
                                        <button className="btn btn-success form-control" onClick={this.updateApprove}>Seen</button>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-group">
                                        <button className="btn btn-danger form-control" onClick={this.showRejectModal}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        :
                        ""
                    }
                    {
                        this.props.purchaseRequestDetails.request_approved == 1?
                            <div className="row margin-0">
                                <div className="col-sm-5 col-sm-offset-7">
                                    <div className="form-group">
                                        <button className="btn btn-primary form-control" onClick={this.cloneToPurchaseOrder}><i className="glyphicon glyphicon-copy"></i>Create Purchase Order</button>
                                    </div>
                                </div>
                            </div>
                            :
                            ""
                    }
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PurchaseRequestDetails);