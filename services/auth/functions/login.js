import { axiosInstance } from "../../../api/axios";

export const login = async (data = {}) => {
  try {

    console.log(data);

    const response = await axiosInstance.post(
      "user/login",
      data
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao fazer login", error?.response);

    return error?.response;
  }
};
