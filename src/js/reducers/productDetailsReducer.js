/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const productDetailsReducer = (state = {
    productDetails: {
        category_id: "",
        category_name: "",
        code: "",
        detail: "",
        maker: "",
        product_id: "",
        product_image: "",
        product_name: "",
        quantity_available: "",
        threshold: "",
        total_quantity: "",
        warehouse_id: ""
    },
    orderDetails: {
        initialOrder:[],
        salesOrders:[],
        purchaseOrders:[]
    },
    otherWareHouseDetails:[],
    productAdjustDetails: [],
    productTransferDetails:[]
}, action) => {


    let temp = {
        productDetails: {
            category_id: "",
            category_name: "",
            code: "",
            detail: "",
            maker: "",
            product_id: "",
            product_image: "",
            product_name: "",
            quantity_available: "",
            threshold: "",
            total_quantity: "",
            warehouse_id: ""
        },
        orderDetails: {
            initialOrder:[],
            salesOrders:[]
        },
        otherWareHouseDetails:[],
        productAdjustDetails: [],
        productTransferDetails:[]
    }


    switch (action.type) {
        case Constants.actionConstants.UPDATE_CURRENT_PRODUCT_DETAILS:
            return {...temp, ...action.payload};
            break;
    }

    return state;
}


export default productDetailsReducer;
