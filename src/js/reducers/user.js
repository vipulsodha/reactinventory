/**
 * Created by vipulsodha on 04/12/16.
 */

const userReducer = (state={}, action) => {
    switch (action.type ) {
        case "USER_ADD":
            return {...state, name:action.payload}
            break;
    }
    return state;
}

export default userReducer;