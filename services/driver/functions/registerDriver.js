import { axiosInstance } from "../../../api/axios";

export const registerDriver = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/driver/createDriver", data);

    return response;
  } catch (error) {
    console.log("[debug]: erro ao registrar motorista");

    return error?.response;
  }
};
