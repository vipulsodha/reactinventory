
const validateEmail = (email) => {
    email = email.trim();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


export const emptyInputCheck = (target) => {

    console.log(parseInt(target.value) < parseInt(target.min));

    if(target.value.length < 1) {
       if(!$(target).hasClass('input-error')) {
           $(target).addClass('input-error');
           return 1;
       } else {
           return 3;
       }
    } else {

        if($(target).hasClass('first-time')) {
            $(target).removeClass('first-time');
                if(target.type == "number" && isNaN(target.value)) {
                    $(target).addClass('input-error');
                    return 3;
                } else if(target.type == "email" && !validateEmail(target.value)) {
                    $(target).addClass('input-error');
                    return 3;
                } else {
                    if(target.type == "number") {
                        if(!isNaN(target.min)  && parseInt(target.value) < parseInt(target.min)) {
                            $(target).addClass('input-error');

                            return 3;
                        } else if(!isNaN(target.max) && parseInt(target.max) < parseInt(target.value )) {
                            $(target).addClass('input-error');
                            return 3
                        }
                    }
                    return 2;
                }
        } else if($(target).hasClass('input-error')) {
            if(target.type == "number" && isNaN(target.value)) {
                return 3;
            } else if(target.type == "email" && !validateEmail(target.value)) {
                return 3;
            } else {
                if(target.type == "number") {
                    if(!isNaN(target.min)  && parseInt(target.value) < parseInt(target.min)) {
                        return 3;
                    } else if(!isNaN(target.max) && parseInt(target.max) < parseInt(target.value )) {
                        return 3
                    }
                }
                $(target).removeClass('input-error');
                return 2;
            }
        } else {
            if(target.type == "number" && isNaN(target.value)) {
                $(target).addClass('input-error');
                return 1;
            } else if(target.type == "email" && !validateEmail(target.value)) {
                $(target).addClass('input-error');
                return 1;
            } else {
                if(target.type == "number") {
                    if(!isNaN(target.min)  && parseInt(target.value) < parseInt(target.min)) {
                        $(target).addClass('input-error');
                        return 1;
                    } else if(!isNaN(target.max) && parseInt(target.max) < parseInt(target.value )) {
                        $(target).addClass('input-error');
                        return 1;
                    }
                }
            }
        }

        // if(!$(target).hasClass('input-error') && !$(target).hasClass('first-time')) {
        //     return 3;
        // } else {
        //
        //     if($(target).hasClass('first-time')) {
        //         $(target).removeClass('first-time');
        //         return 2;
        //     }
        //     if($(target).hasClass('input-error')) {
        //         $(target).removeClass('input-error');
        //         return 2;
        //     }
        //
        // }
    }
}



const checkMinMax = (target) => {


}
