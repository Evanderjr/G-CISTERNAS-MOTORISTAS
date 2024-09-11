import { axiosInstance } from "../../../api/axios";

export const registerRequest = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/request/createRequest", data);

    return response;
  } catch (error) {
    console.log("[debug]: erro ao registrar pedidos");

    return error?.response;
  }
};