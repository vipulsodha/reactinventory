import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {getPurchaseOrderList} from '../actions/apiActions';
import {updatePurchaseOrderList} from '../actions/actions';

import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        purchaseOrderList: store.purchaseOrderList
    }
}

class PurchaseOrderList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        let show = "";

        if(this.props.location.query.show) {
            show = this.props.location.query.show;
        }
        this.props.dispatch(updatePurchaseOrderList(getPurchaseOrderList(warehouseId, 0, 0, "", show)));
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
                this.props.dispatch(updatePurchaseOrderList(getPurchaseOrderList(warehouseId, 0, 0, "", show)));
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
            let temp = [(<tr key="0"><td>No Records</td></tr>)];
            return temp;
        }
        let temp = list.map((elem, index) => {
            let orderLink = `/order/purchase/${elem.order_id}`;
            return (
                <tr key={index}>
                    <td><Link to={orderLink}>#{padWithZeros(elem.order_id, 5)}</Link></td>
                    <td>{elem.order_datetime}</td>
                    <td>{elem.name}</td>
                    <td className="text-center">
                        <i className="glyphicon glyphicon-ok success-font"></i>
                    </td>
                    <td className="text-center">
                        {this.checkStatus(elem.order_received)}
                    </td>
                    <td>{elem.quantity_ordered}</td>
                    <td>{
                        elem.order_received?
                            <span className="label label-success font-12">Received</span>
                                :
                                elem.partially_received?
                                  <span className="label label-info font-12">Receiving</span>
                                        :
                                        <span className="label label-danger font-12">Not Received</span>
                    }</td>
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
                        <h3>Purchase Order List</h3>
                    </div>

                    <div className="col-sm-2 col-sm-offset-3">

                        <div className="dropdown margin-top-20">
                            <button className="btn btn-primary form-control dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Order Filter&nbsp;
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <Link  to="/order/purchase?show=received"><li className="padding-5 cusor-pointer">Order Received</li></Link>
                                <Link to="/order/purchase?show=pending"><li className="padding-5 cusor-pointer">Order Pending</li></Link>
                                <Link to="/order/purchase"><li className="padding-5 cusor-pointer">All</li></Link>
                            </ul>
                        </div>
                    </div>

                    <div className="col-sm-3 margin-top-20">
                        <div className="form-group">
                            <Link to="/order/purchase/add"><button className="form-control btn btn-success"><i className="glyphicon glyphicon-plus"></i> New Purchase Order</button></Link>
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
                        <th className="text-center">Received</th>
                        <th>Total Quantity</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getOrderListPage(this.props.purchaseOrderList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PurchaseOrderList);