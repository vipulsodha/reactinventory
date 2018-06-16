/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const customerDetailsReducer = (state = {
    name:"",
    ph_no:"",
    email_id:"",
    company_name:"",
    addressDetails:[]
}, action) => {

    let temp = {
        name:"",
        ph_no:"",
        email_id:"",
        company_name:"",
        addressDetails:[]
    }

    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_CUSTOMER_DETAILS:
            return {...temp, ...action.payload};
            break;
    }
    return state;
}
export default customerDetailsReducer;