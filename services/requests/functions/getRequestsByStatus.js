import { axiosInstance } from "../../../api/axios";

export const getRequestByStatus = async (data={}) => {
    try {
      const response = await axiosInstance.post(
        `request/getAllByStatus`, data
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao listar pedido", error?.response);
  
      return error?.response;
    }
  };