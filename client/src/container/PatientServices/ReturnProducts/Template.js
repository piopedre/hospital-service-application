// import React, { Fragment, useCallback, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   initProductDatabase,
//   clearProductDatabaseError,
//   filteredProducts,
// } from "../../../store";
// import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
// import Spinner from "../../../components/UI/Spinner/Spinner";
// import Message from "../../../components/UI/Message/Message";
// const ReturnProducts = () => {
//   const dispatch = useDispatch();
//   const [state, setState] = useState({
//     search: "",
//     searchModal: false,
//     productList: [],
//     preview: false,
//     loading: false,
//     submitModal: false,
//   });
//   const message = useSelector((state) => state.addProduct.message);
//   const errorMessage = useSelector((state) => state.addProduct.errorMessage);
//   const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

//   const token = JSON.parse(sessionStorage.getItem("token"));
//   const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
//   const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
//   const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;

//   const products = useSelector((state) => state.editProduct.renderedProducts);
//   const productDatabase = useSelector(
//     (state) => state.general.products.database
//   );
//   const productDatabaseError = useSelector(
//     (state) => state.general.products.error
//   );
//   const productDatabaseLoader = useSelector(
//     (state) => state.general.products.loading
//   );
//   const initProductDatabaseHandler = useCallback(
//     (token, location, unit, clinic) =>
//       dispatch(initProductDatabase(token, location, unit, clinic)),
//     [dispatch]
//   );
//   const clearProductDatabaseErrorHandler = useCallback(
//     () => dispatch(clearProductDatabaseError()),
//     [dispatch]
//   );
//   const filteredProductsHandler = useCallback(
//     (event, products) => dispatch(filteredProducts(event, products)),
//     [dispatch]
//   );
//   const validateTransferHandler = useCallback(
//     (state, setState) => dispatch(validateTransfer(state, setState)),
//     [dispatch]
//   );
//   useEffect(() => {
//     initProductDatabaseHandler(token, $location, unit, clinic);
//   }, []);
//   return (
//     <Fragment>
//       <Message
//         message={message}
//         error={errorMessage}
//       />
//       {!isAuthenticated && !token && (
//         <Navigate
//           replace
//           to='/pharma-app/login'
//         />
//       )}
//       {productDatabaseError.message && (
//         <ErrorHandler
//           error={productDatabaseError.message}
//           status={productDatabaseError.status}
//           clearError={clearProductDatabaseErrorHandler}
//         />
//       )}
//       {productDatabaseLoader || state.loading ? (
//         <Spinner />
//       ) : state.preview ? (
//         <MainPreview
//           state={state}
//           productList={state.productList}
//           setState={setState}
//         />
//       ) : (
//         <ProductContainer
//           state={state}
//           setState={setState}
//           productList={state.productList}
//           filterMethod={filteredProductsHandler}
//           products={productDatabase}
//           filteredProducts={products}
//           searchModal={state.searchModal}
//           addToProductList={addToProductListHandler}
//           updateProductItem={updateProductItem}
//           deleteItem={deleteProductItem}
//           validateTransfer={validateTransferHandler}
//         />
//       )}
//     </Fragment>
//   );
// };

// export default ReturnProducts;
