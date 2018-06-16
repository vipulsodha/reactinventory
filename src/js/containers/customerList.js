/**
 * Created by Dell-1 on 08-12-2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {updateCustomerList} from '../actions/actions';
import {getCustomerList} from '../actions/apiActions';

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        customerList: store.customerList
    }
}

class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        this.getCustomerList = this.getCustomerList.bind(this);
    }

    getCustomerList(list) {
        let temp = list.map((elem, index) => {
            let link = `/customers/${elem.customer_id}`;
            return (
                <tr key={index}>
                    <td><Link to={link}>{elem.company_name}</Link></td>
                    <td>{elem.name}</td>
                    <td>{elem.ph_no}</td>
                    <td>{elem.email_id}</td>
                    <td>{elem.address_count}</td>
                    <td><div className="form-group">
                        <Link to={`${link}/orders`}><button className="btn btn-primary form-control font-12" onClick={this.showCustomerOrders(elem.customer_id)}>Show Orders</button></Link>
                    </div></td>
                </tr>
            )
        });
        return temp;

    }

    showCustomerOrders(customerId) {

        return (e) => {



        }
    }

    componentWillMount() {
        this.props.dispatch(updateCustomerList(getCustomerList()));
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.customerList.length && this.props.customerList.toString() != nextProps.customerList.toString()) {
            this.props.dispatch(updateCustomerList(getCustomerList()));
        }
    }

    render() {
        return (
            <div className="custom-container padding-5">
                {this.props.children}
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Customer List</h3>
                    </div>
                    <div className="col-sm-2 col-sm-offset-6">
                            <Link to="/customer/add"><button className="btn btn-success"><i className="glyphicon glyphicon-plus"></i> Add Customer</button></Link>
                    </div>
                </div>
                <table className="table padding-5">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Customer Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>No. of Address</th>
                            <th>Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.getCustomerList(this.props.customerList)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(mapStateToProps)(CustomerList)