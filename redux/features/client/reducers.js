export const setForm = (state, action) => {
    state.form = { ...state.form, ...action.payload };
  };
  
  export const setClientInfo = (state, action) => {
    state.clientInfo = action.payload;
  };

  export const setAllClientsInfo = (state, action) => {
    state.allClientsInfo = action.payload;
  };
