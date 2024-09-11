import { axiosInstance } from "../../../api/axios";

export const updateUserInfo = async (id = "", data = {}) => {
    try {
        const response = await axiosInstance.post(
            `user/editUser/${id}`, data
        );
        return response;
    } catch (error) {
        console.log("[error]: erro ao atualizar dados", error?.response);

        return error?.response;
    }
};