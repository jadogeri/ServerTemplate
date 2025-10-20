
class CredentialValidatorService{
    readonly emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    readonly passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,16}$/
    readonly phoneNumberRegex = /^\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    readonly usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,16}$/; // Must start with a letter, contain only letters, numbers, and underscores, and be between 3 and 16 characters long



    constructor(){

    }
}
