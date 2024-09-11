import { axiosInstance } from "../../../api/axios";

export const getAllCisterns = async () => {
  try {
    const response = await axiosInstance.get(
      "cistern",
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar cisternas", error?.response);

    return error?.response;
  }
};