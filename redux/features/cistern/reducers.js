export const setForm = (state, action) => {
    state.form = { ...state.form, ...action.payload };
  };
  
  export const setCisternInfo = (state, action) => {
    state.cisternInfo = action.payload;
  };
