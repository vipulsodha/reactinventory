/**
 * Created by Dell-1 on 08-12-2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {updatePurchaseRequestList} from '../actions/actions';
import {getPurchaseRequestList} from '../actions/apiActions';

import {padWithZeros} from '../utility/utility';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        purchaseRequestList: store.purchaseRequestList
    }
}

class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        this.getCustomerList = this.getCustomerList.bind(this);
    }

    getCustomerList(list) {
        if(list.length < 1) {
            let temp = [(<tr key="0"><td>No Records</td></tr>)];
            return temp;
        }

        let temp = list.map((elem, index) => {
            let link = `/request/purchase/${elem.request_id}`;
            return (
                <tr key={index}>
                    <td><Link to={link}>#{padWithZeros(elem.request_id, 5)}</Link></td>
                    <td>{elem.request_datetime}</td>
                    <td>
                        {
                            elem.request_approved?
                                <span className="label label-success font-12">Seen</span>
                                :
                                elem.request_rejected?
                                    <span className="label label-danger font-12">Rejected</span>
                                    :
                                    <span className="label label-info font-12">Waiting</span>
                        }
                    </td>
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
        let warehouseid = this.props.userDetails.warehouse_id;
        this.props.dispatch(updatePurchaseRequestList(getPurchaseRequestList(warehouseid, show)));
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
                this.props.dispatch(updatePurchaseRequestList(getPurchaseRequestList(warehouseId, show)));
            }
        }
    }

    render() {
        return (
            <div className="custom-container padding-5">
                {this.props.children}
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Purchase Request List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-3">
                        <div className="dropdown margin-top-20">
                            <button className="btn btn-primary form-control dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Filter&nbsp;
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <Link  to="/request/purchase?show=seen"><li className="padding-5 cusor-pointer">Seen</li></Link>
                                <Link to="/request/purchase?show=pending"><li className="padding-5 cusor-pointer">Pending</li></Link>
                                <Link to="/request/purchase?show=rejected   "><li className="padding-5 cusor-pointer">Rejected</li></Link>
                                <Link to="/request/purchase"><li className="padding-5 cusor-pointer">All</li></Link>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-2 col-sm-offset-1">
                        {
                            this.props.userDetails.role_id == 3?
                                <Link to="/request/purchase/add"><button className="btn btn-success margin-top-20"><i className="glyphicon glyphicon-plus"></i> New Request</button></Link>
                                :
                                ""
                        }

                    </div>
                </div>
                <table className="table padding-5">
                    <thead>
                    <tr>
                        <th>Request Id</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getCustomerList(this.props.purchaseRequestList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(CustomerList)