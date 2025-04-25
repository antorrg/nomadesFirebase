import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
 
  //  const HandlError = (error) => {
  //   if (error.response) {
  //     const status = error.response.status;
  //     const data = error.response.data;
  //     toast.error(`Error ${status}. ${data}`);
  //   } else if (error.request) {
  //     // La solicitud fue realizada pero no se recibió respuesta
  //     toast.error('No se recibió respuesta del servidor.');
  //    } 
  // };
  const HandlError = (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const msg = typeof data === 'string' ? data : data?.message || 'Error desconocido';
      toast.error(`Error ${status}. ${msg}`, {
        toastId: `error-${status}-${msg}`,
      });
    } else if (error.request) {
      toast.error('No se recibió respuesta del servidor.', {
        toastId: 'no-response',
      });
    } else {
      toast.error('Ocurrió un error inesperado.', {
        toastId: 'unexpected',
      });
    }
  };
  




const showSuccess = (mensaje) => {
  toast.success(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};

const showError = (mensaje) => {
  toast.error(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
const showInfo = (mensaje) => {
  toast.info(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
const showWarn = (mensaje) => {
  toast.warn(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
export {
    HandlError,
    showError,
    showInfo,
    showSuccess,
    showWarn
};