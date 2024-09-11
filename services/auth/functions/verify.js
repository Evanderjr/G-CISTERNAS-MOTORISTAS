import { axiosInstance } from "../../../api/axios";

export const verify = async ({ data: { verificationCode = "", password = "", passwordConfirm = "" }}) => {
    
  console.log(verificationCode, password, passwordConfirm);

  try {
      const response = await axiosInstance.post(
        "/auth/verify-account",
        { verificationCode, password, passwordConfirm }
      );
  
      return response;
    } catch (error) {
      console.log("[error]: erro ao verificar código", error?.response);
  
      return error?.response;
    }
  };