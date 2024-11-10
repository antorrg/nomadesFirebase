import { db, storage } from"./firebase.js";
import * as fire from "./storage.js"
import env from '../envConfig.js'
import eh from '../utils/errorHandlers.js'
import help from "./helpers.js";

const User = db.collection("user");

const initialUser = async () => {
  const email = env.UserEmail;
  const password = env.UserPass;
  const role = 9;
  try {
    const snapshot = await User.get();
      //return snapshot.docs
      if (!snapshot.empty) {
        return console.log('The user already exists');
      }
    await serv.userCreate(email, password, role);
    
    return console.log("The user was successfully created!!");
  } catch (error) {
    console.error("Algo ocurrió al inicio: ", error);
  }
};
export default initialUser;

