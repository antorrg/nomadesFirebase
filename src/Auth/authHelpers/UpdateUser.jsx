import axios from "axios";
import {
  HandlError,
  showSuccess,
  showError,
} from "../generalComponents/HandlerError";
import {setAuthHeader} from "../generalComponents/axiosUtils";

export async function upgradeUser(userId, user, onClose) {
  try {
    const response = await axios.patch(
      `/api/v1/user/upgrade/${userId}`,
      user,
      setAuthHeader()
    );
    if (response.status === 200) {
      showSuccess(`Usuario actualizado con éxito`);
      await onClose(); // Cierra el modal después de guardar los cambios
    } else {
      showError("Error al actualizar el usuario");
    }
  } catch (error) {
    HandlError(error);
  }
}
export async function updateUser(userId, editedUser, onClose) {
  const { email, picture, country, given_name } = editedUser;
  try {
    const response = await axios.put(
      `/api/v1/user/updprofile/${userId}`,
      { email, picture, country, given_name },
      setAuthHeader()
    );
    if (response.status === 200) {
      showSuccess(`Usuario actualizado con éxito`);
      await onClose();
    } else {
      showError("Error al actualizar el usuario");
    }
  } catch (error) {
    HandlError(error);
  }
}
