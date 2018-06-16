/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const purchaseOrderListReducer = (state = [], action) => {
    switch (action.type) {
        case Constants.actionConstants.UPDATE_PURCHASE_ORDER_LIST:
            return action.payload;
            break;
    }

    return state;
}


export default purchaseOrderListReducer;
