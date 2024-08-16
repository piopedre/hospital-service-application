import {
  sendProductMessenger,
  resetProductMessenger,
  clearAuthentication,
  SET_VALIDATION_LOADER,
  REMOVE_VALIDATION_LOADER,
  initWardDatabase,
  initProductDatabase,
} from "../../../index";

import {
  updateDepositBalance,
  updatePatientBalance,
} from "../../../../Utility/patient/patient";
import {
  validatePrescription,
  validateQuantity,
} from "../../../../Utility/PatientServices/prescriptionValidation";
import { addReceipt } from "../../../../Utility/general/general";
import { addSale } from "../../../../Utility/sales/sales";
import { addWardRequest } from "../../../../Utility/ward/ward";
import {
  addDrugTherapyRequest,
  addOutOfStockRequest,
  getAllOsRequest,
  updateProductQuantity,
} from "../../../../Utility/product/product";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import { updateRequistionTabHandler } from "../../../../Utility/inventory/requistion";

const setLoader = () => {
  return {
    type: SET_VALIDATION_LOADER,
  };
};
const removeLoader = () => {
  return {
    type: REMOVE_VALIDATION_LOADER,
  };
};

export const prescriptionValidation = (
  prescription,
  setPrescriptionPreview
) => {
  return (dispatch) => {
    const { valid, quantity } = validatePrescription(prescription);
    if (!valid && !quantity) {
      dispatch(sendProductMessenger("No Product in prescription", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 2000);
    } else if (!quantity) {
      dispatch(
        sendProductMessenger(
          "A product On-Hand quantity is not sufficient ",
          true
        )
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 2000);
    } else if (!valid) {
      dispatch(
        sendProductMessenger("A product quantity is not sufficient ", true)
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 2000);
    } else {
      setPrescriptionPreview((prevState) => {
        return {
          ...prevState,
          openPreview: true,
        };
      });
    }
  };
};

export const addWard = (e, token, preview) => {
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.location = JSON.parse(sessionStorage.getItem("location")).id;

  return async (dispatch) => {
    dispatch(setLoader());
    try {
      const response = await addWardRequest(token, JSON.stringify(data));
      if (response?.ok) {
        e.target.reset();
        preview((prevState) => {
          return {
            ...prevState,
            addPatientModal: false,
          };
        });
        dispatch(sendProductMessenger("Ward Information Added"));
        dispatch(initWardDatabase(token));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
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
        dispatch(sendProductMessenger("Unable to add new ward", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
    }
    dispatch(removeLoader());
  };
};
export const fuccProductSale = (
  e,
  format,
  products,
  location,
  unit,
  token,
  preview,
  setProducts,
  setPreview,
  setTotalPrice,
  setNumberProducts,
  setExtraCharge,
  totalPrice,
  clinic
) => {
  e.preventDefault();
  return async (dispatch) => {
    if (preview.selectedReceipent) {
      const data = new FormData(e.target);
      const prescriptionProducts = products.map((product) => {
        product.set("quantity", +product.get("quantity"));
        product.delete("onHandQuantity");

        return Object.fromEntries(product);
      });
      const prescription = Object.create(null);
      prescription.patient = preview.selectedReceipent;
      prescription.pricing = format.pricingType;
      prescription.location = location;
      prescription.unit = unit;
      prescription.clinic = clinic;
      prescription.serviceClinic = format.clinicType;
      prescription.patientType = format.serviceType;
      prescription.products = prescriptionProducts;
      prescription.collector = data.get("collector");
      prescription.totalPrice = Math.ceil(totalPrice / 50) * 50;

      dispatch(setLoader());
      try {
        const purchaseResponse = await addSale(
          token,
          JSON.stringify(prescription)
        );
        if (purchaseResponse?.ok) {
          e.target.reset();

          // add logs
          // reset to original page and reset parameters
          prescriptionProducts.forEach(async (product) => {
            const quantity = Object.create(null);
            quantity.quantity = +product.quantity;
            const data = JSON.stringify(quantity);
            // get product actual and minus it  then  log it
            const productResponse = await updateProductQuantity(
              token,
              product.id,
              data
            );
            if (productResponse?.ok) {
              const newProduct = await productResponse.json();
              const movement = new Map();
              movement.set(
                "movement",
                `${preview.receipent?.lastName.toUpperCase()} ${preview.receipent?.firstName.toUpperCase()}`
              );
              movement.set("issued", product.quantity);
              movement.set("balance", newProduct.quantity);
              movement.set("product", product.id);
              movement.set("unit", unit);
              movement.set("location", location);
              movement.set("clinic", clinic);
              // add logs
              const movementResponse = await addProductLogs(
                token,
                JSON.stringify(Object.fromEntries(movement))
              );
              if (movementResponse?.ok) {
                movement.clear();
              } else {
                throw {
                  message: movementResponse.statusText,
                  status: movementResponse.status,
                };
              }
            } else {
              throw {
                message: productResponse.statusText,
                status: productResponse.status,
              };
            }
          });
          setProducts([]);
          setPreview((prevState) => {
            return {
              ...prevState,
              openPreview: false,
              selectedReceipent: "",
              receipent: null,
              collector: "",
            };
          });

          setTotalPrice(0);
          setNumberProducts(0);
          setExtraCharge(0);
          dispatch(initProductDatabase(token, location, unit, clinic));
          dispatch(sendProductMessenger("prescription added"));
        } else {
          throw {
            message: purchaseResponse.statusText,
            status: purchaseResponse.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("problem adding prescription", true));
        }
      }
    } else {
      dispatch(
        sendProductMessenger("Please add a receipent to add Prescription", true)
      );
    }
    dispatch(removeLoader());
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const requistionProductSale = (
  e,
  format,
  products,
  location,
  unit,
  token,
  preview,
  setProducts,
  setPreview,
  setTotalPrice,
  setNumberProducts,
  setExtraCharge,
  totalPrice,
  clinic
) => {
  e.preventDefault();

  return async (dispatch) => {
    if (preview.selectedReceipent) {
      const collectorForm = new FormData(e.target);
      const prescriptionProducts = products.map((product) => {
        product.set("quantity", +product.get("quantity"));
        product.delete("onHandQuantity");

        return Object.fromEntries(product);
      });
      const prescription = Object.create(null);
      prescription.ward = preview.selectedReceipent;
      prescription.pricing = format.pricingType;
      prescription.location = location;
      prescription.unit = unit;
      prescription.clinic = clinic;
      prescription.serviceClinic = format.clinicType;
      prescription.patientType = format.serviceType;
      prescription.products = prescriptionProducts;
      prescription.collector = collectorForm.get("collector");
      prescription.totalPrice = Math.ceil(totalPrice / 50) * 50;

      dispatch(setLoader());
      try {
        const purchaseResponse = await addSale(
          token,
          JSON.stringify(prescription)
        );
        if (purchaseResponse?.ok) {
          e.target.reset();

          // add logs
          // reset to original page and reset parameters
          prescriptionProducts.forEach(async (product) => {
            const quantity = Object.create(null);
            quantity.quantity = +product.quantity;
            const data = JSON.stringify(quantity);
            // get product actual and minus it  then  log it
            const productResponse = await updateProductQuantity(
              token,
              product.id,
              data
            );
            if (productResponse?.ok) {
              const newProduct = await productResponse.json();
              const movement = new Map();
              movement.set("movement", preview.receipent?.name.toUpperCase());
              movement.set("issued", product.quantity);
              movement.set("balance", newProduct.quantity);
              movement.set("product", product.id);
              movement.set("unit", unit);
              movement.set("location", location);
              movement.set("clinic", clinic);
              // add logs
              const movementResponse = await addProductLogs(
                token,
                JSON.stringify(Object.fromEntries(movement))
              );
              if (movementResponse?.ok) {
                movement.clear();
              } else {
                throw {
                  message: movementResponse.statusText,
                  status: movementResponse.status,
                };
              }
            } else {
              throw {
                message: productResponse.statusText,
                status: productResponse.status,
              };
            }
          });
          setProducts([]);
          setPreview((prevState) => {
            return {
              ...prevState,
              openPreview: false,
              selectedReceipent: "",
              receipent: null,
              collector: "",
            };
          });

          setTotalPrice(0);
          setNumberProducts(0);
          setExtraCharge(0);
          dispatch(initProductDatabase(token, location, unit, clinic));
          dispatch(sendProductMessenger("prescription added"));
        } else {
          throw {
            message: purchaseResponse.statusText,
            status: purchaseResponse.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("problem adding prescription", true));
        }
      }
    } else {
      dispatch(
        sendProductMessenger("Please add a receipent to add Prescription", true)
      );
    }
    dispatch(removeLoader());
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const inpatientProductSale = (
  format,
  products,
  location,
  unit,
  token,
  preview,
  totalPrice,
  setProducts,
  setPreview,
  setTotalPrice,
  setNumberProducts,
  setExtraCharge,
  clinic
) => {
  const patientData = {
    totalPrice: Math.ceil(totalPrice / 50) * 50,
  };
  const prescriptionProducts = products.map((product) => {
    product.set("quantity", +product.get("quantity"));
    product.delete("onHandQuantity");
    return Object.fromEntries(product);
  });
  const prescription = Object.create(null);
  prescription.patient = preview.selectedReceipent;
  prescription.pricing = format.pricingType;
  prescription.location = location;
  prescription.unit = unit;
  prescription.clinic = clinic;
  prescription.serviceClinic = format.clinicType;
  prescription.patientType = format.serviceType;
  prescription.products = prescriptionProducts;
  prescription.totalPrice = Math.ceil(totalPrice / 50) * 50;
  prescription.collector = preview.collector;
  return async (dispatch) => {
    if (!preview.collector) {
      dispatch(
        sendProductMessenger(
          "Please kindly input the name of the collector",
          true
        )
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 4000);
      return;
    }
    if (preview.selectedReceipent) {
      dispatch(setLoader());
      try {
        const response = await updatePatientBalance(
          token,
          preview.selectedReceipent,
          JSON.stringify(patientData)
        );
        if (response?.ok) {
          const purchaseResponse = await addSale(
            token,
            JSON.stringify(prescription)
          );
          if (purchaseResponse?.ok) {
            // add logs
            // reset to original page and reset parameters
            prescriptionProducts.forEach(async (product) => {
              const quantity = Object.create(null);
              quantity.quantity = product.quantity;
              const data = JSON.stringify(quantity);
              // get product actual and minus it  then  log it
              const productResponse = await updateProductQuantity(
                token,
                product.id,
                data
              );
              if (productResponse?.ok) {
                const newProduct = await productResponse.json();
                const movement = new Map();
                movement.set(
                  "movement",
                  `${preview.receipent?.lastName.toUpperCase()}  ${preview.receipent?.firstName.toUpperCase()} ` ||
                    "UNREGISTERED"
                );
                movement.set("issued", product.quantity);
                movement.set("balance", newProduct.quantity);
                movement.set("product", product.id);
                movement.set("unit", unit);
                movement.set("location", location);
                movement.set("clinic", clinic);
                // add logs
                const movementResponse = await addProductLogs(
                  token,
                  JSON.stringify(Object.fromEntries(movement))
                );
                if (movementResponse?.ok) {
                  movement.clear();
                } else {
                  throw {
                    message: movementResponse.statusText,
                    status: movementResponse.status,
                  };
                }
              } else {
                throw {
                  message: productResponse.statusText,
                  status: productResponse.status,
                };
              }
            });

            // reset
            // reset preview receipent and selectedRecepient
            // reset prescription
            const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
            setProducts([]);
            setPreview((prevState) => {
              return {
                ...prevState,
                openPreview: false,
                selectedReceipent: "",
                receipent: null,
                collector: "",
              };
            });
            setTotalPrice(0);
            setNumberProducts(0);
            setExtraCharge(0);
            dispatch(initProductDatabase(token, location, unit, clinic));

            dispatch(sendProductMessenger("prescription added"));
          } else {
            throw {
              message: purchaseResponse.statusText,
              status: purchaseResponse.status,
            };
          }
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
          dispatch(sendProductMessenger("problem adding prescription", true));
        }
      }
    } else {
      dispatch(
        sendProductMessenger("Please add a receipent to add Prescription", true)
      );
    }
    dispatch(removeLoader());
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

export const productSale = (
  e,
  format,
  products,
  location,
  unit,
  token,
  preview,
  setProducts,
  setPreview,
  setTotalPrice,
  setNumberProducts,
  setExtraCharge,
  clinic,
  charge,
  totalPrice
) => {
  e.preventDefault();

  const prescriptionProducts = products.map((product) => {
    product.set("quantity", +product.get("quantity"));
    product.delete("onHandQuantity");

    return Object.fromEntries(product);
  });
  const prescription = Object.create(null);

  const receipt = JSON.stringify(
    Object.fromEntries(new FormData(e.target).entries())
  );
  // send Receipt
  return async (dispatch) => {
    if (
      Math.ceil((totalPrice + charge) / 50) * 50 !==
      +new FormData(e.target).get("amount")
    ) {
      dispatch(
        sendProductMessenger(`sumTotal and receipt amount don't tally`, true)
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }
    dispatch(setLoader());
    try {
      const response = await addReceipt(token, receipt);
      if (response?.ok) {
        const receipt = await response.json();
        if (preview.selectedReceipent) {
          prescription.patient = preview.selectedReceipent;
        }
        prescription.receipt = receipt._id;
        prescription.pricing = format.pricingType;
        prescription.location = location;
        prescription.unit = unit;
        prescription.clinic = clinic;
        prescription.serviceClinic = format.clinicType;
        prescription.patientType = format.serviceType;
        prescription.products = prescriptionProducts;
        prescription.totalPrice = +new FormData(e.target).get("amount");
        // Send Prescription
        const purchaseResponse = await addSale(
          token,
          JSON.stringify(prescription)
        );
        if (purchaseResponse?.ok) {
          e.target.reset();
          prescriptionProducts.forEach(async (product) => {
            const quantity = Object.create(null);
            quantity.quantity = product.quantity;
            const data = JSON.stringify(quantity);
            // get product actual and minus it  then  log it
            const productResponse = await updateProductQuantity(
              token,
              product.id,
              data
            );
            if (productResponse?.ok) {
              const newProduct = await productResponse.json();
              const movement = new Map();

              movement.set(
                "movement",
                preview.receipent
                  ? `${preview.receipent?.lastName.toUpperCase()} ${preview.receipent?.firstName.toUpperCase()}`
                  : "UNREGISTERED"
              );
              movement.set("issued", product.quantity);
              movement.set("balance", newProduct.quantity);
              movement.set("product", product.id);
              movement.set("unit", unit);
              movement.set("location", location);
              movement.set("clinic", clinic);
              // add logs
              const movementResponse = await addProductLogs(
                token,
                JSON.stringify(Object.fromEntries(movement))
              );
              if (movementResponse?.ok) {
                movement.clear();
              } else {
                throw {
                  message: movementResponse.statusText,
                  status: movementResponse.status,
                };
              }
            } else {
              throw {
                message: productResponse.statusText,
                status: productResponse.status,
              };
            }
          });
          const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
          // reset
          // reset preview receipent and selectedRecepient
          // reset prescription
          setProducts([]);
          setPreview((prevState) => {
            return {
              ...prevState,
              openPreview: false,
              selectedReceipent: "",
              receipent: null,
            };
          });
          setTotalPrice(0);
          setNumberProducts(0);
          setExtraCharge(0);
          dispatch(initProductDatabase(token, location, unit, clinic));
          dispatch(sendProductMessenger("prescription added"));
        } else {
          throw {
            message: purchaseResponse.statusText,
            status: purchaseResponse.status,
          };
        }
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
        dispatch(sendProductMessenger("problem adding prescription", true));
      }
    }
    dispatch(removeLoader());
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2000);
  };
};
export const addDeposit = (e, preview, setPreview, token) => {
  e.preventDefault();
  const data = JSON.stringify(
    Object.fromEntries(new FormData(e.target).entries())
  );
  return async (dispatch) => {
    dispatch(setLoader());

    try {
      const receiptResponse = await addReceipt(token, data);
      if (receiptResponse?.ok) {
        const response = await updateDepositBalance(
          token,
          preview.selectedReceipent,
          data
        );
        if (response?.ok) {
          dispatch(sendProductMessenger("deposit added successfully"));
          e.target.reset();
          setPreview((prevState) => {
            return {
              ...prevState,
              addDrugDeposit: false,
              selectedReceipent: "",
              receipent: null,
            };
          });
        } else {
          throw {
            message: response.statusText,
            status: response.status,
          };
        }
      } else {
        throw {
          message: receiptResponse.statusText,
          status: receiptResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("problem adding deposit", true));
      }
    }
    dispatch(removeLoader());
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2000);
  };
};
export const holdPrescription = (
  e,
  setProducts,
  setPreview,
  products,
  preview,
  setTotalPrice,
  setNumberProducts,
  setExtraCharge,
  format,
  extraCharge
) => {
  return (dispatch) => {
    if (e.target.innerText === "HELD") {
      if (!localStorage.getItem("heldPrescriptions")) {
        dispatch(sendProductMessenger("no prescription was held", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      } else {
        const heldPrescriptions = JSON.parse(
          localStorage.getItem("heldPrescriptions")
        );

        setPreview((prevState) => {
          return {
            ...prevState,
            heldProducts: heldPrescriptions,
            held: true,
          };
        });
      }
    } else {
      const { length, totalPrice } = updateRequistionTabHandler(products);
      const updatedProducts = products.map((product) =>
        Object.fromEntries(product)
      );

      const prescription = {
        products: updatedProducts,
        receipent: preview.receipent,
        selectedReceipent: preview.selectedReceipent,
        totalPrice: Math.ceil((totalPrice + +extraCharge) / 50) * 50,
        extraCharge,
        length,
        format,
      };
      if (localStorage.getItem("heldPrescriptions")) {
        const heldPrescriptions = JSON.parse(
          localStorage.getItem("heldPrescriptions")
        );
        heldPrescriptions.push(prescription);
        localStorage.setItem(
          "heldPrescriptions",
          JSON.stringify(heldPrescriptions)
        );
      } else {
        const heldPrescriptions = [];
        heldPrescriptions.push(prescription);
        localStorage.setItem(
          "heldPrescriptions",
          JSON.stringify(heldPrescriptions)
        );
      }
      dispatch(sendProductMessenger("prescription held"));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 2000);
      setProducts([]);
      setPreview((prevState) => {
        return {
          ...prevState,
          openPreview: false,
          selectedReceipent: "",
          receipent: null,
        };
      });
      setExtraCharge(0);
      setNumberProducts(0);
      setTotalPrice(0);
    }
  };

  // if there is a prescription add it to the hold
};
export const uploadPrescription = (
  index,
  token,
  location,
  unit,
  setProducts,
  setTotalPrice,
  setNumberProducts,
  setPreview,
  setFormat,
  setExtraCharge
) => {
  return (dispatch, getState) => {
    const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
    dispatch(initProductDatabase(token, location, unit, clinic));
    const database = JSON.parse(
      JSON.stringify([...getState().general.products.database])
    );
    // use get State to validation products quantities
    const prescriptions = JSON.parse(localStorage.getItem("heldPrescriptions"));

    const [selectedPrescription] = prescriptions.splice(index, 1);
    // remove selected Prescription
    localStorage.setItem("heldPrescriptions", JSON.stringify(prescriptions));
    // CONVERTING THE OBJECT TO MAP BASED
    const products = selectedPrescription.products.map((product) => {
      const newProduct = new Map();
      const keys = Object.keys(product);
      keys.forEach((key) => {
        newProduct.set(key, product[key]);
      });
      return newProduct;
    });
    selectedPrescription.products = products;
    setProducts(products);
    setTotalPrice(
      +selectedPrescription.totalPrice - +selectedPrescription.extraCharge
    );
    setNumberProducts(selectedPrescription.length);
    setExtraCharge(selectedPrescription.extraCharge);

    setPreview((prevState) => {
      return {
        ...prevState,
        heldPrescriptions: prescriptions,
        selectedReceipent: selectedPrescription.selectedReceipent,
        receipent: selectedPrescription.receipent,
        held: false,
      };
    });
    setFormat((prevState) => {
      return {
        ...prevState,
        ...selectedPrescription.format,
      };
    });
    // VALIDATE QUANTITY
    validateQuantity(database, setProducts);
  };
};
export const addOsMethod = (e, token, setState) => {
  e.preventDefault();
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        osModal: false,
        loading: true,
      };
    });
    try {
      const form = Object.fromEntries(new FormData(e.target).entries());
      const isLowerCase = (text) => {
        const pattern = /[a-z]/;
        return text.split("").some((char) => pattern.test(char));
      };
      if (form.name.length < 7 && !isLowerCase(form.name)) {
        dispatch(
          sendProductMessenger("drug name is too short or invalid", true)
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            osModal: true,
            loading: false,
          };
        });
        return;
      }
      const addOsResponse = await addOutOfStockRequest(
        token,
        JSON.stringify(form)
      );
      if (addOsResponse?.ok) {
        dispatch(sendProductMessenger("product added"));
        setTimeout(() => {
          dispatch(resetProductMessenger());
          dispatch(getAllOs(token, setState));
          setState((prevState) => {
            return {
              ...prevState,
              osModal: false,
              loading: false,
              osValue: "",
              firstClick: false,
            };
          });
        }, 3000);
      } else {
        throw {
          message: addOsResponse.statusText,
          status: addOsResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to add product", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      }
    }
  };
};

export const getAllOs = (token, setState, productName) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const oSReponse = await getAllOsRequest(token, { productName });
      if (oSReponse?.ok) {
        const products = await oSReponse.json();
        const prevOsProducts = [...new Set(products.map((pr) => pr.name))];
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            prevOsProducts,
          };
        });
      } else {
        throw {
          message: oSReponse.statusText,
          status: oSReponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
};

export const addDrugTherapyProblemMethod = (
  e,
  token,
  setState,
  preview,
  location,
  unit,
  clinic
) => {
  return async (dispatch) => {
    e.preventDefault();
    if (!preview.selectedReceipent) {
      dispatch(sendProductMessenger("Please select a patient", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const form = Object.fromEntries(new FormData(e.target).entries());
      form.patient = preview.selectedReceipent;
      form.clinic = clinic;
      form.unit = unit;
      form.location = location;
      const dtpResponse = await addDrugTherapyRequest(
        token,
        JSON.stringify(form)
      );
      if (dtpResponse?.ok) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            show: false,
          };
        });
        dispatch(
          sendProductMessenger("Drug therapy Problem added successfully")
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      } else {
        throw {
          message: dtpResponse.statusText,
          status: dtpResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(
          sendProductMessenger("unable to add drug therapy Problem", true)
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      }
    }
  };
};
