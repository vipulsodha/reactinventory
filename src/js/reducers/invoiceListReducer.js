/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const invoiceListReducer = (state =[], action) => {
    switch (action.type) {
        case Constants.actionConstants.UPDATE_INVOICE_LIST:
            return action.payload;
            break;
    }
    return state;
}
export default invoiceListReducer;