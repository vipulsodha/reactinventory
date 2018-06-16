import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import {getSalesOrderList} from '../actions/apiActions';
import {updateSalesOrderList} from '../actions/actions';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails
    }
}

class SalesOrderList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch()
    }

    componentWillReceiveProps() {

    }

    render() {
        return (
            <div className="custom-container">
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Sales Order List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-6">
                        <div className="form-group">
                            <Link to="/order/sales/add"><button className="form-control btn btn-success"><i className="glyphicon glyphicon-plus"></i> New Sale Order</button></Link>
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Date</th>
                        <th>Approved</th>
                        <th>Invoiced</th>
                        <th>Payment Done</th>
                        <th>Packaging</th>
                        <th>Shipping</th>
                        <th>Total Quantity</th>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(SalesOrderList);