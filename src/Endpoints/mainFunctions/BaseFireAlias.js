import { showSuccess, HandlError } from "./HandlerError";

const handleError = HandlError;

class BaseFireAlias {
  constructor(fn) {
    this.fn = fn;
  }
  async reqWithId (functionName, id='', data = {},toast=false, onSuccess= null, onReject = null, message = 'Operación exitosa'){
    try {
      const response = await this.fn[functionName](id, data);
      if(toast)showSuccess(message);
      if (onSuccess) await onSuccess();
      return response
    } catch (error) {
      handleError(error);
      if (onReject) await onReject();
      throw error
    }
  }
  async reqSimple (functionName,data = {}, toast = false, onSuccess= null, onReject = null, message = 'Operación exitosa'){
    try {
      const response = await this.fn[functionName](data);
      if(toast)showSuccess(message);
      if (onSuccess) await onSuccess();
      return response
    } catch (error) {
      handleError(error);
      if (onReject) await onReject();
      throw error
    }
  }
}

export default BaseFireAlias;
