import { axiosInstance } from "../../../api/axios";

export const getDriver = async (data={}) => {
    try {
      const response = await axiosInstance.post(
        "driver/getById",data
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao listar motorista", error?.response);
  
      return error?.response;
    }
  };