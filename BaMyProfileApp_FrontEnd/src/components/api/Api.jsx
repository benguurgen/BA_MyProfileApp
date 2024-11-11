import axios from "axios";
import ToastService from "../services/ToastService";
import { loadingManager } from "../Load/LoadingManager";

const api = axios.create({ baseURL: "https://localhost:7052/api/" });

const addTokenHeader = () => {
    api.defaults.headers.common["Authorization"] = `Bearer ${sessionStorage.getItem("Token") ?? localStorage.getItem("Token")}`;
}
// const addContentJson = () => { api.defaults.headers.common['Content-Type'] = 'application/json' };

export const Api = {
  async handleRequestGetAsync(requestUrl, id = 0) {
    loadingManager.show("Loading");
    try {
      // addContentJson();
      addTokenHeader();
      if (id === 0) {
        const res = await api.get(requestUrl);
        return { data: res.data, status: res.status };
      } else {
        const res = await api.get(`${requestUrl}?id=${id}`);
        return { data: res.data, status: res.status };
      }
    } catch (error) {
      let res;
      if (!error.response) res = { data: error.message, status: error.code };
      else
        res = {
          data: error.response.data.title,
          status: error.response.status,
        };
      return res;
    } finally {
      loadingManager.hide();
    }
  },
  async handleRequestPostAsync(
    requestUrl,
    requestData,
    hasToken = true,
   
  ) {
    // addContentJson();

    if (hasToken) {
      addTokenHeader();
    }
    loadingManager.show("Loading");

    try {
      const response = await api.post(requestUrl, requestData);
      return handleSuccess(response);
    } catch (error) {
      return handleErrors(error);
    } finally {
      loadingManager.hide();
    }
  },

  async handleRequestPutAsync(requestUrl, requestData) {
    addTokenHeader();
    loadingManager.show("Loading");

    try {
      const response = await api.put(requestUrl, requestData);
      return handleSuccess(response);
    } catch (error) {
      return handleErrors(error);
    } finally {
      loadingManager.hide();
    }
  },
  async handleRequestDeleteAsync(requestUrl, id) {
    addTokenHeader();
    loadingManager.show("Loading");

    try {
      const response = await api.delete(`${requestUrl}?id=${id}`);
      return handleSuccess(response);
    } catch (error) {
       return handleErrors(error);
    } finally {
      loadingManager.hide();
    }
  },

  async handleRequestPatchAsync(requestUrl, requestData) {
    try {
      addTokenHeader();
      loadingManager.show("Loading");

      const res = await api.patch(requestUrl, requestData);
      return { data: res.data, status: res.status };
    } catch (error) {
      let res;
      if (!error.response) {
        res = { data: error.message, status: error.code };
      } else {
        res = {
          data: error.response.data.title,
          status: error.response.status,
        };
      }
      return res;
    } finally {
      loadingManager.hide();
    }
  },
};
const handleErrors = (error, showErrors) => {
  if (!error.response) {
    if (showErrors) ToastService.toastError("Network error");
    return { data: null, status: null };
  }

  const { data, status } = error.response;

  if (showErrors) {
    if (data.errors) {
      const firstError = Object.keys(data.errors)[0];
      ToastService.toastWarning(data.errors[firstError][0] || data.message);
    } else {
      ToastService.toastWarning(data.message);
    }
  }

  return { 
    data, 
    status, 
    errors: data.errors || {} 
  };
};

const handleSuccess = (response) => {
  console.log(response);
  ToastService.toastSuccess(response.data.message);
  return { data: response.data, status: response.status };
};
