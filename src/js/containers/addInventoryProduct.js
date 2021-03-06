import React from 'react';

import AutoComplete from '../components/autoCompleteInput';
import {getCategoryList, getProductMakerList, getWarehouseList, saveNewProduct} from '../actions/apiActions';
import {connect} from 'react-redux';
import {emptyInputCheck} from '../utility/formValidationFunctions'
import {hashRedirect, hashRedirectAfterInterval} from '../utility/redirectFunctions'

import {showNotificationusBar} from '../actions/actions';
const mapStateToProps = (store) => {
    return{
        userDetails: store.userDetails
    }
}

class AddInventoryProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state = {
            productName:"",
            productCategory:"CPU",
            productCategoryId:1,
            productCode:"",
            productDetail:"",
            productMaker:"Intel",
            productMakerId:1,
            productWarehouseId:this.props.userDetails.warehouse_id,
            initialProductQuantity:0,
            perUnitPrice:0,
            productThreshold:0,
            dirtyCount:0,
            sellingPricePerUnit:0,
            purchasePricePerUnit:0
        };


        this.state.dirtyCount = 3;

        this.onCategorySelect = this.onCategorySelect.bind(this);
        this.productNameChanged = this.productNameChanged.bind(this);
        this.productCodeChanged = this.productCodeChanged.bind(this);
        this.productDetailChanged = this.productDetailChanged.bind(this);
        this.productMakerChanged = this.productMakerChanged.bind(this);
        this.warehouseChanged = this.warehouseChanged.bind(this);
        this.initialQuanityChanged = this.initialQuanityChanged.bind(this);
        this.perUnitPriceChanged = this.perUnitPriceChanged.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.thresholdChanged = this.thresholdChanged.bind(this);
        this.purchasePriceChanged = this.purchasePriceChanged.bind(this);
        this.sellingPriceChanged = this.sellingPriceChanged.bind(this);
    }

    getAutoCompleteList() {
        return getCategoryList().map((elem) => {
            return {
                value: elem.category_name,
                id: elem.category_id
            }
        });
    }

    getProductMakerList() {
        return getProductMakerList().map((elem) => {
            return {
                value:elem.maker_name,
                id:elem.maker_id
            }
        })
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


    getWarehouseList() {
        return getWarehouseList().map((elem) => {
            return {
                value:`${elem.warehouse_name} (${elem.warehouse_location})`,
                id: elem.warehouse_id
            }
        })
    }

    onCategorySelect(data) {
        this.setState({productCategory:data.value, productCategoryId:data.id});
    }

    productNameChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({productName: e.target.value});
    }

    productCodeChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({productCode: e.target.value});
    }

    productDetailChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({productDetail: e.target.value});
    }

    initialQuanityChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({initialProductQuantity: e.target.value})
    }

    perUnitPriceChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({perUnitPrice: e.target.value})
    }

    productMakerChanged(data) {
        this.setState({productMaker:data.value, productMakerId: data.id});
    }

    warehouseChanged(data) {
        this.setState({productWarehouseId: data.id});
    }
    thresholdChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({productThreshold: e.target.value});
    }
    sellingPriceChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({sellingPricePerUnit:e.target.value});
    }

    purchasePriceChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({purchasePricePerUnit:e.target.value});
    }

    addProduct() {
        let productId = saveNewProduct(this.state);

        // hashRedirect(`/inventory/product/${productId}`);
        this.props.dispatch(showNotificationusBar("Product Added"));
        hashRedirectAfterInterval(`/inventory/product/${productId}`);
    }

    render() {
        let opts = {};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <h3 className = "margin-top-5">{this.state.productName.length > 0? `${this.state.productName}`:"New Product"}</h3>
                <div className="auto-height-wrapper top-bottom-border light-background">
                    <h4>Product Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label htmlFor="product-name">Product Name</label>
                                <input autoFocus="autoFocus" onChange={this.productNameChanged} value={this.state.productName} id="product-name" type="text" className="form-control first-time"  placeholder="product name"/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-lg-offset-2">
                            <AutoComplete label="Select Category" defaultValue={this.state.productCategory} defaultValueId = {this.state.productCategoryId} autoCompleteList={this.getAutoCompleteList()} onSelect={this.onCategorySelect} showSearch={true} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label htmlFor="product_code">Product code</label>
                                <input onChange={this.productCodeChanged} className="form-control first-time" id="product_code" value={this.state.productCode} placeholder="enter product code"/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-2">
                            <div className="form-group">
                                <label htmlFor="product_detail">Product detail</label>
                                <input onChange={this.productDetailChanged} className="form-control first-time" id="product_detail" value={this.state.productDetails} placeholder="enter product detail"/>
                            </div>
                        </div>
                    </div>
                    <div className="row margin-top-10">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Selling Price per Unit</label>
                                <input type="number" className="form-control" placeholder="enter selling price of this product" value={this.state.sellingPricePerUnit} onChange={this.sellingPriceChanged}/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-2">
                            <label>Purchase Price per unit</label>
                            <input type="number" className="form-control" placeholder="enter purchase price for this product" value={this.state.purchasePricePerUnit} onChange={this.purchasePriceChanged}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <AutoComplete label="Product Maker" defaultValue={this.state.productMaker} defaultValueId = {this.state.productMakerId} autoCompleteList={this.getProductMakerList()} onSelect={this.productMakerChanged} showSearch={true} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper top-bottom-border light-background margin-top-10">
                    <h4>Initial Stock Details ({this.props.userDetails.warehouse_location} Warehouse)</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label htmlFor="initial_quantity">Initial Quantity</label>
                                <input type="number" min="0" onChange={this.initialQuanityChanged} className="form-control" value={this.state.initialProductQuantity} placeholder="Initial product quantity" />
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-2">
                            <div className="form-group">
                                <label htmlFor="product_threshold">Set threshold value for reminder</label>
                                <input type="number" min="0" onChange={this.thresholdChanged} className="form-control" value={this.state.productThreshold} placeholder="Enter product threshold"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper top-bottom-border light-background margin-top-10">
                    <div className="row">
                        <div className="col-sm-5 col-sm-offset-7">
                            <div className="form-group margin-top-20">
                                <button {...opts} className="btn btn-primary form-control" onClick={this.addProduct}><i className="glyphicon glyphicon-plus-sign"></i> Add Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (connect(mapStateToProps))(AddInventoryProducts);