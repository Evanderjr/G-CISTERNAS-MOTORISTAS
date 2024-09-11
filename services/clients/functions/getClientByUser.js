import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { axiosInstance } from "../../../api/axios";

export const getClientByUser = async (id_user) => {

  try {
    const response = await axiosInstance.get(
      "client",
    );

    response.data.forEach(function (client) {
        if(client.id_user ==  id_user)
        {
            console.log(client);
        }
    });

    return response;
  } catch (error) {
    console.log("[error]: erro ao listar clientes", error?.response);

    return error?.response;
  }
};