/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const productListCloneReducer = (state =[{product_id:"", product_name: "", order_quantity: "", purchase_price:"", total_price:"", quantity_available:"", selling_price:"", dicount: ""}], action) => {
    switch (action.type) {
        case Constants.actionConstants.SAVE_PRODUCT_LIST_FOR_CLONE:
            return action.payload;
            break;
    }
    return state;
}
export default productListCloneReducer;