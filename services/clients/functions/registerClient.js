import { axiosInstance } from "../../../api/axios";

export const registerClient = async (data = {}) => {
  try {
    const response = await axiosInstance.post("/client/createClient", data);

    return response;
  } catch (error) {
    console.log("[debug]: erro ao registrar cliente");

    return error?.response;
  }
};
