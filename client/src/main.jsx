import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";

import App from "./App.jsx";
import "./index.css";
import reducers from "./reducers";
import { thunk } from "redux-thunk";
import { GoogleOAuthProvider } from "@react-oauth/google";

const store = createStore(reducers, compose(applyMiddleware(thunk)));

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="97930164417-3h9vlvm4eo8rh4iggepfbbtk02r85tjo.apps.googleusercontent.com">
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
