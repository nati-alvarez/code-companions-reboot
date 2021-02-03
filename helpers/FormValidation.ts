export default function validate(field){
    switch(field.validationType){
        case "email":
            const emailRegex = /\S+@\S+\.\S+/;
            if(!emailRegex.test(field.value)) {
                return [false, field, "Please enter in a valid email address"];
            }
        break;
        case "no-spaces":
            const format = /^[\w\d]+[\w\d_-]$/;
            if(!format.test(field.value)){
                return [false, field, 'This field may only contain letters, numbers, and the characters "_" and "-" and be 2 characters minimum'];
            }
            break;
        case "password":
            const spaces = /^\S*$/
            if(field.value.length < 6 || !spaces.test(field.value)){
                return [false, field, "Password must be 6 charaters or longer and contain no spaces"];
            }
            break;
        case "numeric":
            const numbers = /^\d*$/;
            if(!numbers.test(field.value)){
                return [false, field, "This field may only contain numbers"]
            }
            break;
        case "letters":
            const letters = /^\w*$/;
            if(!letters.test(field.value)){
                return [false, field, "This field may only contain letters or spaces"]
            }
            break;
        }
    return [true, field, null];
}