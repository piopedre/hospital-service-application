import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import {
  addProductQuantity,
  editProductById,
  updateProductQuantity,
} from "../../../../Utility/product/product";
import {
  addSupplierRequest,
  addSupplyRequest,
  getSuppliersRequest,
} from "../../../../Utility/storeServices/storeServices";
import { clearAuthentication } from "../auth/loginAction";
import { initProductDatabase } from "../general/generalAction";
import {
  sendProductMessenger,
  resetProductMessenger,
} from "../inventory/addProductAction";
import { validateReceivedItems } from "../../../../Utility/receivedProducts/receivedProducts";
export const getSuppliersMethod = (token, setState) => {
  return async (dispatch) => {
    try {
      const response = await getSuppliersRequest(token);
      if (response?.ok) {
        const suppliers = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            selectedSupplier: suppliers[0]._id,
            suppliers,
          };
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            suppliers: [],
          };
        });
        dispatch(sendProductMessenger("Supplier Database is empty", true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const addSupplier = (e, token, setState) => {
  e.preventDefault();
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        addSupplierLoading: true,
      };
    });
    try {
      const formData = Object.fromEntries(new FormData(e.target).entries());
      const response = await addSupplierRequest(
        token,
        JSON.stringify(formData)
      );
      if (response?.ok) {
        dispatch(sendProductMessenger("Supplier Added"));
        e.target.reset();
        dispatch(getSuppliersMethod(token, setState));
        setState((prevState) => {
          return {
            ...prevState,
            addSupplierLoading: false,
            addSupplier: false,
          };
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            addSupplierLoading: false,
          };
        });
        dispatch(sendProductMessenger(error.message, true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

export const receiveProductsMethod = (
  token,
  setState,
  state,
  unit,
  location,
  clinic
) => {
  const receivedItems = [...state.receivedItems];
  return async (dispatch) => {
    const valid = receivedItems.every(
      (item) =>
        +item.get("costPrice") &&
        +item.get("quantity") &&
        item.get("expiryDate")
    );

    if (valid && receivedItems.length) {
      const supplier = JSON.parse(JSON.stringify(state.selectedSupplier));

      if (supplier && state.suppliers.length) {
        setState((prevState) => {
          return {
            ...prevState,
            receiveProductsLoading: true,
          };
        });
        try {
          const supply = Object.create(null);

          supply.products = receivedItems.map((item) =>
            Object.fromEntries(item)
          );
          supply.supplier = supplier;
          supply.location = location;
          supply.unit = unit;
          supply.clinic = clinic;

          // add supply to database
          // send to database
          const supplyResponse = await addSupplyRequest(
            token,
            JSON.stringify(supply)
          );
          if (supplyResponse?.ok) {
            // then add to quantity
            supply.products.forEach(async (product) => {
              try {
                const addQuantityResponse = await addProductQuantity(
                  token,
                  product.id,
                  JSON.stringify({ quantity: +product.quantity })
                );
                if (addQuantityResponse?.ok) {
                  const newProduct = await addQuantityResponse.json();
                  // update Price, update expiryDate
                  // if the new date is lower than the old date or the quantity is 0 or lower
                  const newProductDate = new Date(product.expiryDate).getTime();
                  const oldProductDate = new Date(
                    Date.parse(newProduct.expiryDate)
                  ).getTime();
                  if (
                    product.onHandQty <= 0 ||
                    newProductDate < oldProductDate
                  ) {
                    const productResponse = await editProductById(
                      token,
                      product.id,
                      JSON.stringify({
                        costPrice: +product.costPrice,
                        expiryDate: product.expiryDate,
                      })
                    );
                    if (!productResponse?.ok) {
                      throw {
                        message: productResponse.statusText,
                        status: productResponse.status,
                      };
                    }
                  } else {
                    if (+product.costPrice !== newProduct.costPrice) {
                      const productResponse = await editProductById(
                        token,
                        product.id,
                        JSON.stringify({
                          costPrice: +product.costPrice,
                        })
                      );
                      if (!productResponse?.ok) {
                        throw {
                          message: productResponse.statusText,
                          status: productResponse.status,
                        };
                      }
                    }
                  }
                  // addProductLogs
                  const movementResponse = Object.create(null);
                  const movement = state.suppliers.find(
                    (supp) => supp._id === supplier
                  );
                  movementResponse.movement = movement.name;
                  movementResponse.received = +product.quantity;
                  movementResponse.balance = newProduct.quantity;
                  movementResponse.product = newProduct._id;
                  movementResponse.location = location;
                  movementResponse.unit = unit;
                  movementResponse.clinic = clinic;
                  const productLogResponse = await addProductLogs(
                    token,
                    JSON.stringify(movementResponse)
                  );

                  if (productLogResponse?.ok) {
                    // check if last item
                    Object.keys(movementResponse).forEach(
                      (key) => delete movementResponse[key]
                    );
                    dispatch(
                      initProductDatabase(token, location, unit, clinic)
                    );
                  } else {
                    throw {
                      message: productLogResponse.statusText,
                      status: productLogResponse.status,
                    };
                  }
                } else {
                  throw {
                    message: addQuantityResponse.statusText,
                    status: addQuantityResponse.status,
                  };
                }
              } catch (error) {
                if (error.status === 401) {
                  dispatch(clearAuthentication(error.status));
                } else {
                  dispatch(sendProductMessenger(`unable to add supply`, true));
                }
              }
            });

            dispatch(sendProductMessenger(`supply has been saved`));
            // reset process
            setState((prevState) => {
              return {
                ...prevState,
                receiveProductsLoading: false,
                receivedItems: [],
                addModal: false,
              };
            });

            Object.keys(supply).forEach((key) => delete supply[key]);
          } else {
            throw {
              message: supplyResponse.statusText,
              status: supplyResponse.status,
            };
          }
        } catch (error) {
          if (error.status === 401) {
            dispatch(clearAuthentication(error.status));
          } else {
            setState((prevState) => {
              return {
                ...prevState,
                receiveProductsLoading: false,
              };
            });
            dispatch(sendProductMessenger(`unable to add supply`, true));
          }
        }
      } else {
        dispatch(sendProductMessenger(`supplier is not selected `, true));
      }
    } else if (!receivedItems.length) {
      dispatch(
        sendProductMessenger(`no product is currently been supplied`, true)
      );
    } else {
      dispatch(
        sendProductMessenger(
          `a product has an invalid expiry date or cost price or quantity`,
          true
        )
      );
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

export const exchangeProductsMethod = (
  token,
  setState,
  state,
  unit,
  location,
  clinic
) => {
  const receivedItems = [...state.receivedItems];
  return async (dispatch) => {
    const valid = receivedItems.every(
      (item) =>
        +item.get("costPrice") &&
        +item.get("quantity") &&
        item.get("expiryDate")
    );

    if (valid && receivedItems.length) {
      // const supplier = structuredClone(state.selectedSupplier);
      const supplier = JSON.parse(JSON.stringify(state.selectedSupplier));

      if (supplier && state.suppliers.length) {
        setState((prevState) => {
          return {
            ...prevState,
            receiveProductsLoading: true,
          };
        });
        try {
          const supply = Object.create(null);

          supply.products = receivedItems.map((item) =>
            Object.fromEntries(item)
          );

          supply.supplier = supplier;
          supply.location = location;
          supply.unit = unit;
          supply.clinic = clinic;
          supply.exchange = true;

          // add supply to database
          // send to database
          const supplyResponse = await addSupplyRequest(
            token,
            JSON.stringify(supply)
          );
          if (supplyResponse?.ok) {
            // then add to quantity
            supply.products.forEach(async (product) => {
              try {
                const quantityResponse = await updateProductQuantity(
                  token,
                  product.id,
                  JSON.stringify({ quantity: +product.quantity })
                );
                if (quantityResponse?.ok) {
                  const newProduct = await quantityResponse.json();
                  // addProductLogs
                  const movementResponse = Object.create(null);
                  const movement = state.suppliers.find(
                    (supp) => supp._id === supplier
                  );
                  movementResponse.movement = movement.name;
                  movementResponse.issued = +product.quantity;
                  movementResponse.balance = newProduct.quantity;
                  movementResponse.product = newProduct._id;
                  movementResponse.location = location;
                  movementResponse.unit = unit;
                  movementResponse.clinic = clinic;
                  const productLogResponse = await addProductLogs(
                    token,
                    JSON.stringify(movementResponse)
                  );

                  if (productLogResponse?.ok) {
                    // check if last item
                    Object.keys(movementResponse).forEach(
                      (key) => delete movementResponse[key]
                    );
                    dispatch(
                      initProductDatabase(token, location, unit, clinic)
                    );
                  } else {
                    throw {
                      message: productLogResponse.statusText,
                      status: productLogResponse.status,
                    };
                  }
                } else {
                  throw {
                    message: quantityResponse.statusText,
                    status: quantityResponse.status,
                  };
                }
              } catch (error) {
                if (error.status === 401) {
                  dispatch(clearAuthentication(error.status));
                } else {
                  dispatch(
                    sendProductMessenger(`unable to exchange Products`, true)
                  );
                }
              }
            });

            dispatch(sendProductMessenger(`exchange has been saved`));
            // reset process
            setState((prevState) => {
              return {
                ...prevState,
                receiveProductsLoading: false,
                receivedItems: [],
                addModal: false,
              };
            });

            Object.keys(supply).forEach((key) => delete supply[key]);
          } else {
            throw {
              message: supplyResponse.statusText,
              status: supplyResponse.status,
            };
          }
        } catch (error) {
          if (error.status === 401) {
            dispatch(clearAuthentication(error.status));
          } else {
            setState((prevState) => {
              return {
                ...prevState,
                receiveProductsLoading: false,
              };
            });
            dispatch(sendProductMessenger(`unable to exchange products`, true));
          }
        }
      } else {
        dispatch(sendProductMessenger(`supplier is not selected `, true));
      }
    } else if (!receivedItems.length) {
      dispatch(
        sendProductMessenger(`no product is currently been exchanged`, true)
      );
    } else {
      dispatch(
        sendProductMessenger(
          `a product has an invalid expiry date or cost price or quantity`,
          true
        )
      );
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const holdReceiveProducts = (e, state, setState) => {
  return (dispatch) => {
    if (e.target.innerText === "HELD") {
      if (!sessionStorage.getItem("heldReceivedItems")) {
        dispatch(sendProductMessenger("no Items held", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      } else {
        const heldReceivedItems = JSON.parse(
          sessionStorage.getItem("heldReceivedItems")
        );

        setState((prevState) => {
          return {
            ...prevState,
            heldProducts: heldReceivedItems,
            hold: true,
          };
        });
      }
    } else {
      const updatedProducts = state.receivedItems.map((product) =>
        Object.fromEntries(product)
      );
      const supplier = state.suppliers.find(
        (su) => su._id === state.selectedSupplier
      );

      const received = {
        products: updatedProducts,
        supplier,
      };
      if (sessionStorage.getItem("heldReceivedItems")) {
        const heldReceivedItems = JSON.parse(
          sessionStorage.getItem("heldReceivedItems")
        );
        heldReceivedItems.push(received);
        sessionStorage.setItem(
          "heldReceivedItems",
          JSON.stringify(heldReceivedItems)
        );
      } else {
        const heldReceivedItems = [];
        heldReceivedItems.push(received);
        sessionStorage.setItem(
          "heldReceivedItems",
          JSON.stringify(heldReceivedItems)
        );
      }
      setState((prevState) => {
        return {
          ...prevState,
          receivedItems: [],
        };
      });
    }
  };
};
export const uploadReceivedItem = (
  index,
  token,
  location,
  unit,
  clinic,
  setState
) => {
  return (dispatch, getState) => {
    // const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
    dispatch(initProductDatabase(token, location, unit, clinic));
    const database = JSON.parse(
      JSON.stringify([...getState().general.products.database])
    );
    // use get State to validation products quantities
    const heldReceivedItems = JSON.parse(
      sessionStorage.getItem("heldReceivedItems")
    );

    const [receivedItem] = heldReceivedItems.splice(index, 1);
    // remove selected Prescription
    sessionStorage.setItem(
      "heldReceivedItems",
      JSON.stringify(heldReceivedItems)
    );
    // CONVERTING THE OBJECT TO MAP BASED
    const products = receivedItem.products.map((product) => {
      const newProduct = new Map();
      const keys = Object.keys(product);
      keys.forEach((key) => {
        newProduct.set(key, product[key]);
      });
      return newProduct;
    });
    receivedItem.products = products;
    setState((prevState) => {
      return {
        ...prevState,
        receivedItems: products,
        selectedSupplier: receivedItem.supplier._id,
        hold: false,
      };
    });
    // VALIDATE QUANTITY
    validateReceivedItems(database, setState);
  };
};
