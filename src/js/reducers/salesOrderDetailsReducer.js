/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const salesOrderDetailsReducer = (state = {

    address_id: "",
    address_name: "",
    company_name: "",
    customer_address_id: "",
    customer_id: "",
    email_id: "",
    invoice_generated: "",
    name: "",
    order_approved: "",
    order_datetime: "",
    order_id: "",
    packaging_done: "",
    payment_done: "",
    ph_no: "",
    returned: "",
    shipping_address: "",
    shipping_done: "",
    tax: "",
    total_amount: "",
    warehouse_id: "",
    productList: [],
    returnOrderDetails:[]
}, action) => {

    let temp  = {

        address_id: "",
        address_name: "",
        company_name: "",
        customer_address_id: "",
        customer_id: "",
        email_id: "",
        invoice_generated: "",
        name: "",
        order_approved: "",
        order_datetime: "",
        order_id: "",
        packaging_done: "",
        payment_done: "",
        ph_no: "",
        returned: "",
        shipping_address: "",
        shipping_done: "",
        tax: "",
        total_amount: "",
        warehouse_id: "",
        productList: [],
        returnOrderDetails:[]
    }

    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_SALES_ORDER_DETAILS:
            return {...temp, ...action.payload};
            break;
    }

    return state;
}


export default salesOrderDetailsReducer;
