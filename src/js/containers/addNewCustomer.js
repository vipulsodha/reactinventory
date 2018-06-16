import React from 'react';
import {emptyInputCheck} from '../utility/formValidationFunctions';
import  {saveNewCustomer} from '../actions/apiActions';
import {hashRedirectAfterInterval} from '../utility/redirectFunctions';

import {showNotificationusBar} from '../actions/actions';

import {connect} from 'react-redux';

class AddNewCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state = {
            customerName:"",
            companyName:"",
            phNo:"",
            email:""
        };

        this.state.addressDetails = [{address:"", address_name:""}];

        this.customerNameChanged = this.customerNameChanged.bind(this);
        this.companyNameChanged = this.companyNameChanged.bind(this);
        this.phNoChanged = this.phNoChanged.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
        this.addressChanged = this.addressChanged.bind(this);
        this.addressNameChanged = this.addressNameChanged.bind(this);
        this.getAddressField = this.getAddressField.bind(this);
        this.addNewAddress = this.addNewAddress.bind(this);
        this.removeAddress = this.removeAddress.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.dirtyCheckForm = this.dirtyCheckForm.bind(this);

        this.state.dirtyCount = 6;
    }

    customerNameChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({customerName: e.target.value});
    }
    companyNameChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({companyName: e.target.value});
    }
    phNoChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({phNo: e.target.value});
    }
    emailChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({email: e.target.value});
    }
    addressChanged(e) {
        this.dirtyCheckForm(e.target);
        let  index = e.target.attributes["data-index"].value;
        let newValues = this.state.addressDetails.map((elem, ind)=>  {
            if(ind==index) {
                return {...elem, address:e.target.value}
            }
            return elem;
        });
        this.setState({addressDetails:newValues});
    }
    addressNameChanged(e) {
        this.dirtyCheckForm(e.target);
        let  index = e.target.attributes["data-index"].value;
        let newValues = this.state.addressDetails.map((elem, ind)=>  {
            if(ind==index) {
                return {...elem, address_name:e.target.value}
            }
            return elem;
        });
        this.setState({addressDetails:newValues});
    }
    addNewAddress() {
        this.setState({addressDetails:[...this.state.addressDetails, {address:"", address_name:""}], dirtyCount: this.state.dirtyCount + 2});
    }
    removeAddress(e) {
        let  index = e.target.attributes["data-index"].value;
        let newAddressDetails = [...this.state.addressDetails];
        let newDirtyCount = this.state.dirtyCount;
        if(newAddressDetails[index].address.length == 0) {
            newDirtyCount--;
        }
        if(newAddressDetails[index].address_name.length == 0) {
            newDirtyCount--;
        }

        newAddressDetails.splice(index, 1);
        this.setState({addressDetails:newAddressDetails, dirtyCount: newDirtyCount});
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
    getAddressField() {
        let temp = this.state.addressDetails.map((elem, index) => {
            return(
                <div className="row" key={index}>
                    <div className="col-sm-5">
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea className="form-control resize-off first-time" value={this.state.addressDetails[index].address} onChange={this.addressChanged} data-index={index}></textarea>
                        </div>
                    </div>
                    <div className="col-sm-5 col-sm-offset-1">
                        <div className="form-group">
                            <label htmlFor="address_name">Address Name</label>
                            <input className="form-control first-time" type="text" value={this.state.addressDetails[index].address_name} onChange={this.addressNameChanged} data-index={index}/>
                        </div>
                    </div>
                    <div className="col-sm-1">
                        {this.state.addressDetails.length > 1? <i className="glyphicon glyphicon-remove margin-top-30 cusor-pointer" onClick={this.removeAddress} data-index={index}></i>:""}
                    </div>
                </div>
            )
        });
        return temp;
    }

    createCustomer() {
        let id = saveNewCustomer(this.state);
        this.props.dispatch(showNotificationusBar("Customer Created"));
        let link = `/customers/${id}`;
        hashRedirectAfterInterval(link);
    }

    render() {
        let opts = {};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};

        return (
            <div className="custom-container">
                <h3 className="margin-top-5">New Customer</h3>
                <div className="auto-height-wrapper top-bottom-border light-background">
                    <h4>Customer Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label htmlFor="customer_name">Customer Name</label>
                                <input className="form-control first-time" type="text" id="customer_name" value={this.state.customerName} onChange={this.customerNameChanged}/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-1">
                            <label htmlFor="company_name">Company Name</label>
                            <input className="form-control first-time" type="text" id="company_name" value={this.state.companyName} onChange={this.companyNameChanged}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label htmlFor="ph_no">Phone No.</label>
                                <input className="form-control first-time" type="number" value={this.state.phNo} id="ph_no" onChange={this.phNoChanged}/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-1">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control first-time" value={this.state.email} id = "email" onChange={this.emailChanged}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-10 light-background border-radius">
                    <h4>Customer Address Details</h4>
                    {this.getAddressField()}
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-10">
                            <div className="form-group">
                                <button className="btn btn-primary form-control" onClick={this.addNewAddress}>Add new Address</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-10 light-background border-radius">
                    <div className="row">
                        <div className="col-sm-2 col-sm-offset-10">
                            <div className="form-group margin-top-10">
                                <button {...opts} className="btn btn-primary form-control" onClick={this.createCustomer}>Create Customer</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


export default connect()(AddNewCustomer);
