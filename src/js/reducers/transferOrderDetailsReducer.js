/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const salesOrderDetailsReducer = (state = {
    from_warehouse_id:"",
    from_warehouse_location:"",
    order_approved:"",
    order_datetime:"",
    order_id:"",
    order_received:"",
    quantity_transfered:"",
    to_warehouse_id:"",
    to_warehouse_location:"",
    productList: []
}, action) => {

    let temp  = {

        from_warehouse_id:"",
        from_warehouse_location:"",
        order_approved:"",
        order_datetime:"",
        order_id:"",
        order_received:"",
        quantity_transfered:"",
        to_warehouse_id:"",
        to_warehouse_location:"",
        productList: []
    }

    switch (action.type) {

        case Constants.actionConstants.UPDATE_CURRENT_TRANSFER_ORDER_DETAILS:

            return {...temp, ...action.payload};

            break;
    }

    return state;
}


export default salesOrderDetailsReducer;
