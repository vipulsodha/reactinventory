/**
 * Created by vipulsodha on 05/12/16.
 */
import React from 'react';
import AutocompleteInput from '../components/autoCompleteInput';
import DatePicker from 'react-datepicker';
import moment from  'moment';
import {connect} from 'react-redux';


import {getProductList, getCustomerList, getCustomerAddressList, saveNewSalesOrder} from '../actions/apiActions';
import {updateProductListAction, updateCustomerList, showNotificationusBar} from '../actions/actions';

import {emptyInputCheck} from '../utility/formValidationFunctions';
import {hashRedirectAfterInterval} from '../utility/redirectFunctions';



const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        productList: store.productList,
        customerList: store.customerList,
        productListClone:store.productListClone
    }
}

class AddSalesOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state ={};
        this.state = {
            orderDate: moment(),
            customerId: "",
            customerAddressId:"",
            warehouse_id: this.props.userDetails.warehouse_id,
            productDetails: [{product_id:"", product_name: "", order_quantity: "", selling_price:"",discount:"", total_price:"", quantity_available:""}],
            tax: 0,
            taxTotal:0,
            subTotal:0,
            total:0,
            selectedCustomerAddressList:[],
            selectedCustomerDetails: "",
            selectedCustomerAddressDetails:""
        };
        this.state.dirtyCount = 0;

        this.customerSelected = this.customerSelected.bind(this);
        this.customerAddressSelected = this.customerAddressSelected.bind(this);
        this.orderDateChanged = this.orderDateChanged.bind(this);
        this.productSelected = this.productSelected.bind(this);
        this.orderQuantityChanged = this.orderQuantityChanged.bind(this);
        this.sellingPriceChanged = this.sellingPriceChanged.bind(this);
        this.discountChanged = this.discountChanged.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.taxChanged = this.taxChanged.bind(this);
        this.getProductListPage = this.getProductListPage.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.calculate = this.calculate.bind(this);
        this.createOrder = this.createOrder.bind(this);

    }

    dirtyCheckForm(target) {
        let temp = emptyInputCheck(target);
        if(temp == 1) {
            this.setState({dirtyCount: this.state.dirtyCount + 1});
        } else if(temp == 2) {
            this.setState({dirtyCount: this.state.dirtyCount - 1});
        }
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateProductListAction(getProductList(0,0, warehouseId)));
        this.props.dispatch(updateCustomerList(getCustomerList()));

        if(this.props.location.query.clone && this.props.location.query.clone == 'list') {
            this.setState({productDetails: this.props.productListClone});
            setTimeout(()=>{
                this.calculate();
            },0);
        }
    }

    taxChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({tax: e.target.value});
        setTimeout(()=> {
            this.calculate();
        },0);
    }

    addProduct() {
            this.setState({productDetails: [...this.state.productDetails, {product_id:"", product_name: "", order_quantity: "", selling_price:"",discount:"", total_price:"", quantity_available:""}]});
    }

    calculate() {

        let subTotal = 0;
        let finalTotal = 0;
        let tax = 0;
        let temp = this.state.productDetails.map((elem, index) => {
                let total = 0;
                if(!isNaN(elem.order_quantity) && !isNaN(elem.selling_price)) {

                    total = total + (elem.order_quantity * elem.selling_price);


                    if(!isNaN(elem.discount)) {
                        total = total - (total *  (elem.discount/100));
                    }
                }

                subTotal = subTotal + total;
                return {...elem, total_price: total};
        });

        if(!isNaN(this.state.tax)) {
            tax = subTotal * (this.state.tax/100);
            finalTotal = subTotal  + tax;
        }

        this.setState({productDetails: temp, subTotal:subTotal, total: finalTotal, taxTotal:tax});
    }

    removeProduct(e) {
        let  index = e.target.attributes["data-index"].value;
        let newProductDetails = [...this.state.productDetails];
        let dirtyCount = this.state.dirtyCount;
        if(newProductDetails[index].order_quantity == "") {
            dirtyCount--;
        }
        if(newProductDetails[index].selling_price == "") {
            dirtyCount--;
        }
        newProductDetails.splice(index, 1);
        this.setState({productDetails:newProductDetails, dirtyCount:dirtyCount});
    }

    discountChanged(e) {
        this.dirtyCheckForm(e.target);
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.productDetails.map((elem, index) => {
            if(index == elemIndex) {
                return {...elem, discount: e.target.value};
            }
            return elem;
        });

        this.setState({productDetails: temp});
        setTimeout(() => {
            this.calculate();
        }, 0);
    }

    sellingPriceChanged(e) {
        this.dirtyCheckForm(e.target);
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.productDetails.map((elem, index) => {
            if(index == elemIndex) {
                return {...elem, selling_price: e.target.value};
            }
            return elem;
        });

        this.setState({productDetails: temp});
        setTimeout(() => {
            this.calculate();
        }, 0);
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
        setTimeout(() => {
                this.calculate();
        }, 0);
    }

    productSelected(data) {
        let index = data.index;
        let elemIndex = data.elemIndex;
        let selectedProductDetails = this.props.productList[index];
        let id = data.id;
        let temp = this.state.productDetails.map((elem, loopIndex) => {

            if(loopIndex == elemIndex) {
                return {...elem, product_name:selectedProductDetails.product_name, quantity_available: selectedProductDetails.personal_warehouse_quantity, product_id: id, order_quantity: 0, selling_price:selectedProductDetails.selling_price_per_unit, discount:0, total_price:0};
            }
             return elem;
        });

        this.setState({productDetails: temp});
    }

    orderDateChanged(date) {
        this.setState({orderDate: date});
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
            let classes = {}

            if(elem.order_quantity > this.state.productDetails[index].quantity_available) {
                classes['className'] = "font-12 error-font";
            } else {
                classes['className'] = "font-12";
            }

            let max = this.state.productDetails[index].quantity_available || 0;

            return (
                <div className="row" key={index}>
                    <div className="col-sm-3">
                        <AutocompleteInput
                            label = "Product Name"
                            autoCompleteList = {this.getProductList(this.props.productList)}
                            onSelect={this.productSelected}
                            elemIndex={index}
                            defaultValue={elem.product_name}
                            defaultValueId={elem.product_id}
                        />
                    </div>
                    <div className="col-sm-2">
                        <div className="form-group">
                            <label>Order Quantity</label>
                            <input type="number" {...opts} min="1" max={max} data-index = {index} className="form-control" onChange={this.orderQuantityChanged} value={elem.order_quantity}/>
                            <label {...classes}>Available Quantity: {this.state.productDetails[index].quantity_available}</label>
                            <label {...classes}>New Quantity: {this.state.productDetails[index].quantity_available - elem.order_quantity}</label>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="form-group">
                            <label>Selling Price (Rs.)</label>
                            <input type="number" min="0" {...opts} data-index = {index} className="form-control" onChange={this.sellingPriceChanged} value={elem.selling_price}/>
                        </div>

                    </div>
                    <div className="col-sm-2">
                        <div className="form-group">
                            <label>Discount (%)</label>
                            <input type="number" min="0" max="100" {...opts} data-index = {index} className="form-control" onChange={this.discountChanged} value={elem.discount}/>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="form-group">
                            <label>Total Price (Rs.)</label>
                            <input className="form-control" disabled="disabled" value={elem.total_price}/>
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

    getCustomerList(list) {
        let temp = list.map((elem) => {
            return {
                value:`${elem.name}`,
                id:elem.customer_id
            }
        });

        return temp;
    }

    customerSelected(data) {
        let customerId = data.id;
        let index = data.index;
        this.setState({customerId: customerId, selectedCustomerAddressList:getCustomerAddressList(customerId), selectedCustomerDetails: this.props.customerList[index], customerAddressId:""});
    }
    getCustomerAddressList(list) {
        let temp = list.map((elem) => {
            return {
                value:elem.address_name,
                id: elem.address_id
            }
        });
        return temp;
    }

    customerAddressSelected(data) {
        this.setState({customerAddressId: data.id, selectedCustomerAddressDetails: this.state.selectedCustomerAddressList[data.index]});
    }

    createOrder() {
        let data = {
            order_datetime: this.state.orderDate.format("DD/MM/YYYY"),
            total_amount: this.state.total,
            tax: this.state.tax,
            warehouse_id: this.state.warehouse_id,
            customer_id: this.state.customerId,
            customer_address_id: this.state.customerAddressId,
        }
        data.product_list = this.state.productDetails.filter((elem) => {
                return elem.product_id == ""? false: true;
        });
        if(data.product_list.length == 0 ) {
            this.props.dispatch(showNotificationusBar("Please select atleast one Product", "error"));

        } else if(data.customer_id == "" && isNaN(data.customer_id)) {
            this.props.dispatch(showNotificationusBar("Please select customer", "error"));
        } else if(data.customer_address_id == "" && isNaN(data.customer_address_id)) {
            this.props.dispatch(showNotificationusBar("Please select customer address", "error"));
        } else {
            let id = saveNewSalesOrder(data);
            this.props.dispatch(showNotificationusBar("Sales Order Created"));
            let redirect = `/order/sales/${id}`;
            hashRedirectAfterInterval(redirect);
        }
    }
    render() {
        let opts={};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <h3 className="margin-top-5">New Sales Order</h3>
                <div className="auto-height-wrapper top-bottom-border light-background">
                    <h4>Customer Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <AutocompleteInput
                                label="Select Customer"
                                autoCompleteList = {this.getCustomerList(this.props.customerList)}
                                onSelect={this.customerSelected}
                                defaultValue="Select Customer"
                            />
                        </div>
                    </div>
                    {
                        this.state.customerId != "" && this.state.selectedCustomerDetails != ""?
                            <div className="row margin-top-10">
                                <div className="col-sm-5">
                                    <div className="form-group">
                                        <label>Company name</label>
                                        <div className="auto-complete-div"><span className="auto-complete-value">{this.state.selectedCustomerDetails.company_name}</span></div>
                                    </div>
                                </div>
                                <div className="col-sm-5 col-sm-offset-1">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <div className="auto-complete-div"><span className="auto-complete-value">{this.state.selectedCustomerDetails.ph_no}</span></div>
                                    </div>
                                </div>
                                <div className="col-sm-5 margin-top-10">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="auto-complete-div"><span className="auto-complete-value">{this.state.selectedCustomerDetails.email_id}</span></div>
                                    </div>
                                </div>
                            </div>

                            :
                            ""
                    }
                    {
                        this.state.customerId != ""?
                            <div className="row margin-top-10">
                                <div className="col-sm-5">
                                    <AutocompleteInput
                                        label="Select Address"
                                        autoCompleteList = {this.getCustomerAddressList(this.state.selectedCustomerAddressList)}
                                        onSelect = {this.customerAddressSelected}
                                        defaultValue="Select Customer Address"
                                    />
                                </div>
                            </div>
                            :
                            ""
                    }

                    {
                        this.state.customerAddressId != ""?
                            <div className="row margin-top-10">
                                <div className="col-sm-5">
                                    <div className="form-group">
                                        <label>Address Details</label>
                                        <textarea className="form-control resize-off" disabled="disabled" value={this.state.selectedCustomerAddressDetails.shipping_address}></textarea>
                                    </div>
                                </div>
                            </div>
                            :
                            ""
                    }
                    
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
                                <label>Warehouse: </label>
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
                    <h4>Billing Details</h4>
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-6 big-font">Sub Total (Rs.):</div>
                        <div className="col-sm-3 col-sm-offset-1 big-font">{this.state.subTotal}</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-6 big-font">
                            <div className="form-group">
                                <label className="big-font">Tax (%):</label>

                                <input type="number" min="0" max="100" className="form-control" placeholder="enter tax eg. 10%" onChange={this.taxChanged} value={this.state.tax}/>
                            </div>
                        </div>
                        <div className="col-sm-3 col-sm-offset-1 margin-top-30 big-font">{this.state.taxTotal}</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-6 big-font">Total (Rs.)</div>
                        <div className="col-sm-3 col-sm-offset-1 big-font">{this.state.total}</div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <div className="col-sm-2 col-sm-offset-10">
                        <div className="form-group">
                            <button {...opts} className="form-control btn btn-primary margin-top-20" onClick={this.createOrder}>Create Sales Order</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps)(AddSalesOrder);