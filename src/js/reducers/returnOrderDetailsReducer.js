/**
 * Created by Dell-1 on 20-12-2016.
 */
/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const productDetailsReducer = (state = {
    comment: "",
    order_datetime: "20/12/2016",
    order_id: "",
    order_received: "",
    return_reason: "",
    sales_order_id: "",
    warehouse_id:"",
    productList:[]
}, action) => {

    let temp = {
        comment: "",
        order_datetime: "20/12/2016",
        order_id: "",
        order_received: "",
        return_reason: "",
        sales_order_id: "",
        warehouse_id:"",
        productList:[]
    };
    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_RETURN_ORDER_DETAILS:
            return {...temp, ...action.payload};
            break;
    }

    return state;
}


export default productDetailsReducer;
