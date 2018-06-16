import React from 'react';

import {connect} from 'react-redux';

import {getSalesOrderList, getSalesOrderDetails, createNewInvoice, salesOrderPackagingDone, salesOrderPaymentDone, salesOrderShippingDone, cancelSalesOrder, createNewReturnOrder, getDataForCloneSales} from '../actions/apiActions';
import {updateSalesOrderList, updateCurrentSalesOrderDetails, showNotificationusBar, saveProductListForClone} from '../actions/actions';

import {Link} from 'react-router';

import {padWithZeros} from '../utility/utility';
import  {hashRedirect} from  '../utility/redirectFunctions';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const mapStateTopProps = (store) => {
    return {
        userDetails: store.userDetails,
        salesOrderList: store.salesOrderList,
        salesOrderDetails: store.currentSalesOrderDetails
    }
}

class SalesOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.subTotal = 0;
        this.state.searchPattern = "";
        this.state.cancelReason = "";
        this.state.paymentMethod = 1;
        this.state.paymentAmount = 0;
        this.state.paymentTransactionId = "";
        this.state.paymentDate = moment();
        this.state.packageHandlingUserName = "";
        this.state.packageNumber = "";
        this.state.packageDate = moment();
        this.state.shippingMethod = "";
        this.state.shippingCompanyName = "";
        this.state.shippingTrackingId = "";
        this.state.shippingDate = moment();
        this.state.showCancelModal = false;
        this.state.showReturnModal = false;
        this.state.showPaymentDetailsModal = false;
        this.state.showPackageDetailsModal = false;
        this.state.showShippingDetailsModal = false;
        this.state.modalReturnProductList = [];
        this.state.returnReason = 1;
        this.state.returnDate = moment();
        this.state.returnComment = "";
        this.searchOrders = this.searchOrders.bind(this);
        this.getDoOptions = this.getDoOptions.bind(this);
        this.generateInvoice = this.generateInvoice.bind(this);
        this.changeSalesStatus = this.changeSalesStatus.bind(this);
        this.markPackagingDone = this.markPackagingDone.bind(this);
        this.markPaymentDone = this.markPaymentDone.bind(this);
        this.markShippingDone = this.markShippingDone.bind(this);
        this.updateAndNotify = this.updateAndNotify.bind(this);
        this.getInvoiceId = this.getInvoiceId.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.showCancelModalFunc = this.showCancelModalFunc.bind(this);
        this.closeCancelModalFunc = this.closeCancelModalFunc.bind(this);
        this.cancelReasonChanged = this.cancelReasonChanged.bind(this);

        this.showPaymentDetailsModal = this.showPaymentDetailsModal.bind(this);
        this.closePaymentDetailsModal = this.closePaymentDetailsModal.bind(this);

        this.showPackagingDetailsModal = this.showPackagingDetailsModal.bind(this);
        this.closePackagingDetailsModal = this.closePackagingDetailsModal.bind(this);

        this.showShippingDetailsModal = this.showShippingDetailsModal.bind(this);
        this.closeShippingDetailsModal = this.closeShippingDetailsModal.bind(this);

        this.paymentAmountChanged = this.paymentAmountChanged.bind(this);
        this.paymentMethodChanged = this.paymentMethodChanged.bind(this);
        this.paymentTransactionIdChanged = this.paymentTransactionIdChanged.bind(this);
        this.paymentDateChanged = this.paymentDateChanged.bind(this);
        this.packageNumberChanged = this.packageNumberChanged.bind(this);
        this.packageHandlingUserNameChanged = this.packageHandlingUserNameChanged.bind(this);
        this.packagingDateChanged = this.packagingDateChanged.bind(this);
        this.shippingCompanyNameChanged = this.shippingCompanyNameChanged.bind(this);
        this.shippingMethodChanged = this.shippingMethodChanged.bind(this);
        this.shippingTrackingIdChanged = this.shippingTrackingIdChanged.bind(this);
        this.shippingDateChanged = this.shippingDateChanged.bind(this);
        this.showReturnModal = this.showReturnModal.bind(this);
        this.quantityReturnedChanged = this.quantityReturnedChanged.bind(this);
        this.returnReasonChanged = this.returnReasonChanged.bind(this);
        this.returnDateChanged = this.returnDateChanged.bind(this);
        this.returnCommentChanged = this.returnCommentChanged.bind(this);
        this.createReturnOrder = this.createReturnOrder.bind(this);
        this.hideReturnModal = this.hideReturnModal.bind(this);
        this.cloneToPurchaseOrder = this.cloneToPurchaseOrder.bind(this);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let salesId = this.props.routeParams.salesId;
        this.props.dispatch(updateSalesOrderList(getSalesOrderList(warehouseId)));
        this.props.dispatch(updateCurrentSalesOrderDetails(getSalesOrderDetails(salesId)));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.routeParams.salesId != this.props.routeParams.salesId) {
            let salesId = nextProps.routeParams.salesId;
            this.props.dispatch(updateCurrentSalesOrderDetails(getSalesOrderDetails(salesId)));
        }
    }

    getOrderListPage(list) {
        let temp = list.map((elem, index) => {
            let link = `/order/sales/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td>
                        <Link to={link} activeClassName="sidebar-link-active truncate">
                            <div className="height-100">
                                <div className="row margin-0">
                                    <div className="col-sm-5 ">
                                        {elem.company_name}
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
                        <Link to={link}>#{padWithZeros(elem.product_id, 5)}</Link>
                    </td>
                    <td>
                        {elem.product_name} <br/>({elem.detail})
                    </td>
                    <td className="text-center">
                        {elem.quantity}
                    </td>
                    <td className="text-center">
                        {elem.per_unit_price}
                    </td>
                    <td className="text-center">
                        {elem.discount}
                    </td>
                    <td className="text-center+">
                        {elem.total_price}
                    </td>
                    <td>{elem.quantity_returned}</td>
                </tr>
            )
        });
        return temp;
    }

    getSubTotal(list) {
        let total = 0;
        list.forEach((elem)=> {
            total += elem.total_price;
        });
        return total;
    }
    searchOrders(e) {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateSalesOrderList(getSalesOrderList(warehouseId,0,0,e.target.value)));
    }

    generateInvoice() {
        let orderId = this.props.routeParams.salesId;
        let invoiceId = createNewInvoice(orderId);
        this.updateAndNotify(orderId, "Invoice Generated");
            // hashRedirect(`/invoice/${invoiceId}`);
    }

    cancelOrder() {
        let orderId = this.props.routeParams.salesId;
        let reason = this.state.cancelReason;
        if(reason == "" || reason.length == 0) {
            this.props.dispatch(showNotificationusBar("Enter cancel reason", "error"));
            return;
        }

        cancelSalesOrder(orderId, reason);
        this.updateAndNotify(orderId, "Order Canceled");
        this.closeCancelModalFunc();
    }

    markPaymentDone(e) {
        e.preventDefault();

        let data = {
            order_id:this.props.routeParams.salesId,
            amount_paid: this.props.salesOrderDetails.total_amount,
            transaction_id: this.state.paymentTransactionId,
            payment_date: this.state.paymentDate.format("DD/MM/YYY"),
            payment_method: this.state.paymentMethod
        };

        salesOrderPaymentDone(data);
        this.updateAndNotify(data.order_id, "Payment Status Updated");
        this.closePaymentDetailsModal();
        return false;
    }

    markPackagingDone(e) {
        e.preventDefault();

        let data = {
            order_id:this.props.routeParams.salesId,
            package_number: this.state.packageNumber,
            handling_user: this.state.packageHandlingUserName,
            package_date: this.state.packageDate.format("DD/MM/YYYY")
        }

        salesOrderPackagingDone(data);
        this.updateAndNotify(data.order_id, "Packaging Marked Done");
        this.closePackagingDetailsModal();
        return false;
    }

    markShippingDone(e) {
        e.preventDefault();
        let data = {
            order_id: this.props.routeParams.salesId,
            shipping_method: this.state.shippingMethod,
            shipping_company_name: this.state.shippingCompanyName,
            tracking_id: this.state.shippingTrackingId,
            shipping_date: this.state.shippingDate.format("DD/MM/YYYY")
        };

        salesOrderShippingDone(data);
        this.updateAndNotify(data.order_id, "Shipping Marked Done");
        this.closeShippingDetailsModal();
        return false;
    }
    updateAndNotify(orderId, message) {
        this.props.dispatch(updateCurrentSalesOrderDetails(getSalesOrderDetails(orderId)));
        setTimeout(()=> {
            this.props.dispatch(showNotificationusBar(message));
        },0);
    }

    changeSalesStatus(e) {
        let  elemKey= e.target.attributes["data-key"].value;

        switch (elemKey){
            case 'invoice_generated':
                this.generateInvoice();
                break;
            case 'payment_done':
                this.showPaymentDetailsModal();
                break;
            case 'packaging_done':
                this.showPackagingDetailsModal();
                break;
            case 'shipping_done':
                this.showShippingDetailsModal();
                break;
        }
    }

    getDoOptions() {

        let tempOptions = [{key:'invoice_generated', value: "Create Invoice"}, {key:'payment_done', value:"Mark payment received"}, {key:'packaging_done', value: "Order Packed"}, {key:'shipping_done', value:"Order Shipped"}];
        let done = false;
        let temp = tempOptions.map((elem, index) => {
            if(!this.props.salesOrderDetails[elem.key]) {
                    if(done) {
                        return (
                            <li className="disabled padding-5 cursor-disabled" key={index}>{elem.value}</li>
                        )
                    } else {
                        done = true;
                        return (
                            <li key={index} className="padding-5 cusor-pointer" onClick={this.changeSalesStatus} data-key={elem.key}>{elem.value}</li>
                        )
                    }
            } else {
                return (
                    <li className="disabled padding-5 cursor-disabled" key={index}>{elem.value}</li>
                )
            }
        });
        return temp;
    }

    getInvoiceId() {
        // return getInvoiceId(this.props.routeParams.salesId).invoice_id;
    }

    closeCancelModalFunc() {
        this.setState({showCancelModal:false});
    }

    showCancelModalFunc() {
        this.setState({showCancelModal: true});
    }

    showPaymentDetailsModal() {
        this.setState({showPaymentDetailsModal: true});
    }

    closePaymentDetailsModal() {
        this.setState({showPaymentDetailsModal: false});
    }

    showPackagingDetailsModal() {
        this.setState({showPackageDetailsModal: true});
    }

    closePackagingDetailsModal() {
        this.setState({showPackageDetailsModal: false});
    }

    showShippingDetailsModal() {
        this.setState({showShippingDetailsModal: true});
    }

    closeShippingDetailsModal() {
        this.setState({showShippingDetailsModal: false});
    }

    cancelReasonChanged(e) {
        this.setState({cancelReason: e.target.value});
    }

    paymentAmountChanged(e) {
        this.setState({paymentAmount: e.target.value});
    }
    paymentMethodChanged(e) {
        this.setState({paymentMethod: e.target.value});
    }

    paymentTransactionIdChanged(e) {
        this.setState({paymentTransactionId: e.target.value});
    }

    paymentDateChanged(date) {
        this.setState({paymentDate: date});
    }
    packageNumberChanged(e) {
        this.setState({packageNumber: e.target.value});
    }
    packageHandlingUserNameChanged(e) {
        this.setState({packageHandlingUserName: e.target.value});
    }

    packagingDateChanged(date) {
        this.setState({packageDate: date})
    }

    shippingCompanyNameChanged(e) {
        this.setState({shippingCompanyName: e.target.value});
    }

    shippingMethodChanged(e) {
        this.setState({shippingMethod: e.target.value});
    }

    shippingTrackingIdChanged(e) {
        this.setState({shippingTrackingId: e.target.value});
    }

    shippingDateChanged(date) {
        this.setState({shippingDate: date});
    }

    returnCommentChanged(e) {
        this.setState({returnComment:e.target.value});
    }

    returnDateChanged(date) {
        this.setState({returnDate: date});
    }

    returnReasonChanged(e) {
        this.setState({returnReason: e.target.value});
    }

    quantityReturnedChanged(e) {
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.modalReturnProductList.map((elem, index) => {
            if(elemIndex == index) {
                return {...elem, return_quantity:e.target.value};
            }
            return elem;
        });

        this.setState({modalReturnProductList: temp});
    }

    createReturnOrder(e) {
        e.preventDefault();

        let data = {
            sales_order_id: this.props.routeParams.salesId,
            order_datetime: this.state.returnDate.format("DD/MM/YYYY"),
            return_reason: this.state.returnReason,
            comment: this.state.returnComment,
            warehouse_id: this.props.userDetails.warehouse_id,
            productList: this.state.modalReturnProductList
        };

        // console.log(data);

        data.productList = data.productList.filter((elem) => {
                return elem.return_quantity == 0 || elem.return_quantity ==''? false:true;
        });

        if(data.productList.length == 0) {
            this.props.dispatch(showNotificationusBar("Please Enter return quantity", "error"));
            return false;
        }
        var total_amount = 0;
        var total_quantity = 0;
        data.productList.forEach((elem) => {
            total_amount = total_amount + ( parseInt(elem.per_unit_price) * parseInt(elem.return_quantity));
            total_quantity = total_quantity + parseInt(elem.return_quantity);
        });
        data.total_amount = total_amount;
        data.total_quantity = total_quantity;
        if(createNewReturnOrder(data)) {
            this.props.dispatch(updateCurrentSalesOrderDetails(getSalesOrderDetails(data.sales_order_id)));
            setTimeout(() => {
                this.props.dispatch(showNotificationusBar("Return Order Created"));
                // this.hidePurchaseDetailsModal();
                this.hideReturnModal();
            },0);
        } else {
            this.props.dispatch(showNotificationusBar("Something went wrong", "error"));
        }


        return false;
    }

    showReturnModal() {
        let productList = this.props.salesOrderDetails.productList.map((elem) => {
            return {...elem, return_quantity: 0};
        });
        this.setState({modalReturnProductList: productList, showReturnModal: true});
    }

    hideReturnModal() {
        this.setState({showReturnModal: false});
    }


    getModalProductList(list) {
        if(list.length == 0) {
            return (
                <div className="row margin-0">
                    <div className="col-sm-5">
                        No Records
                    </div>
                </div>
            )
        }

        let temp = list.map((elem,index) => {
            let new_quantity = elem.quantity_returned - elem.return_quantity || elem.quantity_returned;
            let maxAllowed = elem.quantity - elem.quantity_returned;
            let opts = {};
            maxAllowed == 0? opts['disabled'] = 'disabled':"";
            console.log(elem);

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
                            <label>Quantity Returned</label>
                            <input {...opts} data-index={index} className="form-control" type="number" required="required" min="0" max={maxAllowed} onChange={this.quantityReturnedChanged} value={elem.return_quantity}/>
                            {
                                (parseInt(elem.return_quantity) + parseInt(elem.quantity_returned)) > elem.quantity?
                                    <label className="error-font font-8">Cannot exceed ordered quantity</label>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>Total returned till date</label>
                            <div className="auto-complete-div"><span className="auto-complete-value">{elem.quantity_returned}</span></div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label>Quantity Ordered</label>
                            <div className="auto-complete-div"><span className="auto-complete-value">{elem.quantity}</span></div>
                        </div>
                    </div>
                </div>
            )
        });
        return temp;
    }

    getReturnOrderListPage(list) {
        if(list.length < 1) {
            let temp = [(<tr key = {0}><td>No Records</td></tr>)];
            return temp;
        }
        //
        // <th>Order Id</th>
        // <th>Date</th>
        // <th>Total Quantity</th>

        let temp = list.map((elem, index) => {
            return (
                <tr key={index}>
                    <td><Link to = {`/order/return/${elem.order_id}`}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td>{elem.product_quantity}</td>
                </tr>
            )
        });
        return temp;
    }

    cloneToPurchaseOrder() {

        this.props.dispatch(saveProductListForClone(getDataForCloneSales(this.props.salesOrderDetails.productList, this.props.userDetails.warehouse_id)));

        hashRedirect("/order/sales/add?clone=list");

    }
    componentDidMount() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });

    }


    render() {
        console.log(this.props);
        let opts = {};
        let packagingOpts = {};
        let paymentOpts = {};
        let shippingOpts = {};
        let returnOpts = {};
        opts['className'] = this.state.showCancelModal?"custom-modal-small fadeIn":"display-none";
        packagingOpts['className'] =  this.state.showPackageDetailsModal?"custom-modal-medium fadeIn":"display-none";
        paymentOpts['className'] = this.state.showPaymentDetailsModal?"custom-modal-medium fadeIn":"display-none";
        shippingOpts['className'] = this.state.showShippingDetailsModal?"custom-modal-medium fadeIn":"display-none";
        returnOpts['className'] = this.state.showReturnModal?"custom-modal-large fadeIn":"display-none";
        let requiredOpts = {};
        this.state.paymentMethod != 2?requiredOpts["required"] = "required": '';
         return (
            <div className="custom-container">
                <div {...opts} id="cancel_reason">
                    <div className="header">
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeCancelModalFunc}></i>
                        <h3>Cancel Reason</h3>
                    </div>
                    <div className="info-container height-110px">
                        <div className="form-group">
                            <textarea onChange={this.cancelReasonChanged} className="form-control resize-off" value={this.state.cancelReason}>
                            </textarea>
                        </div>
                        <div className="col-sm-5 col-sm-offset-7">
                            <div className="form-group">
                                <button className="btn btn-danger form-control" onClick={this.cancelOrder}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div {...paymentOpts} id="payment_details">
                    <div className="header">
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closePaymentDetailsModal}></i>
                        <h3>Enter Payment Details</h3>
                    </div>
                    <div className="info-container">
                        <form onSubmit={this.markPaymentDone}>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Amount</label>
                                    <input onChange={this.paymentAmountChanged} type="number" value={this.props.salesOrderDetails.total_amount} disabled="disabled" className="form-control" placeholder="Enter amount" required="required"/>
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select onChange={this.paymentMethodChanged} value={this.state.paymentMethod} className="form-control" required="required">
                                        <option value="1">Net Banking</option>
                                        <option value="2">Cash</option>
                                        <option value="3">Card</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Transcation Id (If applicable)</label>
                                    <input {...requiredOpts} onChange={this.paymentTransactionIdChanged} value={this.state.paymentTransactionId} type="text" className="form-control"/>
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Payment Date</label>
                                    <DatePicker selected={this.state.paymentDate} onChange={this.paymentDateChanged} />
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <input type="submit" className="form-control btn btn-primary margin-top-20"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div {...packagingOpts}>
                    <div className="header">
                        <h3>Package Details</h3>
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closePackagingDetailsModal}></i>
                    </div>
                    <div className="info-container">
                        <form onSubmit={this.markPackagingDone}>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Package Number</label>
                                    <input onChange={this.packageNumberChanged} className="form-control" value={this.state.packageNumber} type="text" required="required"/>
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Handling user name</label>
                                    <input onChange={this.packageHandlingUserNameChanged} className="form-control" value={this.state.packageHandlingUserName} type="text" required="required"/>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Packaging Date</label>
                                    <DatePicker selected = {this.state.packageDate} onChange={this.packagingDateChanged} />
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <input className="form-control btn-primary btn margin-top-20" type="submit"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div {...shippingOpts}>
                    <div className="header">
                        <h3>Shipping Details</h3>
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeShippingDetailsModal}></i>
                    </div>
                    <div className="info-container">
                        <form onSubmit={this.markShippingDone}>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Shipping Company</label>
                                    <input onChange={this.shippingCompanyNameChanged} className="form-control" value={this.state.shippingCompanyName} type="text" required="required"/>
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Shipping Method</label>
                                    <input onChange={this.shippingMethodChanged} className="form-control" value={this.state.shippingMethod} type="text" required="required"/>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Tracking Id</label>
                                    <input onChange={this.shippingTrackingIdChanged} className="form-control" value={this.state.shippingTrackingId} type="text" required="required"/>
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Shipping Date</label>
                                    <DatePicker selected = {this.state.shippingDate} onChange={this.shippingDateChanged} />
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <input className="form-control btn-primary btn margin-top-20" type="submit"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div {...returnOpts}>
                    <div className="header">
                        <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.hideReturnModal}></i>
                        <h3>Create Return Order</h3>
                    </div>
                    <form onSubmit={this.createReturnOrder} className="height-85p float-left width-100">
                        <div className="info-container">
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label>Date</label><br/>
                                    <DatePicker selected={this.state.returnDate} onChange={this.returnDateChanged} />
                                </div>
                            </div>
                            <div className="col-sm-5 col-sm-offset-1">
                                <div className="form-group">
                                    <label>Reason for return</label>
                                    <select className="form-control" value={this.state.returnReason} onChange={this.returnReasonChanged} required="required">
                                        <option value="1">Damaged/Defective/Broken</option>
                                        <option value="2">Not Required/ Expired</option>
                                        <option value="3">Delivery Missed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="float-left width-100 height-65p overflow-auto">
                            {this.getModalProductList(this.state.modalReturnProductList)}
                        </div>
                        <div className="col-sm-10">
                            <div className="form-group">
                                <textarea className="form-control resize-off" placeholder="Enter comments if any.." value={this.state.returnComment} onChange={this.returnCommentChanged}>

                                </textarea>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <input type="submit" className="form-control btn btn-primary margin-top-20"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="left-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-7">
                            <h4>Order List</h4>
                        </div>
                        <div className="col-sm-4 col-sm-offset-1">
                            <div className="form-group">
                                <Link to="/order/sales/add"><button className="btn btn-success form-control"><i className="glyphicon glyphicon-plus"></i> New</button></Link>
                            </div>
                        </div>
                    </div>
                    <input  className="form-control" placeholder="search order id without 0, date, company name" onChange={this.searchOrders}/>
                    <div className="inner-list">
                        <table className="table margin-top-10">
                            <tbody>
                            {this.getOrderListPage(this.props.salesOrderList)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-4 padding-0">
                            <h3>Sales Order #{padWithZeros(this.props.salesOrderDetails.order_id, 5)}&nbsp;
                                {
                                    this.props.salesOrderDetails.order_cancel?
                                        <span className="label label-danger font-12"><i className="glyphicon glyphicon-remove"></i> Order Canceled</span>
                                        :
                                    this.props.salesOrderDetails.shipping_done?
                                        <span className="label label-success font-12"><i className="glyphicon glyphicon-ok"></i> Order Completed</span>
                                        :this.props.salesOrderDetails.packaging_done?
                                            <span className="label label-info font-12"><i className="glyphicon glyphicon-ok"></i> Packaging Done</span>
                                            :this.props.salesOrderDetails.payment_done?
                                                <span className="label label-info font-12"><i className="glyphicon glyphicon-ok"></i> Payment Done</span>
                                                :this.props.salesOrderDetails.invoice_generated?
                                                    <span className="label label-info font-12"><i className="glyphicon glyphicon-ok"></i> Invoice Generated</span>
                                                    :<span className="label label-info font-12"><i className="glyphicon glyphicon-ok"></i> Approved</span>
                                }
                                &nbsp;
                                {
                                    this.props.salesOrderDetails.returned?
                                        <span className="label label-primary font-12"><i className="glyphicon glyphicon-import"></i> Order Returned</span>
                                        :
                                        ""
                                }

                            </h3>
                        </div>
                        <div className="col-sm-2">
                            {
                                this.props.salesOrderDetails.order_cancel ?
                                    ""
                                    :
                                    <div className="dropdown margin-top-20">
                                        <button className="btn btn-primary dropdown-toggle form-control" type="button"
                                                id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="true">
                                            Action&nbsp;
                                            <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                            {this.getDoOptions()}
                                            <li role="separator" className="divider"></li>
                                            {
                                                this.props.salesOrderDetails.shipping_done?
                                                    <li className="padding-5 cusor-pointer disabled cursor-disabled">Cancel</li>
                                                    :
                                                    <li className="padding-5 cusor-pointer" onClick={this.showCancelModalFunc}>Cancel</li>

                                            }
                                            {
                                                this.props.salesOrderDetails.shipping_done?
                                                    <li className="padding-5 cusor-pointer" onClick={this.showReturnModal}>Create Return Order</li>
                                                    :
                                                    <li className="padding-5 cusor-pointer disabled cursor-disabled" >Create Return Order</li>

                                            }

                                        </ul>
                                    </div>
                            }
                        </div>
                        <div className="col-sm-2 col-sm-offset-1">
                            <div className="form-group">
                                <button className="form-control btn btn-primary margin-top-20" onClick={this.cloneToPurchaseOrder}><i className="glyphicon glyphicon-copy"></i> Clone</button>
                            </div>
                        </div>
                        <div className="col-sm-1 col-sm-offset-2">
                            <Link to="/order/sales"><i className="glyphicon glyphicon-remove margin-top-20 font-24"></i></Link>
                        </div>
                    </div>
                    <div className="row margin-0">
                        <div className="col-sm-4">
                            <h4>Order Details:</h4>
                            <span className="span-class"><b>Order Id : </b> #{padWithZeros(this.props.salesOrderDetails.order_id, 5)}</span>
                            <span className="span-class"><b>Order Date : </b>{this.props.salesOrderDetails.order_datetime}</span>
                            <span className="span-class"><b>Warehouse : </b>{this.props.userDetails.warehouse_location}</span>
                            {

                                this.props.salesOrderDetails.invoice_generated ?
                                    <span className="span-class"><b>Invoice Id: </b><Link to={`/invoice/${this.props.salesOrderDetails.invoice_id}`}>#{padWithZeros(this.props.salesOrderDetails.invoice_id, 5)}</Link></span>:""
                            }

                            {
                                this.props.salesOrderDetails.order_cancel?
                                    <div>
                                        <span className="span-class"><b>Cancel Date: </b>{this.props.salesOrderDetails.cancel_date}</span>
                                        <span className="span-class"><b>Cancel Reason: </b>{this.props.salesOrderDetails.cancel_reason}</span>
                                    </div>
                                    :
                                    ""
                            }
                        </div>

                        <div className="col-sm-4 col-sm-offset-2">
                            <span className="span-class"><h4>Customer Details:</h4></span>
                            <span className="span-class"><b>Company Name : </b>{this.props.salesOrderDetails.company_name}</span>
                            <span className="span-class"><b>Customer Name : </b>{this.props.salesOrderDetails.name}</span>
                            <span className="span-class"><b>Email : </b>{this.props.salesOrderDetails.email_id}</span>
                            <span className="span-class"><b>Phone No. : </b>{this.props.salesOrderDetails.ph_no}</span>
                            <span className="span-class"><b>Billing/Shipping Address :</b></span>
                            <span className="span-class">{this.props.salesOrderDetails.company_name}</span>
                            <span className="span-class">{this.props.salesOrderDetails.name}</span>
                            <span className="span-class">{this.props.salesOrderDetails.shipping_address}</span>
                        </div>
                    </div>

                                <h4>Packaging Details</h4>
                                <table className="table">
                                    <thead className="gray-background">
                                    <tr>
                                        <th>Package No.</th>
                                        <th>Date</th>
                                        <th>Handling User</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.props.salesOrderDetails.packaging_done?
                                            <tr>
                                                <td>{this.props.salesOrderDetails.packageDetails.package_number}</td>
                                                <td>{this.props.salesOrderDetails.packageDetails.package_date}</td>
                                                <td>{this.props.salesOrderDetails.packageDetails.handling_user}</td>
                                            </tr>
                                            :
                                            <tr>
                                                <td>No Records</td>
                                            </tr>
                                    }
                                    </tbody>
                                </table>
                                <h4>Shipping Details</h4>
                                <table className="table">
                                    <thead className="gray-background">
                                    <tr>
                                        <th>Shipping Company</th>
                                        <th>Date</th>
                                        <th>Method</th>
                                        <th>Tracking Id</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.props.salesOrderDetails.shipping_done?
                                    <tr>
                                        <td>{this.props.salesOrderDetails.shippingDetails.shipping_company_name}</td>
                                        <td>{this.props.salesOrderDetails.shippingDetails.shipping_date}</td>
                                        <td>{this.props.salesOrderDetails.shippingDetails.shipping_method}</td>
                                        <td>{this.props.salesOrderDetails.shippingDetails.tracking_id}</td>
                                    </tr>
                                            :
                                            <tr><td>No Records</td></tr>
                                    }
                                    </tbody>
                                </table>
                    <table className="table margin-top-20 lightgray-background">
                        <thead>
                            <tr className="gray-background">
                                <th>Product Id</th>
                                <th>Product Name</th>
                                <th>Quantity Ordered</th>
                                <th>Selling Price (Rs.)</th>
                                <th>Discount (%)</th>
                                <th>Total Price (Rs.)</th>
                                <th>Returned</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.getOrderProductList(this.props.salesOrderDetails.productList)}
                        </tbody>
                    </table>
                    <div className="row margin-0">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Sub Total</span>
                        </div>
                        <div className="col-sm-2 big-font">Rs. {this.getSubTotal(this.props.salesOrderDetails.productList)}</div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Tax</span>
                        </div>
                        <div className="col-sm-2 big-font">{this.props.salesOrderDetails.tax} %</div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Total</span>
                        </div>
                        <div className="col-sm-2 big-font"> Rs. {this.props.salesOrderDetails.total_amount}</div>
                    </div>
                    <h4 className="margin-top-10">Return Orders</h4>
                    <table className="table margin-top-10">
                        <thead className="gray-background">
                            <tr>
                                <th>Order Id</th>
                                <th>Date</th>
                                <th>Total Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getReturnOrderListPage(this.props.salesOrderDetails.returnOrderDetails)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateTopProps)(SalesOrderDetails);