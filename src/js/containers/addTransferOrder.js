/**
 * Created by vipulsodha on 05/12/16.
 */
import React from 'react';
import AutocompleteInput from '../components/autoCompleteInput';
import DatePicker from 'react-datepicker';
import moment from  'moment';
import {connect} from 'react-redux';


import {getProductList, getWarehouseList, saveNewTransferOrder, saveNotification} from '../actions/apiActions';
import {updateProductListAction, updateWarehouseList, showNotificationusBar} from '../actions/actions';

import {emptyInputCheck} from '../utility/formValidationFunctions';
import {hashRedirectAfterInterval} from '../utility/redirectFunctions';



const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        productList: store.productList,
        warehouseList: store.warehouseList
    }
}

class AddTransferOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state ={};
        this.state = {
            orderDate: moment(),
            warehouse_id: this.props.userDetails.warehouse_id,
            from_warehouse_id:"",
            productDetails: [{product_id:"", product_name: "", order_quantity: "",quantity_available:""}]
        };
        this.state.dirtyCount = 0;

        this.orderDateChanged = this.orderDateChanged.bind(this);
        this.productSelected = this.productSelected.bind(this);
        this.orderQuantityChanged = this.orderQuantityChanged.bind(this);

        this.addProduct = this.addProduct.bind(this);
        this.getProductListPage = this.getProductListPage.bind(this);
        this.removeProduct = this.removeProduct.bind(this);

        this.createOrder = this.createOrder.bind(this);
        this.warehouseSelected = this.warehouseSelected.bind(this);
    }

    dirtyCheckForm(target) {
        let temp = emptyInputCheck(target);
        console.log("Dirty checking");
        if(temp == 1) {
            this.setState({dirtyCount: this.state.dirtyCount + 1});
        } else if(temp == 2) {
            this.setState({dirtyCount: this.state.dirtyCount - 1});
        }
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateProductListAction(getProductList(0,0, warehouseId)));
        this.props.dispatch(updateWarehouseList(getWarehouseList(warehouseId)));

    }

    addProduct() {
        this.setState({productDetails: [...this.state.productDetails, {product_id:"", product_name: "", order_quantity: "", quantity_available:""}]});
    }

    removeProduct(e) {
        let  index = e.target.attributes["data-index"].value;
        let newProductDetails = [...this.state.productDetails];

        let dirtyCount = this.state.dirtyCount;
        if(newProductDetails[index].order_quantity == "") {
            dirtyCount--;
        }
        if(newProductDetails[index].purchase_price == "") {
            dirtyCount--
        }
        newProductDetails.splice(index, 1);
        this.setState({productDetails:newProductDetails, dirtyCount:dirtyCount});
    }

    productSelected(data) {
        let index = data.index;
        let elemIndex = data.elemIndex;
        let selectedProductDetails = this.props.productList[index];
        let id = data.id;
        let temp = this.state.productDetails.map((elem, loopIndex) => {

            if(loopIndex == elemIndex) {
                return {...elem, quantity_available: selectedProductDetails.personal_warehouse_quantity, product_id: id, order_quantity: 0};
            }
            return elem;
        });

        this.setState({productDetails: temp});
    }

    orderDateChanged(date) {
        this.setState({orderDate: date});
    }

    orderQuantityChanged(e) {
        this.dirtyCheckForm(e.target);
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.productDetails.map((elem, index) => {
            if(index == elemIndex) {
                return {...elem, order_quantity: e.target.value};
            }
            return elem;
        });

        this.setState({productDetails: temp});
    }

    getProductList(list) {
        let temp = list.map((elem) => {
            return {
                value:`${elem.product_name} (${elem.detail})`,
                id:elem.product_id
            }
        });

        return temp;
    }

    getProductListPage() {
        let temp = this.state.productDetails.map((elem, index) => {

            let opts = {};
            if(elem.product_id == "") {
                opts['disabled'] = 'disabled';
            }
            let classes = {};

            return (
                <div className="row" key={index}>
                    <div className="col-sm-6">
                        <AutocompleteInput
                            label = "Product Name"
                            autoCompleteList = {this.getProductList(this.props.productList)}
                            onSelect={this.productSelected}
                            elemIndex={index}
                            defaultValue="Select Product Name"
                        />
                    </div>
                    <div className="col-sm-4">
                        <div className="form-group">
                            <label>Transfer Quantity</label>
                            <input type="number" {...opts} data-index = {index} className="form-control" onChange={this.orderQuantityChanged} value={elem.order_quantity}/>
                            {/*<label {...classes}>Available Quantity in that warehouse: {this.state.productDetails[index].quantity_available || 0}</label>*/}
                        </div>
                    </div>
                    <div className="col-sm-1">
                        {
                            this.state.productDetails.length > 1 ?
                                <i data-index = {index} onClick={this.removeProduct} className="glyphicon glyphicon-remove margin-top-30 cusor-pointer"></i>
                                :
                                ""
                        }
                    </div>
                </div>
            )
        });

        return temp;
    }


    createOrder() {
        console.log(this.state);
        let data = {
            order_datetime: this.state.orderDate.format("DD/MM/YYYY"),
            to_warehouse_id: this.state.warehouse_id,
            from_warehouse_id: this.state.from_warehouse_id
        }
        data.product_list = this.state.productDetails.filter((elem) => {
            return elem.product_id == ""? false: true;
        });
        if(data.product_list.length == 0 ) {
            this.props.dispatch(showNotificationusBar("Please select atleast one Product", "error"));

        } else if(data.from_warehouse_id == "") {
            this.props.dispatch(showNotificationusBar("Please select from warehouse", "error"));
        } else {
            let id = saveNewTransferOrder(data);
            this.props.dispatch(showNotificationusBar("Transfer Order Created"));
            let redirect = `/order/transfer/${id}`;
            saveNotification("New Transfer Request", data.from_warehouse_id, redirect, 1);
            hashRedirectAfterInterval(redirect);
        }
    }

    getWarehouseList(list) {
        let temp = list.map((elem) => {
            return {
                value:`${elem.warehouse_name} (${elem.warehouse_location})`,
                id: elem.warehouse_id
            }
        });
        return temp;
    }

    warehouseSelected(data) {
        let from_warehouse_id = data.id;
        let index = data.index;
        this.setState({from_warehouse_id: from_warehouse_id});
    }

    render() {
        let opts={};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <h3 className="margin-top-5">New Transfer Order</h3>
                <div className="auto-height-wrapper top-bottom-border light-background">
                    <h4>Warehouse Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <AutocompleteInput
                                label="Select warehouse from where you want to request transfer "
                                autoCompleteList = {this.getWarehouseList(this.props.warehouseList)}
                                onSelect={this.warehouseSelected}
                                defaultValue="Select Warehouse"
                            />
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper top-bottom-border light-background margin-top-20">
                    <h4>Order Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Order date: </label><br/>
                                <DatePicker selected={this.state.orderDate}  onChange = {this.orderDateChanged}/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-1">
                            <div className="form-group">
                                <label>To Warehouse: </label>
                                <div className="auto-complete-div disabled"><span className="auto-complete-value">{this.props.userDetails.warehouse_location}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <h4>Product Details</h4>

                    {this.getProductListPage()}

                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-10">
                            <div className="form-group">
                                <button className="form-control btn btn-primary" onClick={this.addProduct}><i className="glyphicon glyphicon-plus"></i> Add Product</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <div className="col-sm-3 col-sm-offset-9">
                        <div className="form-group">
                            <button {...opts} className="form-control btn btn-primary margin-top-20" onClick={this.createOrder}>Create Transfer Order</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps)(AddTransferOrder);