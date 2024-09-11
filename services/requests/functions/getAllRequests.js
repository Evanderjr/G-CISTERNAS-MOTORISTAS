import { axiosInstance } from "../../../api/axios";

export const getAllRequests = async () => {
  try {
    const response = await axiosInstance.get(
      "request",
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar pedidos", error?.response);

    return error?.response;
  }
};