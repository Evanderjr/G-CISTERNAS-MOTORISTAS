export const setForm = (state, action) => {
    state.form = { ...state.form, ...action.payload };
  };
  
  export const setDriverInfo = (state, action) => {
    state.driverInfo = action.payload;
  };

