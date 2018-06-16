import React from 'react';
import {Link} from 'react-router';

import {connect} from 'react-redux';

import {updateAdjustStockList} from '../actions/actions';
import {getStockAdjustList} from '../actions/apiActions';



import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        adjustStockList: store.adjustStockList
    }
}

class StockAdjustmentList extends React.Component {

    constructor(props) {
        super(props);
    }

    getStockAdjustListForPage(list) {
        if(list.length < 1) {
            let temp = [(<tr key="0"><td>No Records</td></tr>)];
            return temp;
        }
        let temp = list.map((elem, index) => {
            let link =`/inventory/adjust/${elem.adjust_id}`;
            return (
                <tr key={index}>
                    <td><Link to={link}>#{padWithZeros(elem.adjust_id, 5)} </Link></td>
                    <td>{elem.adjust_datetime}</td>
                    <td>{elem.warehouse_location}</td>
                    <td>{elem.adjust_reason}</td>
                    <td>{elem.product_count}</td>
                    <td>{elem.adjusted_quantity}</td>
                </tr>
                )

        });
        return temp;
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateAdjustStockList(getStockAdjustList(warehouseId)));
    }

    componentWillReceiveProps(nextProps) {

    }


    render() {
        return (
            <div className="custom-container">
                {this.props.children}
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Stock Adjustment List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-6">
                        <div className="form-group">
                            <Link to="/inventory/adjust/add"><button className="form-control btn btn-success margin-top-10"><i className="glyphicon glyphicon-plus"></i> Add</button></Link>
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Adjustment Id</th>
                        <th>Date</th>
                        <th>Warehouse</th>
                        <th>Reason</th>
                        <th>No of products adjusted</th>
                        <th>Total Quantity djusted</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getStockAdjustListForPage(this.props.adjustStockList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(StockAdjustmentList);