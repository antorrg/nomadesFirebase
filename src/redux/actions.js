import axios from "axios";
//import pepe from '../api/services/service'
//import { setAuthHeader, adminValidator } from "../Endpoints/mainFunctions/axiosUtils";
import { HandlError } from "../Endpoints/mainFunctions/HandlerError";
import {
  pbLanding,
  pbProduct,
  pbProductId,
  pbItem,
  pbMedia,
  pbWorks
} from '../Endpoints/publicEndpoints'

//Public variables
export const PUB_LANDING = 'PUB_LANDING';
export const PUB_PRODUCT = 'PUB_PRODUCT'
export const PUB_PROD_ID = 'PUB_PROD_ID'
export const PUB_ITEM  = 'PUB_ITEM'
export const PUB_MEDIA = 'PUB_MEDIA'
export const PUB_WORKS = 'PUB_WORKS' 
export const PUB_CLEAN = 'PUB_CLEAN'
export const CONTACT = 'CONTACT'

//Admin Variables
export const LANDING = "LANDING";
export const LANDING_BY_ID = "LANDING_BY_ID";
export const PRODUCT = "PRODUCT";
export const PRODUCT_BY_ID = "PRODUCT_BY_ID";
export const ITEM = "ITEM";
export const CLEAN_STATE = "CLEAN_STATE";
export const ALL_USERS = "ALL_USERS";
export const USER_BY_ID = "USER_BY_ID";
export const IMAGES = "IMAGES";
export const WORKS = "WORKS";
export const WORK_BY_ID = "WORK_BY_ID";
export const ABOUT = "ABOUT";
export const MEDIA = "MEDIA";
export const MEDIA_AD = "MEDIA_AD";
export const MEDIA_BY_ID = "MEDIA_BY_ID";

//*%%%%%%% Rutas libres %%%%%%%%
/*
pbLanding,
pbProduct,
pbProductId,
pbItem,
pbMedia,
pbMediaById,
pbWorks
*/
export const getLanding = () => {
  return async (dispatch) => {
    const data = await pbLanding()
    //const data = await pepe.getLanding()
    return dispatch({
      type: PUB_LANDING,
      payload: data
    })
  }
}

export const getProducts = () => {
  return async (dispatch) =>{
    const data = await pbProduct()
    //const data = await pepe.getProduct()
    return dispatch({
      type: PUB_PRODUCT,
      payload: data
    })
  }
}

export const getProductDetail = (id) => {
  return async (dispatch) => {
    const data = await pbProductId(id)
    //const data = await pepe.getProductByid(id)
    return dispatch({
      type: PUB_PROD_ID,
      payload: data
    })
  } 
}

export const getPubItem = (id) => {
  return async (dispatch) => {
    const data = await pbItem(id)
    //const data = await pepe.getItem(id)
    return dispatch({
      type: PUB_ITEM,
      payload: data
    })
  } 
}

export const getPubMedia = () => {
  return async (dispatch) => {
    const data = await pbMedia()
    return dispatch({
      type: PUB_MEDIA,
      payload: data
    })
  } 
}

export const getPubworks = () => {
  return async (dispatch) => {
    const data = await pbWorks()
    return dispatch({
      type: PUB_WORKS,
      payload: data
    })
  } 
}
 export const contact = (info) =>{
  return (dispatch)=> {
    return dispatch({
      type: CONTACT,
      payload:info
    })
  }
 }
export const pubClean = () => {
  return {
    type: PUB_CLEAN,
    payload: [],
  };
};
//*######## Rutas Protegidas ####################
export const getInfo = (isAdmin) => {
  return async (dispatch) => {
    try {
      const data = await axios("/api/v1/land", adminValidator(isAdmin));
      return dispatch({
        type: LANDING,
        payload: data.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};


export const getProduct = (isAdmin) => {
  return async (dispatch) => {
    try {
      const data = await axios("/api/v1/product", adminValidator(isAdmin));
      return dispatch({
        type: PRODUCT,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};

export const getProductById = (id, isAdmin) => {
  return async (dispatch) => {
    try {
      const data = await axios(
        `/api/v1/product/${id}`,
        adminValidator(isAdmin)
      );
      return dispatch({
        type: PRODUCT_BY_ID,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};
export const getItem = (id, isAdmin) => {
  return async (dispatch) => {
    try {
      const data = await axios(
        `/api/v1/product/item/${id}`,
        adminValidator(isAdmin)
      );
      return dispatch({
        type: ITEM,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};
export const getMedia = () => {
  return async (dispatch) => {
    try {
      const data = await axios(`/api/v1/media/videos`);
      return dispatch({
        type: MEDIA,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};

export const getWorks = (isAdmin) => {
  return async (dispatch) => {
    try {
      const data = await axios("/api/v1/work", adminValidator(isAdmin));
      return dispatch({
        type: WORKS,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};

export const getInfoById = (id) => {
  return async (dispatch) => {
    try {
      const data = await axios(`/api/v1/land/${id}`, setAuthHeader());
      return dispatch({
        type: LANDING_BY_ID,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};

export const getWorkById = (id) => {
  return async (dispatch) => {
    try {
      const data = await axios(`/api/v1/work/${id}`, setAuthHeader());
      return dispatch({
        type: WORK_BY_ID,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};

//*====== Variables de usuario. =======

export const getAllUsers = () => {
  return async (dispatch) => {
    try {
      const data = await axios("/api/v1/user", setAuthHeader());
      return dispatch({
        type: ALL_USERS,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
    }
  };
};
export const getUserById = (id) => async (dispatch) => {
  try {
    const data = await axios(`/api/v1/user/${id}`, setAuthHeader());
    return dispatch({
      type: USER_BY_ID,
      payload: data.data,
    });
  } catch (error) {
    HandlError(error);
  }
};
export const getStoredImgs = () => {
  return async (dispatch) => {
    try {
      const data = await axios("/api/v1/media/imgs", setAuthHeader());
      return dispatch({
        type: IMAGES,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
    }
  };
};

export const getAdminMedia = () => {
  return async (dispatch) => {
    try {
      const data = await axios(`/api/v1/media/admin/videos`, setAuthHeader());
      return dispatch({
        type: MEDIA_AD,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};
export const getMediaById = (id) => {
  return async (dispatch) => {
    try {
      const data = await axios(`/api/v1/media/videos/${id}`, setAuthHeader());
      return dispatch({
        type: MEDIA_BY_ID,
        payload: data.data,
      });
    } catch (error) {
      HandlError(error);
      console.error(error);
    }
  };
};

export const cleanState = () => {
  return {
    type: CLEAN_STATE,
    payload: [],
  };
};
