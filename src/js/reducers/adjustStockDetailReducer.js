/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const adjustStockDetailReducer = (state = {
    adjust_id:"",
    adjust_datetime:"",
    warehouse_id:"",
    user_id:"",
    adjustProductList:[]
}, action) => {

    let temp = {
        adjust_id:"",
        adjust_datetime:"",
        warehouse_id:"",
        user_id:"",
        adjustProductList:[]
    }
    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_ADJUST_STOCK_DETAILS:
            return {...temp, ...action.payload};
            break;
    }
    return state;
}
export default adjustStockDetailReducer;