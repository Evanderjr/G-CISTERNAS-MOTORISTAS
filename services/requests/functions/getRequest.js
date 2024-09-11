import { axiosInstance } from "../../../api/axios";

export const getRequest = async (data={}) => {
    try {
      const response = await axiosInstance.post(
        `request/getById`, data
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao listar pedido", error?.response);
  
      return error?.response;
    }
  };