export const setForm = (state, action) => {
    state.form = { ...state.form, ...action.payload };
  };
  
  export const setPaymentInfo = (state, action) => {
    state.paymentInfo = action.payload;
  };
