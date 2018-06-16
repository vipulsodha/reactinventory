/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const notificationBarReducer = (state = {
    message: "",
    show: false,
    type:"message",
    timeOut:true
}, action) => {
    switch (action.type) {
        case Constants.actionConstants.SHOW_NOTIFICATION_BAR:
            return action.payload;
            break;
        case Constants.actionConstants.CLOSE_NOTIFICATION_BAR:
            return action.payload;
            break;
    }
    return state;
}
export default notificationBarReducer;