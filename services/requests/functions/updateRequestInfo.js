import { axiosInstance } from "../../../api/axios";

export const updateRequestInfo = async (id, data = {}) => {
    try {
        const response = await axiosInstance.post(`request/editRequest/${id}`, data);

        return response;
    } catch (error) {
        console.log("[error]: erro ao atualizar dados", error?.response);

        return error?.response;
    }
};