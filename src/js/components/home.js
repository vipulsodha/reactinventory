import React from 'react';

import Chart from 'chart.js';

import {getDashboardData} from '../actions/apiActions';

import {connect} from 'react-redux';
Chart.defaults.global.responsive = false;

import {Link} from  'react-router';

const mapStateToProps = (store) => {
	return {
		userDetails: store.userDetails
	}
}

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state.dashboardData = {
			summary:{},
			otherWarehouseQuantity:[]
		}
	}

	componentDidMount() {
		let dashBoardData = getDashboardData(this.props.userDetails.warehouse_id);
		console.log(dashBoardData);
		var thresholdData = {
			labels: [
				"Low Stock",
				"Near To Low",
				"Total"
			],
			datasets: [
				{
					data: [dashBoardData.low_quantity, dashBoardData.near_low_quantity, dashBoardData.total_threshold_quantity],
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56"
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56"
					]
				}]
		};

		var topFiveData = {
			labels: [],
			datasets: [
				{
					data: [],
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#FACE86",
						"#AACE86"
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#FACE86",
						"#AACE86"
					]
				}]
			};

		dashBoardData.top_five.forEach((elem) => {
			topFiveData.labels.push(elem.product_name);
			topFiveData.datasets[0].data.push(elem.quantity);
		});

		let ctxProductDetails = document.getElementById("product_details_pie");
		let ctxTopSelling = document.getElementById("top_5_selling");

		new Chart(ctxProductDetails, {
			type: 'pie',
			data: thresholdData,
			animation:{
				animateScale:true
			},
			options: {
				legend: {
					display:false
				}
			}
		});

		new Chart(ctxTopSelling, {
			type: 'doughnut',
			data: topFiveData,
			animation:{
				animateScale:true
			},
			options: {
				legend: {
					display:false
				}
			}
		});



		// var barChartData = {
		// 	labels: ["abc","xyz", "lmn", "opq"],
		// 	datasets: [
		// 		{
		// 			label: "Warehouse Stock Comparison",
		// 			backgroundColor: [
		// 				'rgba(255, 99, 132, 0.2)',
		// 				'rgba(54, 162, 235, 0.2)',
		// 				'rgba(255, 206, 86, 0.2)',
		// 				'rgba(75, 192, 192, 0.2)'
		// 			],
		// 			borderColor: [
		// 				'rgba(255,99,132,1)',
		// 				'rgba(54, 162, 235, 1)',
		// 				'rgba(255, 206, 86, 1)',
		// 				'rgba(75, 192, 192, 1)'
		// 			],
		// 			borderWidth: 1,
		// 			data: [10,20,30,40],
		// 		}
		// 	]
		// };

		// barChartData.labels.push(this.props.userDetails.warehouse_location);
		// barChartData.datasets[0].data.push(dashBoardData.summary.stock_in_hand);
		// dashBoardData.otherWarehouseQuantity.forEach((elem) => {
		// 	barChartData.datasets[0].data.push(elem.total_quantity);
		// 	barChartData.labels.push(elem.warehouse_location);
		// });

		// console.log(barChartData);
        //
		// let barChartCtx = document.getElementById("warehouse_comparison");
        //
		// new Chart(barChartCtx, {
		// 	type: 'bar',
		// 	data: barChartData
		// });


		this.setState({dashboardData: dashBoardData});
	}


	getOtherWareHousePage(list) {
		let temp = list.map((elem, index) => {
			return (
				<div className="dashboard-order-summary border-1" key={index}>
					<span className="div-center text-center big-font font-24">{elem.total_quantity}</span>
					<span className="div-center text-center">Qyt.</span>
					<h6 className="text-center">{elem.warehouse_location}</h6>
				</div>
			)
		});
		return temp;
	}
	render() {
		return (
			<div className="custom-container">
				<div className="row margin-0">
					<div className="col-sm-5  padding-10 summary-height">
						<h4>Inventory Summary</h4>
						<div className="dashboard-inventory-summary border-1">
								<div className="col-sm-5">Stock in Hand</div>
							<div className="col-sm-3 col-sm-offset-4">{this.state.dashboardData.summary.stock_in_hand}</div>
						</div>
						<div className="dashboard-inventory-summary border-1">
							<div className="col-sm-5">Stock to be received</div>
							<div className="col-sm-3 col-sm-offset-4">{this.state.dashboardData.summary.stock_to_be_received}</div>
						</div>
					</div>

					<div className="col-sm-7 padding-10 summary-height">
						<h4>Other Warehouse Summary</h4>
						{this.getOtherWareHousePage(this.state.dashboardData.otherWarehouseQuantity)}
					</div>
				</div>
				<div className="row margin-0 margin-top-30">
					<div className="col-sm-6 padding-10">
						<div className="row margin-0">
							<div className="col-sm-8">
								<h4>Product Details</h4>
								<div className="col-sm-7 margin-top-10 error-font">
									<Link to="/inventory?show=low">Low stock Items</Link>
								</div>
								<div className="col-sm-2 col-sm-offset-3 margin-top-10 error-font">
									{this.state.dashboardData.low_quantity}
								</div>
								<div className="col-sm-7 margin-top-10">
									<Link to="/inventory?show=near">Items near threshold</Link>

								</div>
								<div className="col-sm-2 col-sm-offset-3 margin-top-10">
									{this.state.dashboardData.near_low_quantity}
								</div>
								<div className="col-sm-7 margin-top-10">
									All Items
								</div>
								<div className="col-sm-2 col-sm-offset-3 margin-top-10">
									{this.state.dashboardData.low_quantity + this.state.dashboardData.near_low_quantity}
								</div>
							</div>
							<div className="col-sm-4">
								<canvas id = "product_details_pie" className="height-150 width-150"></canvas>
							</div>
						</div>
					</div>
					<div className="col-sm-6 padding-10">
						<h4>Top Selling items this week</h4>
						<div className="col-sm-12 height-200">
							<canvas id="top_5_selling" className="height-200 width-200 div-center"></canvas>
						</div>
					</div>

				</div>
			</div>
		)
	}
}

export default  connect(mapStateToProps)(Home);