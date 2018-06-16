/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const salesOrderListReducer = (state = [], action) => {

    switch (action.type) {
        case Constants.actionConstants.UPDATE_SALES_ORDER_LIST:
            return action.payload;
            break;
    }

    return state;
}


export default salesOrderListReducer;
