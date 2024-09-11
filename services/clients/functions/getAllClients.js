import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { axiosInstance } from "../../../api/axios";

export const getAllClients = async () => {

  try {
    const response = await axiosInstance.get(
      "client",
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar clientes", error?.response);

    return error?.response;
  }
};