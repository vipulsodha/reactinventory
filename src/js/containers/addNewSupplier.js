import React from 'react';
import {emptyInputCheck} from '../utility/formValidationFunctions'
import { saveNewSupplier } from '../actions/apiActions';

import {hashRedirectAfterInterval} from '../utility/redirectFunctions';

import {showNotificationusBar} from '../actions/actions';
import {connect} from 'react-redux';


class AddNewSupplier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supplierName:"",
            phNo:"",
            email:""
        };

        this.state.dirtyCount = 3;
        this.supplierNameChanged = this.supplierNameChanged.bind(this);
        this.phNoChanged = this.phNoChanged.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
        this.createSupplier = this.createSupplier.bind(this);
        this.dirtyCheckForm = this.dirtyCheckForm.bind(this);

    }
    supplierNameChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({supplierName:e.target.value});
    }

    phNoChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({phNo: e.target.value});
    }
    emailChanged(e) {
        this.dirtyCheckForm(e.target);
        this.setState({email: e.target.value});
    }

    createSupplier() {
        saveNewSupplier(this.state);
        this.props.dispatch(showNotificationusBar("New Supplier Added"));
        hashRedirectAfterInterval("/supplier")
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

    render() {
        let opts = {};
        this.state.dirtyCount > 0 ? opts['disabled'] = "disabled": opts={};
        return (
            <div className="custom-container">
                <h3>New Supplier</h3>
                <div className="auto-height-wrapper top-bottom-border light-background border-radius">
                    <h4>Supplier Details</h4>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Supplier Name</label>
                                <input type="text" value={this.state.supplierName} onChange={this.supplierNameChanged} className="form-control first-time"/>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-offset-2">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={this.state.email} onChange={this.emailChanged} className="form-control first-time"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="number" value={this.state.phNo} onChange={this.phNoChanged} className="form-control first-time"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="auto-height-wrapper margin-top-10 light-background">
                    <div className="row">
                        <div className="col-sm-5 col-sm-offset-7">
                            <div className="form-group margin-top-30">
                                <button {...opts} className="form-control btn btn-primary" onClick={this.createSupplier}> Create Supplier</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(AddNewSupplier);
