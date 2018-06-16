/**
 * Created by vipulsodha on 05/12/16.
 */
import React from 'react';
import AutocompleteInput from '../components/autoCompleteInput';
import DatePicker from 'react-datepicker';
import moment from  'moment';
import {connect} from 'react-redux';


import {getProductList, getSupplierList, saveNewPurchaseOrder} from '../actions/apiActions';
import {updateProductListAction, updateSupplierList, showNotificationusBar} from '../actions/actions';

import {emptyInputCheck} from '../utility/formValidationFunctions';
import {hashRedirectAfterInterval} from '../utility/redirectFunctions';



const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        productList: store.productList,
        supplierList: store.supplierList,
        productListClone:store.productListClone
    }
}

class AddSalesOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state ={};
        this.state = {
            orderDate: moment(),
            warehouse_id: this.props.userDetails.warehouse_id,
            productDetails: [{product_id:"", product_name: "", order_quantity: "", purchase_price:"", total_price:"", quantity_available:""}],
            subTotal:0,
            total:0,
            supplier_id:"",
            selectedSupplierDetails:""
        };
        this.state.dirtyCount = 0;

        this.orderDateChanged = this.orderDateChanged.bind(this);
        this.productSelected = this.productSelected.bind(this);
        this.orderQuantityChanged = this.orderQuantityChanged.bind(this);
        this.purchasePriceChanged = this.purchasePriceChanged.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.getProductListPage = this.getProductListPage.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.calculate = this.calculate.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.supplierSelected = this.supplierSelected.bind(this);

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
        this.props.dispatch(updateSupplierList(getSupplierList()));

        if(this.props.location.query.clone && this.props.location.query.clone == 'list') {
            this.setState({productDetails: this.props.productListClone});
            setTimeout(()=>{
                this.calculate();
            },0);
        }
    }

    addProduct() {
        this.setState({productDetails: [...this.state.productDetails, {product_id:"", product_name: "", order_quantity: "", purchase_price:"", total_price:"", quantity_available:""}]});
    }

    calculate() {

        let subTotal = 0;
        let finalTotal = 0;
        let tax = 0;
        let temp = this.state.productDetails.map((elem, index) => {
            let total = 0;
            if(!isNaN(elem.order_quantity) && !isNaN(elem.purchase_price)) {

                total = total + (elem.order_quantity * elem.purchase_price);
            }

            subTotal = subTotal + total;
            return {...elem, total_price: total};
        });
        finalTotal = subTotal;
        this.setState({productDetails: temp, subTotal:subTotal, total: finalTotal, taxTotal:tax});
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

    purchasePriceChanged(e) {
        this.dirtyCheckForm(e.target);
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.productDetails.map((elem, index) => {
            if(index == elemIndex) {
                return {...elem, purchase_price: e.target.value};
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
                return {...elem, product_name: selectedProductDetails.product_name, quantity_available: selectedProductDetails.personal_warehouse_quantity, product_id: id, order_quantity: 0, purchase_price:selectedProductDetails.purchase_price_per_unit, total_price:0};
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
            let classes = {};

            let newQuantity = parseInt(this.state.productDetails[index].quantity_available) + parseInt(elem.order_quantity);
            if(isNaN(newQuantity)) {
                newQuantity = 0;
            }

            let max = this.state.productDetails[index].quantity_available || 0;

            return (
                <div className="row" key={index}>
                    <div className="col-sm-4">
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
                            <input type="number"  {...opts} min="0"  data-index = {index} className="form-control" onChange={this.orderQuantityChanged} value={elem.order_quantity}/>
                            <label {...classes}>Available Quantity: {this.state.productDetails[index].quantity_available || 0}</label>
                            <label {...classes}>New Quantity: {newQuantity}</label>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="form-group">
                            <label>Purchase Price (Rs.)</label>
                            <input type="number" min="0" {...opts} data-index = {index} className="form-control" onChange={this.purchasePriceChanged} value={elem.purchase_price}/>
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


    createOrder() {
        let data = {
            order_datetime: this.state.orderDate.format("DD/MM/YYYY"),
            total_amount: this.state.total,
            warehouse_id: this.state.warehouse_id,
            supplier_id: this.state.supplier_id
        }
        data.product_list = this.state.productDetails.filter((elem) => {
            return elem.product_id == "" || elem.order_quantity == 0? false: true;
        });

        if(data.product_list.length == 0 ) {
            this.props.dispatch(showNotificationusBar("Please select atleast one Product", "error"));

        } else if(data.supplier_id == "") {
            this.props.dispatch(showNotificationusBar("Please select Supplier", "error"));
        } else {
            let id = saveNewPurchaseOrder(data);
            this.props.dispatch(showNotificationusBar("Purchase Order Created"));
            let redirect = `/order/purchase/${id}`;
            hashRedirectAfterInterval(redirect);
        }
    }

    getSupplierList(list) {
        let temp = list.map((elem) => {
            return {
                value:elem.name,
                id: elem.supplier_id
            }
        });
        return temp;
    }
    supplierSelected(data) {
        let supplier_id = data.id;
        let index = data.index;
        this.setState({supplier_id: supplier_id, selectedSupplierDetails:this.props.supplierList[index]});
    }

    render() {
        let opts={};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <h3 className="margin-top-5">New Purchase Order</h3>
                <div className="auto-height-wrapper top-bottom-border light-background">
                    <h4>Supplier Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <AutocompleteInput
                                label="Select Supplier"
                                autoCompleteList = {this.getSupplierList(this.props.supplierList)}
                                onSelect={this.supplierSelected}
                                defaultValue="Select Supplier"
                            />
                        </div>
                    </div>
                    {
                        this.state.supplier_id != ""?
                            <div className="row margin-top-20">
                                <div className="col-sm-5">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="auto-complete-div">
                                            <span className="auto-complete-value">{this.state.selectedSupplierDetails.email_id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-5 col-sm-offset-2">
                                    <div className="form-group">
                                        <label>Phone No.</label>
                                        <div className="auto-complete-div">
                                            <span className="auto-complete-value">{this.state.selectedSupplierDetails.ph_no}</span>
                                        </div>
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
                        <div className="col-sm-2 col-sm-offset-6 big-font">Total (Rs.)</div>
                        <div className="col-sm-3 col-sm-offset-1 big-font">{this.state.total}</div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <div className="col-sm-3 col-sm-offset-9">
                        <div className="form-group">
                            <button {...opts} className="form-control btn btn-primary margin-top-20" onClick={this.createOrder}>Create Purchase Order</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps)(AddSalesOrder);