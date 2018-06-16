/**
 * Created by Dell-1 on 20-12-2016.
 */
/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const purchaseRequestDetailsReducer = (state = {
    request_datetime: "",
    request_id: "",
    role_id: "",
    warehouse_id: 1,
    productList:[]
}, action) => {

    let temp = {
        request_datetime: "",
        request_id: "",
        role_id: "",
        warehouse_id: 1,
        productList:[]
    };
    switch (action.type) {
        case Constants.actionConstants.UPDATE_PURCHASE_REQUEST_DETAILS:
            return {...temp, ...action.payload};
            break;
    }

    return state;
}


export default purchaseRequestDetailsReducer;
