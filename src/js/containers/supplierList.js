import React from 'react';

import {connect} from 'react-redux';
import {updateSupplierList} from '../actions/actions';
import {getSupplierList} from '../actions/apiActions';
import {Link} from 'react-router';

const mapStateToProps = (store) => {
    return {
        supplierList: store.supplierList,
        userDetails: store.userDetails
    }
}

 class SupplierList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
         if(this.props.supplierList.length && this.props.supplierList.toString() != nextProps.supplierList.toString()) {
             this.props.dispatch(updateSupplierList(getSupplierList()));
         }
     }


    componentWillMount() {
        this.props.dispatch(updateSupplierList(getSupplierList()));
    }

     getSupplierList(list) {
        let temp = list.map((elem, index) => {
            return (
                <tr key={index}>
                    <td>{elem.name}</td>
                    <td>{elem.ph_no}</td>
                    <td>{elem.email_id}</td>
                </tr>
            )
        });
         return temp;
     }

    render() {
        return (
            <div className="custom-container">
                <div className="row">
                    <div className="col-sm-2">
                        <h3>Supplier List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-8">
                        <Link to="/supplier/add"><button className="btn btn-success"><i className="glyphicon glyphicon-plus"></i> Add Supplier</button></Link>
                    </div>
                </div>
                <table className="table padding-5">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getSupplierList(this.props.supplierList)}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default connect(mapStateToProps)(SupplierList);

