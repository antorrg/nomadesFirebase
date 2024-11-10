import axios from "axios";
import {
  HandlError,
  showSuccess,
  showError,
} from "../generalComponents/HandlerError";
import setAuthHeader from "../generalComponents/axiosUtils";

export default async function onDeleteUser(id, onClose) {
  try {
    const response = await axios.delete(`api/v1/user/${id}`, setAuthHeader());
    if (response.status === 200) {
      showSuccess("Usuario eliminado con exito");
      onClose();
    }
  } catch (error) {
    HandlError(error);
  }
}
