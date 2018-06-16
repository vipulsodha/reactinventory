/**
 * Created by vipulsodha on 05/12/16.
 */
import React from 'react';
import { connect } from 'react-redux';
import {updateProductListAction} from '../actions/actions';
import {getProductList, getCategoryList} from  '../actions/apiActions';
import {Link} from 'react-router';

import AutoComplete from '../components/autoCompleteInput';


const mapStateToProps = (store) => {
	return {
		productList: store.productList,
		userDetails: store.userDetails
	};
}


 class InventoryList extends React.Component {

	 constructor(props) {
	 	super(props);
		 this.getProductList = this.getProductList.bind(this);
		 this.filterCategoryChanged = this.filterCategoryChanged.bind(this);
		 this.searchChanged = this.searchChanged.bind(this);

		 this.state = {};
		 this.state.categoryList = this.getCategoryListForAutoComplete();
		 this.state.currentCategoryId = 0;
		 this.state.currentCategoryName = "All";
		 this.state.searchPattern = "";
	 }

	 componentWillReceiveProps(nextProps) {
		 let personalWarehouseId = this.props.userDetails.warehouse_id;
		 let show = "";
		 if(nextProps.location.query.show || this.props.location.query.show) {
			 if(nextProps.location.query.show != this.props.location.query.show) {
				 let show = "";
				 if(nextProps.location.query.show) {
					 show = nextProps.location.query.show;
				 }
				 this.props.dispatch(updateProductListAction(getProductList(0,0,personalWarehouseId, 0,"", show)));

			 }
		 }
	 }


	 componentWillMount() {
		 let personalWarehouseId = this.props.userDetails.warehouse_id;
		 let show = "";

		 if(this.props.location.query.show) {
			show = this.props.location.query.show;
		 }
		 this.props.dispatch(updateProductListAction(getProductList(0,0,personalWarehouseId, 0,"", show)));
	 }


	 getProductList() {
		let temp = this.props.productList.map((elem, index) => {
			let link = `/inventory/product/${elem.product_id}`;
			let editLink = `/inventory/product/${elem.product_id}/edit`;
			return (

					<tr key={index}>
						<td><Link to={editLink}><i className="glyphicon glyphicon-pencil"></i></Link></td>
						<td><Link to={link}>{elem.product_name}</Link></td>
						<td>{elem.category_name}</td>
						<td>{elem.code}</td>
						<td>{elem.detail}</td>
						<td className="text-center">{elem.personal_warehouse_quantity}</td>
						<td className="text-center">{elem.threshold}</td>
						<td className="text-center">
							{
								elem.personal_warehouse_quantity > (elem.threshold + 100 ) ?
									<i className="glyphicon glyphicon-record success-font"></i>
									:
									elem.personal_warehouse_quantity > elem.threshold  ?
										<i className="glyphicon glyphicon-record primary-font"></i>
										:
										<i className="glyphicon glyphicon-record error-font"></i>
							}
						</td>
						<td className="text-center">{elem.quantity}</td>
					</tr>
			)
		});
		 return temp;
	 }

	 getCategoryListForAutoComplete() {
		let temp =  getCategoryList().map((elem) => {
			return{
				value: elem.category_name,
				id: elem.category_id
			}
		});
		 temp.push({value: "All", id:0});
		 return temp;
	 }

	 filterCategoryChanged(data) {
		 this.setState({currentCategoryId: data.id, currentCategoryName: data.value});
		 let personalWarehouseId = this.props.userDetails.warehouse_id;
		 this.props.dispatch(updateProductListAction(getProductList(0, 0, personalWarehouseId, data.id, this.state.searchPattern)));
	 }

	 searchChanged(e) {
		let pattern = e.target.value;
		 let personalWarehouseId = this.props.userDetails.warehouse_id;
		 let categoryId = this.state.currentCategoryId;
		 this.state.searchPattern = pattern;
		 this.props.dispatch(updateProductListAction(getProductList(0,0,personalWarehouseId, categoryId, pattern)));
	 }

    render() {
        return (
			<div className="custom-container">
				<div className="row">
					<div className="col-sm-2">
						<h3>Inventory List</h3>
					</div>
					<div className="col-sm-2 col-sm-offset-1">
						<AutoComplete
							label="Filter Category"
							defaultValue = {this.state.currentCategoryName}
							defaultValueId = {this.state.currentCategoryId}
							autoCompleteList={this.state.categoryList}
							showSearch = {true}
							onSelect={this.filterCategoryChanged}/>
					</div>
					<div className="col-sm-3">
						<div className="form-group">
							<label>Search Product name</label>
							<input placeholder="product name or detail or code" className="form-control" type="text" onChange={this.searchChanged}/>
						</div>
					</div>
					<div className="col-sm-2">
						<div className="dropdown margin-top-20">
							<button className="btn btn-primary form-control dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								Threshold Filter&nbsp;
								<span className="caret"></span>
							</button>
							<ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
								<Link  to="/inventory?show=low"><li className="padding-5 cusor-pointer">Lower than threshold</li></Link>
								<Link to="/inventory?show=near"><li className="padding-5 cusor-pointer">Near to cross threshold</li></Link>
								<Link to="/inventory"><li className="padding-5 cusor-pointer">All</li></Link>
							</ul>
						</div>
					</div>
					<div className="col-sm-2 padding-5">
						<Link to="/inventory/product/add"> <button className="btn btn-success margin-top-20"><i className="glyphicon glyphicon-plus"></i> Add Product</button></Link>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-5">
						<b>Status : </b>&nbsp;<i className="glyphicon glyphicon-record success-font"></i>&nbsp;Enough Stock&nbsp;<i className="glyphicon glyphicon-record primary-font"></i>&nbsp;Near threshold&nbsp;<i className="glyphicon glyphicon-record error-font"></i>&nbsp;Less than threshold&nbsp;
					</div>
				</div>
				<table className="table table-hover margin-top-20">
					<thead>
						<tr>
							<th>Edit</th>
							<th>Name</th>
							<th>Category</th>
							<th>Code</th>
							<th>Details</th>
							<th>Quantity ({this.props.userDetails.warehouse_location})</th>
							<th>Threshold ({this.props.userDetails.warehouse_location})</th>
							<th>Status</th>
							<th>Quantity (All Warehouse)</th>

						</tr>
					</thead>
					<tbody>
					{this.getProductList()}
					</tbody>
				</table>
			</div>
        )
    }
}

export default connect(mapStateToProps)(InventoryList);