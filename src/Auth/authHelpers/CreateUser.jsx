import axios from "axios";
import {
  HandlError,
  showSuccess,
  showError,
} from "../generalComponents/HandlerError";
import {setAuthHeader} from "../generalComponents/axiosUtils";

export default async function createUser(userData, onClose) {
  const email = userData.email;

  try {
    const response = await axios.post(
      `api/v1/user/create`,
      {
        email,
      },
      setAuthHeader()
    );
    if (response.status === 201) {
      const user = response.data.data;
      showSuccess("¡Usuario creado exitosamente");
      onClose();
      //console.log(user)
      return user;
    }
  } catch (error) {
    HandlError(error);
    throw error;
  }
}
