import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import { CookiesProvider } from "react-cookie";
import ProfileProvider from "./components/ProfileProvider/ProfileProvider";
import MQTTProvider from "./components/MQTTProvider";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./components/accountReducer.ts";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: { account: accountReducer },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ProfileProvider>
        <MQTTProvider>
          <CookiesProvider>
            <App />
          </CookiesProvider>
        </MQTTProvider>
      </ProfileProvider>
    </Provider>
  </React.StrictMode>
);
