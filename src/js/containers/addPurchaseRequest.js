import React from 'react';
import {emptyInputCheck} from '../utility/formValidationFunctions'
import { getProductList, saveNewPurchaseRequest} from '../actions/apiActions';

import {hashRedirectAfterInterval} from '../utility/redirectFunctions';

import {showNotificationusBar, updateProductListAction} from '../actions/actions';
import {connect} from 'react-redux';

import AutocompleteInput from '../components/autoCompleteInput';

const mapStateToProps = (store) => {
    return {
        productList: store.productList,
        userDetails: store.userDetails
    }
}


class AddNewPurchaseRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.productDetails = [{product_id:"", quantity:"", product_name:""}];
        this.state.dirtyCount =0;
        this.state.request_reason = 1;

        this.quantityChanged = this.quantityChanged.bind(this);
        this.getProductDetailsListPage = this.getProductDetailsListPage.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.productSelected  = this.productSelected.bind(this);
        this.requestReasonChanged = this.requestReasonChanged.bind(this);
        this.createRequest = this.createRequest.bind(this);
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

    addProduct() {
        this.setState({productDetails: [...this.state.productDetails, {product_id:"", quantity:"", product_name: ""}]});
    }


    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateProductListAction(getProductList(0,0, warehouseId)));
    }

    requestReasonChanged(e) {
        this.setState({request_reason: e.target.value});
    }

    removeProduct(e) {
        let  index = e.target.attributes["data-index"].value;
        let newProductDetails = [...this.state.productDetails];

        let dirtyCount = this.state.dirtyCount;
        if(newProductDetails[index].quantity == "") {
            dirtyCount--;
        }
        newProductDetails.splice(index, 1);
        console.log("removing");
        this.setState({productDetails:newProductDetails, dirtyCount:dirtyCount});
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

    productSelected(data) {
        let index = data.index;
        let elemIndex = data.elemIndex;
        let selectedProductDetails = this.props.productList[index];
        let id = data.id;
        let temp = this.state.productDetails.map((elem, loopIndex) => {
            if(loopIndex == elemIndex) {
                return {...elem, quantity:0, product_id: id, product_name: selectedProductDetails.product_name};
            }
            return elem;
        });
        this.setState({productDetails: temp});
    }

    quantityChanged(e) {
        this.dirtyCheckForm(e.target);
        let  elemIndex = e.target.attributes["data-index"].value;
        let temp = this.state.productDetails.map((elem, index) => {
            if(index == elemIndex) {
                return {...elem, quantity: e.target.value};
            }
            return elem;
        });

        this.setState({productDetails: temp});
    }

    getProductDetailsListPage(list) {

        let temp = list.map((elem, index) => {

            let opts = {};
            if(elem.product_id == "") {
                opts['disabled'] = 'disabled';
            }

            console.log(elem);
            return (
                <div className="row" key={index}>
                    <div className="col-sm-5">
                        <div className="form-group">
                            <AutocompleteInput
                                label = "Product Name"
                                autoCompleteList = {this.getProductList(this.props.productList)}
                                onSelect={this.productSelected}
                                elemIndex={index}
                                defaultValue={elem.product_name}
                                defaultValueId={elem.product_id}
                            />
                        </div>
                    </div>
                    <div className="col-sm-5 col-sm-offset-1">
                        <label>Quantity</label>
                        <input {...opts} data-index = {index} className="form-control" type="number" min="1" value={elem.quantity} onChange={this.quantityChanged}/>
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

    createRequest(e) {
        let  data = {
            request_reason: this.state.request_reason,
            product_list: this.state.productDetails,
            warehouse_id: this.props.userDetails.warehouse_id
        };

        data.product_list = this.state.productDetails.filter((elem) => {
            return elem.product_id == "" || elem.quantity == 0? false: true;
        });

        if(data.product_list.length == 0 ) {
            this.props.dispatch(showNotificationusBar("Please select atleast one Product", "error"));
            return;
        } else if (data.request_reason == "") {
            this.props.dispatch(showNotificationusBar("Enter request reason", "error"));
             return;
        }

        let requestId = saveNewPurchaseRequest(data);
        this.props.dispatch(showNotificationusBar("Requested"));
        hashRedirectAfterInterval(`/request/purchase/${requestId}`);
    }

    render() {
        let opts = {};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <h3>New Purchase Request</h3>
                <div className="auto-height-wrapper top-bottom-border light-background border-radius">
                    <h4>Request Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>To</label>
                                <div className="auto-complete-div"><span className="auto-complete-value">Purchase Manager</span></div>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-1">
                            <div className="form-group">
                                <label>Warehouse</label>
                                <div className="auto-complete-div"><span className="auto-complete-value">{this.props.userDetails.warehouse_location}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-10 light-background">
                    <h4>Request Products</h4>

                    {this.getProductDetailsListPage(this.state.productDetails)}

                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-10">
                            <div className="form-group">
                                <button className="btn btn-primary form-control margin-top-20" onClick={this.addProduct}>Add Products</button>

                            </div>
                        </div>
                    </div>
                    <div className="row margin-top-10">
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label>Request Reason</label>
                                <select className="form-control" value={this.state.request_reason} onChange={this.requestReasonChanged}>
                                    <option value="1">Low Stock</option>
                                    <option value="2">Demand Spike in near future</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-10 light-background">
                    <div className="row">
                        <div className="col-sm-5 col-sm-offset-7">
                            <div className="form-group margin-top-30">
                                <button {...opts}    className="form-control btn btn-primary" onClick={this.createRequest}> Create Request</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AddNewPurchaseRequest);
