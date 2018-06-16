import Constants from '../constants/constants'


export const checkLoggedIn = () => {
	if(Constants.genericConstants.LocalStorage.getItem("authId")) {
		return true;
	}
	return false;

}

export const redirectLogin = () => {
	if(!checkLoggedIn()) {
		window.location = "login.html";
	}
}

