export const increment = (state) => {
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  state.value += 1;
};

export const decrement = (state) => {
  state.value -= 1;
};

export const incrementByAmount = (state, action) => {
  state.value += action.payload;
};
