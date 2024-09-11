import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { axiosInstance } from "../../../api/axios";

export const getAllMiddleman = async () => {

  try {
    const response = await axiosInstance.get(
      "middleman",
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar intermediarios", error?.response);

    return error?.response;
  }
};