import { axiosInstance } from "../../../api/axios";

export const getCistern = async (id) => {
  const data = {
    "id":id
  };

    try {
      const response = await axiosInstance.post(
        "cistern/getById", data
      );

      console.log("Resposta", response);
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao listar cisterna", error?.response);
  
      return error?.response;
    }
  };