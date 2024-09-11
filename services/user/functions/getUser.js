import { axiosInstance } from "../../../api/axios";

export const getUser = async (data={}) => {
    try{
        const response = await axiosInstance.post(
            "user/getById", data
        );

        console.log("RESPOSTA", response.data);

        return response;
    }catch(error)
    {
        console.log("[error]: erro ao listar usuario", error?.response);
  
        return error?.response;
    }
}