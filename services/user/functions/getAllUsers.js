import { axiosInstance } from "../../../api/axios";

export const getAllUsers = async () => {

  try {
    const response = await axiosInstance.get(
      "user",
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar os usuários", error?.response);

    return error?.response;
  }
};