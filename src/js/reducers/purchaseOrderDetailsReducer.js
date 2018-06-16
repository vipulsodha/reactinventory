/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const purchaseOrderDetailsReducer = (state = {
    supplier_id: "",
    name: "",
    order_datetime: "",
    order_id: "",
    order_received:"",
    email_id:"",
    ph_no: "",
    total_amount: "",
    warehouse_id: "",
    productList: [],
    receiveLogs:[]
}, action) => {

    let temp  = {
        supplier_id: "",
        name: "",
        order_datetime: "",
        order_id: "",
        order_received:"",
        email_id:"",
        ph_no: "",
        total_amount: "",
        warehouse_id: "",
        productList: [],
        receiveLogs:[]
    }

    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_PURCHASE_ORDER_DETAILS:
            let tempPayload =  {...temp, ...action.payload};
            return tempPayload;

            break;
    }

    return state;
}


export default purchaseOrderDetailsReducer ;
