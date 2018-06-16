/**
 * Created by vipulsodha on 06/12/16.
 */
import  Constants from '../constants/constants';


const sideBarReducer = (state = {hideSideBar:false}, action) => {

    switch (action.type) {
        case Constants.actionConstants.TOGGLE_SIDE_BAR:
            return {...state, hideSideBar: !state.hideSideBar}
            break;
    }

    return state;
}


export default sideBarReducer;