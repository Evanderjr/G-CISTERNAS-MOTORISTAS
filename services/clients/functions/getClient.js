import { axiosInstance } from "../../../api/axios";

export const getClient = async (id) => {
  try {
    const response = await axiosInstance.post(
      "client/getById",id
    );

    console.log(response.data);

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar cliente", error?.response);

    return error?.response;
  }
};