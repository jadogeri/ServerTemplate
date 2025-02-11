
/**
     * Validates the format of an email address.
     * Checks for the presence of "@" and ensures no consecutive dots exist after it,
     * then uses a regular expression to validate the overall structure.
     * 
     * @param email - The email address to validate.
     * @returns boolean - Returns true if the email is valid, false otherwise.
     * @throws No exceptions are thrown.
     */
function isValidEmail(email : string) {

    if(email.includes("@")){
      if(email.substring(email.lastIndexOf("@")).includes("..")){
          return false
      }
    }

    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
    return emailRegex.test(email);
  }

/**
 * Validates the format of an email address by checking for the presence of "@" 
 * and ensuring that there are no consecutive dots following it. 
 * 
 * @param email - The email address to validate.
 * @returns boolean - Returns true if the email is valid, false otherwise.
 * @throws No exceptions are thrown.
 */
function isValidPassword(password: string) {
    // Regular expression for password validation
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,16}$/
  
    return passwordRegex.test(password);
  }

/**
 * Validates the format of an email address using a regular expression. 
 * Checks for the presence of "@" and ensures valid characters and structure. 
 * 
 * @param email - The email address to validate.
 * @returns boolean - Returns true if the email format is valid, false otherwise.
 * @throws {TypeError} - Throws if the input is not a string.
 */
  function isValidUsername(username: string) {
    // Define the rules for a valid username
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,16}$/; // Must start with a letter, contain only letters, numbers, and underscores, and be between 3 and 16 characters long
  
    // Test the username against the regex
    return regex.test(username); 
  }  

/**
 * Validates the provided password against defined criteria.
 * @param password - The password string to be validated.
 * @returns boolean - Returns true if the password is valid, false otherwise.
 * @throws No exceptions are thrown.
 */
  function isValidatePhoneNumber(phone : string) {
    const regex = /^\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return regex.test(phone);
  }

  export {isValidEmail, isValidPassword, isValidUsername, isValidatePhoneNumber}