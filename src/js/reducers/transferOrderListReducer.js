/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const transferOrderListReducer = (state =[], action) => {
    switch (action.type) {
        case Constants.actionConstants.UPDATE_TRANSFER_ORDER_LIST:
            return action.payload;
            break;
    }
    return state;
}
export default transferOrderListReducer;