import React from 'react';

import {connect} from 'react-redux';

import {getInvoiceList, getInvoiceDetails, salesOrderPaymentDone} from '../actions/apiActions';
import {updateInoviceList, updateCurrentInovoiceDetails, showNotificationusBar} from '../actions/actions';

import {Link} from 'react-router';

import {padWithZeros} from '../utility/utility';
import DatePicker from 'react-datepicker';
import moment from 'moment';


import Constants from '../constants/constants';
const mapStateTopProps = (store) => {
    return {
        userDetails: store.userDetails,
        invoiceList: store.invoiceList,
        invoiceDetails: store.currentInvoiceDetails
    }
}

class InvoiceDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.subTotal = 0;
        this.state.searchPattern = "";
        this.state.paymentMethod = 1;
        this.state.paymentAmount = 0;
        this.state.paymentTransactionId = "";
        this.state.paymentDate = moment();
        this.searchOrders = this.searchOrders.bind(this);
        this.updateAndNotify = this.updateAndNotify.bind(this);
        this.markPaymentDone = this.markPaymentDone.bind(this);
        this.showPaymentDetailsModal = this.showPaymentDetailsModal.bind(this);
        this.closePaymentDetailsModal = this.closePaymentDetailsModal.bind(this);
        this.paymentAmountChanged = this.paymentAmountChanged.bind(this);
        this.paymentMethodChanged = this.paymentMethodChanged.bind(this);
        this.paymentTransactionIdChanged = this.paymentTransactionIdChanged.bind(this);
        this.paymentDateChanged = this.paymentDateChanged.bind(this);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let invoiceId = this.props.routeParams.invoiceId;
        this.props.dispatch(updateInoviceList(getInvoiceList(warehouseId)));
        this.props.dispatch(updateCurrentInovoiceDetails(getInvoiceDetails(invoiceId)));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.routeParams.invoiceId != this.props.routeParams.invoiceId) {
            let invoiceId = nextProps.routeParams.invoiceId;
            this.props.dispatch(updateCurrentInovoiceDetails(getInvoiceDetails(invoiceId)));
        }
    }

    getOrderListPage(list) {
        let temp = list.map((elem, index) => {
            let link = `/invoice/${elem.invoice_id}`;
            return (
                <tr key={index}>
                    <td>
                        <Link to={link} activeClassName="sidebar-link-active truncate">
                            <div className="height-100">
                                <div className="row margin-0">
                                    <div className="col-sm-12 truncate">
                                        Invoice Id : #{padWithZeros(elem.invoice_id, 5)} | {elem.invoice_date}
                                    </div>
                                </div>
                                <div className="row margin-0">
                                    <div className="col-sm-12 truncate">
                                        Sales Order: #{padWithZeros(elem.order_id, 5)}
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
        // let warehouseId = this.props.userDetails.warehouse_id;
        // this.props.dispatch(updateSalesOrderList(getSalesOrderList(warehouseId,0,0,e.target.value)));
    }

    updateAndNotify(invoiceId, message) {
        this.props.dispatch(updateCurrentInovoiceDetails(getInvoiceDetails(invoiceId)));
        setTimeout(()=> {
            this.props.dispatch(showNotificationusBar(message));
        },0);
    }

    // markPaymentReceived() {
    //     let order_id = this.props.invoiceDetails.order_id;
    //     salesOrderPaymentDone(order_id);
    //     let invoiceId = this.props.invoiceDetails.invoice_id;
    //     this.updateAndNotify(invoiceId, "Payment Updated");
    // }

    printPage(divId = "right-div-order") {
        let customCss = '<link rel="stylesheet" href="./css/custom.css" type="text/css">';
        let bootstrap = '<link href="./css/bootstrap.css" rel="stylesheet" />';
        window.frames[0].document.body.innerHTML = customCss + bootstrap + document.getElementById("right-div-order").innerHTML;
            window.frames["0"].focus();
        window.frames["0"].print();

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

    showPaymentDetailsModal() {
        this.setState({showPaymentDetailsModal: true});
    }

    closePaymentDetailsModal() {
        this.setState({showPaymentDetailsModal: false});
    }

    markPaymentDone(e) {
        console.log("Marking Payment Done");
        e.preventDefault();

        let data = {
            order_id:this.props.invoiceDetails.order_id,
            amount_paid: this.props.invoiceDetails.total_amount,
            transaction_id: this.state.paymentTransactionId,
            payment_date: this.state.paymentDate.format("DD/MM/YYY"),
            payment_method: this.state.paymentMethod
        };

        salesOrderPaymentDone(data);
        this.updateAndNotify(this.props.routeParams.invoiceId, "Payment Status Updated");
        this.closePaymentDetailsModal();
        return false;
    }

    render() {
        let paymentOpts = {};
        this.state.showPaymentDetailsModal?paymentOpts['className'] = "custom-modal-medium fadeIn": paymentOpts['className'] = "display-none";
        return (
            <div className="custom-container">
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
                                    <input disabled="disabled" onChange={this.paymentAmountChanged} type="number" value={this.props.invoiceDetails.total_amount} className="form-control" placeholder="Enter amount" required="required"/>
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
                                    <input onChange={this.paymentTransactionIdChanged} value={this.state.paymentTransactionId} type="text" className="form-control"/>
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
                <div className="left-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-7">
                            <h4>Invoice List</h4>
                        </div>
                    </div>
                    <div className="inner-list">
                        <table className="table margin-top-10">

                            <tbody>
                            {this.getOrderListPage(this.props.invoiceList)}

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-div-order" id="right-div-order">
                    <div className="row margin-0">
                        <div className="col-sm-4 padding-0">
                            <h3>Invoice Id #{padWithZeros(this.props.invoiceDetails.invoice_id, 5)}&nbsp;<br/>

                                {
                                    this.props.invoiceDetails.order_cancel?
                                        <span className="label label-danger font-12">Canceled</span>
                                        :
                                    this.props.invoiceDetails.payment_done?
                                        <span className="label label-success font-12">Payment Done</span>
                                        :
                                        <span className="label label-danger font-12">Payment Pending</span>
                                }
                            </h3>
                        </div>
                        <div className="col-sm-3" id = "payment_button">
                            {
                                this.props.invoiceDetails.order_cancel?
                                    ""
                                    :
                                this.props.invoiceDetails.payment_done?
                                    ""
                                    :
                                    <div className="form-group margin-top-20">
                                        <button className="btn-primary btn form-control font-12" onClick={this.showPaymentDetailsModal}><i className="glyphicon glyphicon-ok"></i> Payment Received</button>
                                    </div>
                            }
                        </div>
                        <div className="col-sm-2" id="print_button">
                            <div className="form-group margin-top-20">
                                <button className="btn-primary btn form-control font-12" onClick={this.printPage}><i className="glyphicon glyphicon-print"></i></button>
                            </div>
                        </div>
                        <div className="col-sm-1 col-sm-offset-2" id="close_button">
                            <Link to="/invoice"><i className="glyphicon glyphicon-remove margin-top-20 font-24"></i></Link>
                        </div>
                    </div>
                    <div className="row margin-0">
                        <div className="col-sm-6">
                            <h4>Invoice Details:</h4>
                            <span className="span-class"><b>Invoice id : </b> #{padWithZeros(this.props.invoiceDetails.invoice_id, 5)}</span>
                            <span className="span-class"><b>Invoice date: </b> {this.props.invoiceDetails.invoice_date}</span>
                            <span className="span-class"><b>Sales order id : </b> <Link to={`/order/sales/${this.props.invoiceDetails.order_id}`}>#{padWithZeros(this.props.invoiceDetails.order_id, 5)}</Link></span>
                            <span className="span-class"><b>Order date : </b>{this.props.invoiceDetails.order_datetime}</span>
                            {
                                this.props.invoiceDetails.payment_done?
                                    <div>
                                        <span className="span-class"><b>Payment date : </b>{this.props.invoiceDetails.paymentDetails.payment_date}</span>
                                        <span className="span-class"><b>Amount Paid : </b>{this.props.invoiceDetails.paymentDetails.amount_paid}</span>
                                        <span className="span-class"><b>Payment Method : </b>{Constants.paymentTypeConstant[this.props.invoiceDetails.paymentDetails.payment_method]}</span>
                                        {
                                            this.props.invoiceDetails.paymentDetails.transaction_id?
                                                <span className="span-class"><b>Transaction Id : </b>{this.props.invoiceDetails.paymentDetails.transaction_id}</span>
                                                :
                                                ""
                                        }
                                    </div>

                                    :
                                    ""
                            }
                            {
                                this.props.invoiceDetails.order_cancel?
                                    <span className="span-class"><b>Cancel date : </b>{this.props.invoiceDetails.cancel_date}</span>
                                    :
                                    ""
                            }
                            <span className="span-class"><b>Warehouse Name : </b>{this.props.userDetails.warehouse_name}</span>
                            <span className="span-class"><b>Warehouse Location : </b>{this.props.userDetails.warehouse_location}</span>

                        </div>

                        <div className="col-sm-6">
                            <span className="span-class"><h4>Customer Details:</h4></span>
                            <span className="span-class"><b>Company Name : </b>{this.props.invoiceDetails.company_name}</span>
                            <span className="span-class"><b>Customer Name : </b>{this.props.invoiceDetails.name}</span>
                            <span className="span-class"><b>Email : </b>{this.props.invoiceDetails.email_id}</span>
                            <span className="span-class"><b>Phone No. : </b>{this.props.invoiceDetails.ph_no}</span>
                            <span className="span-class"><b>Billing/Shipping Address :</b></span>
                            <span className="span-class">{this.props.invoiceDetails.company_name}</span>
                            <span className="span-class">{this.props.invoiceDetails.name}</span>
                            <span className="span-class">{this.props.invoiceDetails.shipping_address}</span>
                        </div>
                    </div>

                    <table className="table margin-top-20 lightgray-background">
                        <thead>
                        <tr className="gray-background">
                            <th>Product Id</th>
                            <th>Product Name</th>
                            <th>Quantity Ordered</th>
                            <th>Selling Price (Rs.)</th>
                            <th>Discount (%)</th>
                            <th>Total Price (Rs.)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getOrderProductList(this.props.invoiceDetails.productList)}
                        </tbody>
                    </table>
                    <div className="row margin-0">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Sub Total</span>
                        </div>
                        <div className="col-sm-2 big-font">Rs. {this.getSubTotal(this.props.invoiceDetails.productList)}</div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Tax</span>
                        </div>
                        <div className="col-sm-2 big-font">{this.props.invoiceDetails.tax} %</div>
                    </div>
                    <div className="row margin-0 margin-top-10">
                        <div className="col-sm-4 col-sm-offset-6">
                            <span className="big-font">Total</span>
                        </div>
                        <div className="col-sm-2 big-font"> Rs. {this.props.invoiceDetails.total_amount}</div>
                    </div>
                </div>

                <iframe width="0" height="0" id ="print_frame"></iframe>
            </div>
        )
    }
}

export default connect(mapStateTopProps)(InvoiceDetails);