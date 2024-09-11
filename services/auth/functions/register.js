import { axiosInstance } from "../../../api/axios";

export const register = async ({
  data: {
    email = "",
    townId = "",
    lastName = "",
    telephone = "",
    firstName = "",
    birthdate = "",
  },
}) => {
  try {
    const response = await axiosInstance.post("/clients", {
      email,
      townId,
      lastName,
      telephone,
      firstName,
      birthdate,
    });

    return response;
  } catch (error) {
    console.log("[debug]: erro ao registrar cliente");

    return error?.response;
  }
};
