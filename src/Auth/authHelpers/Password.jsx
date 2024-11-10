import axios from "axios";
import {
  HandlError,
  showSuccess,
  showError,
} from "../generalComponents/HandlerError";
import setAuthHeader from "../generalComponents/axiosUtils";

const verifyPassword = async (userData, setVerify) => {
  const id = userData.id;
  const password = userData.password;
  try {
    const response = await axios.post(
      `/api/v1/user/update`,
      {
        id,
        password,
      },
      setAuthHeader()
    );
    if (response.status === 200) {
      const user = response.data;
      showSuccess("Verificacion exitosa");
      setVerify(false);
      return user;
    }
  } catch (error) {
    HandlError(error);
  }
};

const changePassword = async (id, passChange, setVerify, onClose, logout) => {
  try {
    // Realiza la solicitud PUT con Axios
    const response = await axios.put(
      `/api/v1/user/update/${id}`,
      passChange,
      setAuthHeader()
    );

    if (response.status === 200) {
      showSuccess("Usuario actualizado con éxito. Inicie sesion nuevamente");
      setVerify(true);
      onClose(); // Cierra el modal después de guardar los cambios
      setTimeout(() => {
        logout();
      }, 5000);
    } else {
      showError("Error al actualizar el usuario");
    }
  } catch (error) {
    HandlError({ error: error.message });
  }
};

const onResetPass = async (id, onClose) => {
  try {
    const response = await axios.post(
      `/api/v1/user/change`,
      { id },
      setAuthHeader()
    );
    if (response.status === 200) {
      showSuccess("Contraseña reiniciada con exito");
      onClose();
    }
  } catch (error) {
    HandlError(error);
  }
};

export { verifyPassword, changePassword, onResetPass };
