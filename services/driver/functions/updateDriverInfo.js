import { axiosInstance } from "../../../api/axios";

export const updateDriverInfo = async (id, data = {}) => {
    
    console.log("DADOS", data);
    console.log("ID", id);
    
    try {
        const response = await axiosInstance.post(
            `driver/editDriver/${id}`, data
        );



        return response;
    } catch (error) {
        console.log("[error]: erro ao atualizar dados", error?.response);

        return error?.response;
    }
};