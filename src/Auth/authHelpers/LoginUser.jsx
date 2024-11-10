import axios from "axios";
import {
  HandlError,
  showSuccess,
  showError,
} from "../generalComponents/HandlerError";

export default async function loginUser(userData, login, succesLogin) {
  const email = userData.email;
  const password = userData.password;
  try {
    const response = await axios.post(`/api/v1/user/login`, {
      email,
      password,
    });
    if (response.status === 200) {
      const token = response.data.token;
      const user = response.data.user;
      login(user, token);
      succesLogin();
      showSuccess("¡Verificacion exitosa!");
      return user;
    }
  } catch (error) {
    showError("Verificacion fallida");
    HandlError(error);
    throw error;
  }
}
