/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const userReducer = (state = {}, action) => {

    switch (action.type) {
        case Constants.actionConstants.UPDATE_USER_DETAILS:
            return {...state, ...action.payload}
            break;
    }

    return state;
}


export default userReducer;