/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const warehouseListReducer = (state =[], action) => {
    switch (action.type) {
        case Constants.actionConstants.UPDATE_WAREHOUSE_LIST:
            return action.payload;
            break;
    }
    return state;
}
export default warehouseListReducer;