export const setForm = (state, action) => {
    state.form = { ...state.form, ...action.payload };
  };
  
  export const setRequestInfo = (state, action) => {
    state.requestInfo = action.payload;
  };