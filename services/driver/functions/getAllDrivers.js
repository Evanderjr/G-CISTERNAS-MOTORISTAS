import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { axiosInstance } from "../../../api/axios";

export const getAllDrivers = async () => {




  try {
    const response = await axiosInstance.get(
      "driver",
    );

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar motoristas", error?.response);

    return error?.response;
  }
};