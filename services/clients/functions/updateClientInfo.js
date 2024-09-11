import { axiosInstance } from "../../../api/axios";

export const updateClientInfo = async (id, data = {}) => {
    try {
        console.log("atualizar o id", id);
        console.log("atualizar os dados", data);
        const response = await axiosInstance.post(
            `client/editClient/${id}`, data
        );
        return response;
    } catch (error) {
        console.log("[error]: erro ao atualizar dados", error?.response);

        return error?.response;
    }
};