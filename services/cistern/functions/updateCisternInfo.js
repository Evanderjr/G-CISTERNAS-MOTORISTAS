import { axiosInstance } from "../../../api/axios";

export const updateCisternInfo = async (id = "", data = {}) => {
    try {
        const response = await axiosInstance.put(`cisterns/editClient/${id}`,data);

        return response;
    } catch (error) {
        console.log("[error]: erro ao atualizar dados", error?.response);

        return error?.response;
    }
};