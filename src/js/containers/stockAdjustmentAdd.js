import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {connect} from 'react-redux';

import {Link} from 'react-router';

import {updateProductListAction, showNotificationusBar} from '../actions/actions';

import {getProductList, saveNewAdjustRequest} from '../actions/apiActions';

import AutoComplete from '../components/autoCompleteInput';

import {hashRedirect} from '../utility/redirectFunctions';

import {emptyInputCheck} from '../utility/formValidationFunctions'

const mapStateToProps = (store) => {
    return {
        userDetails: store.userDetails,
        productList: store.productList
    }
}

 class StockAdjustmentAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state = {
            currentSelectedDate :moment(),
            warehouse_id:this.props.userDetails.warehouse_id,
            description:"",
            reason:"",
            adjustProductList:[{productId:"", currentQuantity: "", quantityAdjusted:0, newQuantityAvailable:"", productDetails: {}, productName:""}],
        };

        this.state.dirtyCount = 0;
        this.dateChanged = this.dateChanged.bind(this);
        this.getProductAdjustList = this.getProductAdjustList.bind(this);
        this.getProductList = this.getProductList.bind(this);
        this.quantityAdjustedChanged = this.quantityAdjustedChanged.bind(this);
        this.reasonChanged = this.reasonChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.productSelected = this.productSelected.bind(this);
        this.createAdjustment = this.createAdjustment.bind(this);
        this.dirtyCheckForm = this.dirtyCheckForm.bind(this);
    }

    dateChanged(date) {
        this.setState({currentSelectedDate: date});
    }

    descriptionChanged(e) {
        emptyInputCheck(e.target);
        this.setState({description:e.target.value});

    }

     dirtyCheckForm(target) {
         let temp = emptyInputCheck(target);
         if(temp == 1) {
             this.setState({dirtyCount: this.state.dirtyCount + 1});
         } else if(temp == 2) {
             this.setState({dirtyCount: this.state.dirtyCount - 1});
         }
     }

    reasonChanged(e) {
        emptyInputCheck(e.target);
        this.setState({reason:e.target.value});
    }

    componentWillMount() {
        let warehouseId = this.props.userDetails.warehouse_id;
        this.props.dispatch(updateProductListAction(getProductList(0,0, warehouseId)));
    }

    componentWillReceiveProps(nextProps) {

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

        let dataIndex = data.index;
        let elemIndex = data.elemIndex;
        let  productList = this.props.productList;
        let currentProductDetails = this.props.productList[dataIndex];
        let currentQuantity = productList[dataIndex].personal_warehouse_quantity;

        let temp = this.state.adjustProductList.map((elem, index) => {
            if(index == elemIndex) {
                return {...elem, productName:currentProductDetails.product_name, productId:data.id, currentQuantity: currentQuantity, newQuantityAvailable:currentQuantity, quantityAdjusted:0}
            }
            return elem;
        });

        this.setState({adjustProductList: temp});
    }
     quantityAdjustedChanged(e) {
         this.dirtyCheckForm(e.target);
         let  elemIndex = e.target.attributes["data-index"].value;

         let adjustment = e.target.value;

         let adjustedProduct = this.state.adjustProductList[elemIndex];

         let oldQuantity = adjustedProduct.currentQuantity;

         let temp = this.state.adjustProductList.map((elem, index) => {
             if(index == elemIndex) {
                 if(adjustment.length > 0 && !isNaN(adjustment)) {
                     adjustment = parseInt(adjustment);
                     let newQuantity = parseInt(oldQuantity) + adjustment;
                     return {...elem, quantityAdjusted: adjustment, newQuantityAvailable: newQuantity};
                 } else {
                     return {...elem, quantityAdjusted:  adjustment, newQuantityAvailable: oldQuantity};
                 }
             }
             return elem;
         });

         this.setState({adjustProductList: temp});
     }

     removeProduct(e) {
         let  index = e.target.attributes["data-index"].value;
         let newAdjustProductList = [...this.state.adjustProductList];
         newAdjustProductList.splice(index, 1);
         this.setState({adjustProductList:newAdjustProductList});
     }

     addNewProduct() {
        this.setState({adjustProductList: [...this.state.adjustProductList, {productId:"", productName:"", currentQuantity: "", quantityAdjusted:0, newQuantityAvailable:""}]})
     }

     createAdjustment() {
         let data = {
             adjustDetails: {
                 adjustDateTime: this.state.currentSelectedDate.format("DD/MM/YYYY"),
                 warehouse_id: this.state.warehouse_id,
                 user_id: this.props.userDetails.emp_id,
                 adjust_reason:this.state.reason,
                 adjust_description: this.state.description
             },
             product_details: this.state.adjustProductList
         };


         if(data.adjust_reason == "") {
             this.props.dispatch(showNotificationusBar("Please enter Adjustment Reason", "error"));
         } else if(data.adjust_description == "") {
             this.props.dispatch(showNotificationusBar("Please enter Adjustment Description", "error"));
         }

         data.product_details = data.product_details.filter((elem) => {
             return elem.productId == ""? false: true;
         });

         if(data.product_details.length == 0) {
             this.props.dispatch(showNotificationusBar("Please select atleast one Product", "error"));
             return;
         }

         let id = saveNewAdjustRequest(data);
         this.props.dispatch(showNotificationusBar("Stock Adjustment done"));
         hashRedirect(`inventory/adjust/${id}`);
     }


     getProductAdjustList() {
        let temp = this.state.adjustProductList.map((elem, index) => {

            var opts = {};
            if(elem.productId == '') {
                opts['disabled'] = "disabled";
            }
            let min = -elem.currentQuantity || 0;
                return (
                    <div className="row" key={index}>
                        <div className="col-sm-4">
                            <AutoComplete
                                label="Product Name"
                                defaultValue={elem.productName}
                                defaultValueId={elem.productId}
                                autoCompleteList={this.getProductList(this.props.productList)}
                                showSearch = {true}
                                onSelect={this.productSelected}
                                elemIndex={index}

                            />
                        </div>
                        <div className="col-sm-2 ">
                            <div className="form-group">
                                <label>Quantity Available</label>
                                <input disabled="disabled" data-index={index} type="text" className="form-control" value={elem.currentQuantity}/>
                            </div>
                        </div>
                        <div className="col-sm-2 ">
                            <div className="form-group">
                                <label>Quantity Adjusted</label>
                                <input placeholder="+10 or -10" min={min} {...opts} data-index={index} type="number" className="form-control" value={elem.quantityAdjusted} onChange={this.quantityAdjustedChanged}/>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>New Quantity Available</label>
                                <input disabled="disabled" data-index={index} type="text" className="form-control" value={elem.newQuantityAvailable} />
                            </div>
                        </div>
                        <div className="col-sm-1">
                            {
                                this.state.adjustProductList.length > 1 ?
                                    <i data-index={index} className="glyphicon glyphicon-remove margin-top-30 cusor-pointer" onClick={this.removeProduct}></i>
                                    :
                                    ""
                            }

                        </div>
                    </div>
                )
         });
         return temp;
     }

    render() {
        let opts={};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <div className="row">
                    <div className="col-sm-3">
                        <h3>New Adjustment</h3>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <h4>Adjustment Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Date</label><br/>
                                <DatePicker selected={this.state.currentSelectedDate} onChange = {this.dateChanged} />
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-2">
                            <div className="form-group">
                                <label>Warehouse: </label>
                                <input value={this.props.userDetails.warehouse_location} className="form-control" disabled="true"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Reason Of adjustment</label>
                                <input placeholder="Stolen goods, fire, inventory revaluation" value={this.state.reason} className="form-control" onChange={this.reasonChanged}/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-2">
                            <label>Description</label>
                            <textarea className="form-control resize-off" value={this.state.description} onChange={this.descriptionChanged}></textarea>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <h4>Product Details</h4>
                    {this.getProductAdjustList()}
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-10">
                            <div className="form-group">
                                <button className="form-control btn btn-primary" onClick={this.addNewProduct}><i className="glyphicon glyphicon-plus-sign"></i> Add Product</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-20 light-background">
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-10">
                            <div className="form-group">
                                <button {...opts} className="btn btn-primary form-control margin-top-20" onClick={this.createAdjustment}>Create Adjustment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(StockAdjustmentAdd);