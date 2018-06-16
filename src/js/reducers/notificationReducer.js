/**
 * Created by Dell-1 on 08-12-2016.
 */

import  Constants from '../constants/constants';

const notificationReducer = (state =[], action) => {
    switch (action.type) {
        case Constants.actionConstants.UPDATE_NOTIFICATIONS:
            return action.payload;
            break;
    }
    return state;
}
export default notificationReducer;