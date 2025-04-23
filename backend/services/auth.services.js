import userInstance from "./user.services.js";

class AuthService {
  async registerUser(req) {
    let newUser = await userInstance.create(req);
    if (!newUser) {
      let err = new Error("User is not registered!!");
      err.statusCode = 400;
      throw err;
    }
    return newUser;
  }

  async loginUser(req) {
    let existingUser = await userInstance.findUserByEmail(req);
    if (!existingUser) {
      let err = new Error("User is not found!!");
      err.statusCode = 400;
      throw err;
    }
    return existingUser;
  }
}

export default new AuthService();