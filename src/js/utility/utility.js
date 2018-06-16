    /**
 * Created by vipulsodha on 04/12/16.
 */


    export const  padWithZeros = (str = 0, max  ) => {
        str = str.toString();
        return str.length < max ? padWithZeros("0" + str, max) : str;
    }

    export const ellipsString = (n, str) => {
        return (str.length > n) ? str.substr(0,n-1) + '&hellip' : str;
    }