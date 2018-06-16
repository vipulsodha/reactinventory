/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const customerDetailsReducer = (state = {
    name:"",
    ph_no:"",
    email_id:"",
    company_name:"",
    addressDetails:[],
    orderDetails: []
}, action) => {
    let temp = {
        name:"",
        ph_no:"",
        email_id:"",
        company_name:"",
        addressDetails:[],
        orderDetails: []
    }

    switch (action.type) {
        case Constants.actionConstants.UPDATE_CUSTOMER_ORDER_LIST:
            return {...temp, ...action.payload};
            break;
    }
    return state;
}
export default customerDetailsReducer;