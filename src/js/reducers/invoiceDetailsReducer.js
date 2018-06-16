/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const inventoryDetailsReducer = (state = {
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
    invoice_id:""
}, action) => {

    let temp = {
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
        invoice_id:""
    }

    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_INVOICE_DETAILS:
            return {...temp, ...action.payload};
            break;
    }
    return state;
}
export default inventoryDetailsReducer;