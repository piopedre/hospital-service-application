import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
// Reducers
import dashboard from "./store/reducers/dashboard/dashboardReducer";
import navigation from "./store/reducers/navigation/navigationReducer";
import clinicNavigation from "./store/reducers/navigation/clinicals/clinicalNavigationReducer";
import storeNavigation from "./store/reducers/storeNavigation/storeNavigationReducer";
import institution from "./store/reducers/institutionNavigation/institutionNavigationReducer";
import login from "./store/reducers/auth/loginReducer";
import addProduct from "./store/reducers/inventory/addProduct/addProductReducer";
import general from "./store/reducers/general/generalReducer";
import editProduct from "./store/reducers/inventory/addProduct/editProductReducer";
import productLog from "./store/reducers/inventory/addProduct/productLogReducer";
import deleteProduct from "./store/reducers/inventory/addProduct/deleteProductReducer";
import register from "./store/reducers/auth/registerReducer";
import requistion from "./store/reducers/inventory/requistion/requistionReducer";
import prescriptionValidation from "./store/reducers/prescriptionValidation/prescriptionValidationReducer";
import messenger from "./store/reducers/messenger/messengerReducer";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    dashboard,
    navigation,
    storeNavigation,
    institution,
    login,
    addProduct,
    general,
    editProduct,
    productLog,
    deleteProduct,
    register,
    requistion,
    prescriptionValidation,
    messenger,
    clinicNavigation,
  },
});
console.log("userlogs,check nhiaPrice for productsales");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
