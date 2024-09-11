import { useDispatch, useSelector } from "react-redux";
import { loginSlice } from "../redux/features/login/loginSlice";

export const useLoginForm = () => {
  const { form } = useSelector((state) => state.login);

  const dispatch = useDispatch();

  const setForm = (data = {}) => {
    dispatch(loginSlice.actions.setForm(data));
  };

  return { form, setForm };
};
