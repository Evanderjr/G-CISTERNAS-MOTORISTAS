import { axiosInstance } from "../../../api/axios";

export const registerMiddleman = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/middleman/createMiddleman", data);

    return response;
  } catch (error) {
    console.log("[debug]: erro ao registrar motorista");

    return error?.response;
  }
};
