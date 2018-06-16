import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {getSalesOrderList} from '../actions/apiActions';
import {updateSalesOrderList} from '../actions/actions';

import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        salesOrderList: store.salesOrderList
    }
}

class SalesOrderList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let show = "";

        if(this.props.location.query.show) {
            show = this.props.location.query.show;
        }
        this.props.dispatch(updateSalesOrderList(getSalesOrderList(warehouseId, 0,0,"",show)));
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
                this.props.dispatch(updateSalesOrderList(getSalesOrderList(warehouseId, 0, 0, "", show)));
            }
        }

    }

    checkStatus(data) {
        if(data == 1) {
            return (
                <i className="glyphicon glyphicon-ok success-font"></i>
            )
        }
        return (
            <i className="glyphicon glyphicon-remove error-font"></i>
        )
    }

    getOrderListPage(list) {
        if(list.length < 1) {
            let temp = [(<tr key = {0}><td>No Records</td></tr>)];
            return temp;
        }
        let temp = list.map((elem, index) => {
            let customerLink = `/customers/${elem.customer_id}`;
            let orderLink = `/order/sales/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td><Link to={orderLink}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td><Link to={customerLink}>{elem.company_name}</Link></td>
                    <td className="text-center">
                        {this.checkStatus(elem.order_approved)}
                    </td>
                    <td className="text-center">
                        {this.checkStatus(elem.invoice_generated)}
                    </td>
                    <td className="text-center">
                        {this.checkStatus(elem.payment_done)}
                    </td>
                    <td className="text-center">
                        {this.checkStatus(elem.packaging_done)}
                    </td>
                    <td className="text-center">
                        {this.checkStatus(elem.shipping_done)}
                    </td>

                    <td className="text-center">{elem.quantity_ordered}</td>
                    <td className="text-center">
                        {
                            elem.order_cancel?
                                <span className="label label-danger font-12">Canceled</span>
                                :
                                elem.shipping_done?
                                    <span className="label label-success font-12">Completed</span>
                                    :
                                    <span className="label label-info font-12">Processing</span>
                        }
                    </td>
                </tr>
            )
        });
        return temp;
    }

    render() {

        return (
            <div className="custom-container">
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Sales Order List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-3">

                        <div className="dropdown margin-top-20">
                            <button className="btn btn-primary form-control dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Order Filter&nbsp;
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <Link  to="/order/sales?show=completed"><li className="padding-5 cusor-pointer">Order Completed</li></Link>
                                <Link to="/order/sales?show=pending"><li className="padding-5 cusor-pointer">Order Pending</li></Link>
                                <Link to="/order/sales?show=canceled"><li className="padding-5 cusor-pointer">Order Canceled</li></Link>
                                <Link to="/order/sales"><li className="padding-5 cusor-pointer">All</li></Link>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-3 margin-top-20">
                        <div className="form-group">
                         <Link to="/order/sales/add"><button className="form-control btn btn-success"><i className="glyphicon glyphicon-plus"></i> New Sale Order</button></Link>
                        </div>
                    </div>
                </div>
                <table className="table margin-top-20">
                    <thead>
                        <tr>
                            <th>Order Id</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th className="text-center">Approved</th>
                            <th className="text-center">Invoiced</th>
                            <th className="text-center">Payment Done</th>
                            <th className="text-center">Packaging</th>
                            <th className="text-center">Shipping</th>
                            <th>Total Quantity</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.getOrderListPage(this.props.salesOrderList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SalesOrderList);