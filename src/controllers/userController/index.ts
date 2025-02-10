import { registerUser }  from "./registerUser";
import { loginUser } from "./loginUser";
import { logoutUser }  from "./logoutUser"
import { resetUser }  from "./resetUser"
import { forgotUser }  from "./forgotUser"
import { currentUser}  from "./currentUser"





/*

import { deactivateUser } from "./deactivateUser"
*/

module.exports = { registerUser, loginUser, logoutUser, currentUser, forgotUser, resetUser }
/*
module.exports = { registerUser, loginUser, forgotUser, deactivateUser,
                   logoutUser, resetUser, currentUser
}

*/

