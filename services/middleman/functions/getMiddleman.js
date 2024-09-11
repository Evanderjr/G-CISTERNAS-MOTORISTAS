import { axiosInstance } from "../../../api/axios";

export const getMiddleman = async (data={}) => {
    try {
      const response = await axiosInstance.post(
        "middleman/getById",data
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao listar intermediario", error?.response);
  
      return error?.response;
    }
  };