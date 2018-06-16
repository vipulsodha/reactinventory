import  { combineReducers, createStore } from "redux";


const testReducerOne = (state={}, action) => {
    state = {...state, age};
    return state;
}

const testReducerTwo = (state={}, action) => {
    state = {...state, name:action.payload}
    return state;
}

const  reducres = combineReducers({
    testOne: testReducerOne,
    testTwo: testReducerTwo
});

const  store = createStore(reducres);

store.subscribe(() => {
    console.log("Change Fired");
});

// store.dispatch({type: "CHANGE_NAME", payload: "Vipul"});
// store.dispatch({type: "CHANGE_AGE", payload: 45});


store.dispatch((dispatch) => {

});
