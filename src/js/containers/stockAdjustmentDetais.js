import React from 'react';

import {hashRedirect} from '../utility/redirectFunctions';

import {connect} from 'react-redux';

import {getStockAdjustDetails} from '../actions/apiActions';
import {updateCurrentAdjustStockDetails} from '../actions/actions';

import {padWithZeros} from '../utility/utility';

import {Link} from 'react-router';

const mapStateToProps= (store) => {
        return {
            userDetails: store.userDetails,
            currentAdjustStockDetails: store.currentAdjustStockDetails
        }
}

class StockAdjustmentDetails extends React.Component {

    constructor(props) {
        super(props);
        this.getProductAdjustedList = this.getProductAdjustedList.bind(this);
    }

    closeModal() {
        hashRedirect("/inventory/adjust");
    }


    componentWillMount() {
        let adjust_id = this.props.routeParams.adjustId;
        let warehouse_id = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateCurrentAdjustStockDetails(getStockAdjustDetails(adjust_id, warehouse_id)));
    }

    componentWillReceiveProps(nextProps) {

    }
    getProductAdjustedList() {

        let temp = this.props.currentAdjustStockDetails.adjustProductList.map((elem, index) => {
            let link = `/inventory/product/${elem.product_id}`;
            return (
                <tr key={index}>
                    <td><Link to={link}>#{padWithZeros(elem.product_id, 5)}</Link></td>
                    <td>{elem.product_name}</td>
                    <td>{elem.quantity}</td>
                    <td>{elem.quantity_available}</td>
                </tr>
            )
        });
        return temp;

    }
    render() {
        console.log(this.props.currentAdjustStockDetails);
        let adjust_id_with_pad = `${padWithZeros(this.props.currentAdjustStockDetails.adjust_id, 5)}`;
        return (
            <div className="custom-modal fadeIn">
                <div className="header">
                    <i className="close-button glyphicon glyphicon-remove cusor-pointer" onClick={this.closeModal}></i>
                    <h3>#{adjust_id_with_pad}</h3>
                </div>
                <div className="info-container">
                    <span className="span-class"><b>Adjust id : </b>#{adjust_id_with_pad}</span>
                    <span className="span-class"><b>Date : </b>{this.props.currentAdjustStockDetails.adjust_datetime}</span>
                    <span className="span-class"><b>Reason : </b>{this.props.currentAdjustStockDetails.adjust_reason}</span>
                    <span className="span-class"><b>Description : </b>{this.props.currentAdjustStockDetails.adjust_description}</span>
                    <span className="span-class"><b>Warehouse : </b>{this.props.userDetails.warehouse_location}</span>
                </div>
                <div className="address-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Product Id</th>
                            <th>Product Name</th>
                            <th>Quantity Adjusted</th>
                            <th>New Quantity Available</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getProductAdjustedList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(StockAdjustmentDetails);