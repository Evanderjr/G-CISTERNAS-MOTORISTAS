import { axiosInstance } from "../../../api/axios";

export const removeRequest = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `request/${id}`
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao remover pedido", error?.response);
  
      return error?.response;
    }
  };