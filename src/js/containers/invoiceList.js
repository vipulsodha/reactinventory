/**
 * Created by Dell-1 on 08-12-2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {updateInoviceList} from '../actions/actions';
import {getInvoiceList} from '../actions/apiActions';

import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        invoiceList: store.invoiceList
    }
}

class InvoiceList extends React.Component {
    constructor(props) {
        super(props);
        this.getCustomerList = this.getCustomerList.bind(this);
    }

    getCustomerList(list) {

        if(list.length < 1) {
            let temp = [(<tr key = {0}><td>No Records</td></tr>)];
            return temp;
        }

        let temp = list.map((elem, index) => {
            // let link = `/customers/${elem.customer_id}`;
            return (
                <tr key={index}>
                    <td><Link to={`/invoice/${elem.invoice_id}`}>#{padWithZeros(elem.invoice_id, 5)}</Link></td>
                    <td><Link to={`/order/sales/${elem.order_id}`}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.invoice_date}</td>
                    <td>
                        {
                            elem.payment_done?
                                <i className="glyphicon glyphicon-ok success-font"></i>
                                :
                                <i className="glyphicon glyphicon-remove error-font"></i>
                        }
                    </td>
                    <td>{elem.total_amount}</td>
                </tr>
            )
        });
        return temp;
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let show = "";

        if(this.props.location.query.show) {
            show = this.props.location.query.show;
        }
        this.props.dispatch(updateInoviceList(getInvoiceList(warehouseId, show)));
    }

    componentWillReceiveProps(nextProps) {
        let warehouseId = this.props.userDetails.warehouse_id;
        let show = "";
        if(nextProps.location.query.show || this.props.location.query.show) {
            if(nextProps.location.query.show != this.props.location.query.show) {
                let show = "";
                if(nextProps.location.query.show) {
                    show = nextProps.location.query.show;
                }
                this.props.dispatch(updateInoviceList(getInvoiceList(warehouseId, show)));
            }
        }
    }

    render() {
        return (
            <div className="custom-container padding-5">
                {this.props.children}
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Invoice List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-6">
                        <div className="dropdown margin-top-20">
                            <button className="btn btn-primary form-control dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Payment Filter&nbsp;
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <Link  to="/invoice?show=paid"><li className="padding-5 cusor-pointer">Payment Done</li></Link>
                                <Link to="/invoice?show=pending"><li className="padding-5 cusor-pointer">Payment Pending</li></Link>
                                <Link to="/invoice"><li className="padding-5 cusor-pointer">All</li></Link>
                            </ul>
                        </div>
                    </div>
                </div>
                <table className="table padding-5 margin-top-20">
                    <thead>
                    <tr>
                        <th>Invoice Id</th>
                        <th>Sales Order Id</th>
                        <th>Invoice Date</th>
                        <th>Payment Received</th>
                        <th>Total Payment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getCustomerList(this.props.invoiceList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(InvoiceList);