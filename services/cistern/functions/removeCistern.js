import { axiosInstance } from "../../../api/axios";

export const removeCistern = async ({ data: { id }}) => {
    try {
      const response = await axiosInstance.delete(
        `cistern/${id}`,
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao remover cisterna", error?.response);
  
      return error?.response;
    }
  };