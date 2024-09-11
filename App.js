import * as React from "react";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import { RootRouter } from "./routes";

function MyApp() {
  return (
    <Provider store={store}>
      <RootRouter />
    </Provider>
  );
}

export default MyApp;
