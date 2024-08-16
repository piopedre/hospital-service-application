import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import HeldProducts from "../../../components/HeldProducts/HeldProducts";
import PrescriptionFormat from "../../../components/PrescriptionFormat/PrescriptionFormat";
import PrescriptionPreview from "../../../components/PrescriptionPreview/PrescriptionPreview";
import SearchRender from "../../../components/SearchRender/SearchRender";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./PrescriptionValidation.module.css";
import PrescriptionItems from "../../../components/PrescriptionItems/PrescriptionItems";
import OutOfStockComponent from "../../../components/OutOfStockComponent/OutOfStockComponent";
import DrugTherapyProblemsComponent from "../../../components/DrugTherapyProblemsComponent/DrugTherapyProblemsComponent";
import {
  setPrescriptionFormat,
  deleteProductItem,
  filteredItems,
  addPrescriptionItem,
  updatePrescriptionPrice,
  updatePrescriptionQuantity,
  receipentSearchHandler,
  setReceipentHandler,
  removeReceipentHandler,
} from "../../../Utility/PatientServices/prescriptionValidation";

import { useSelector, useDispatch } from "react-redux";
import {
  initProductDatabase,
  clearProductDatabaseError,
  prescriptionValidation,
  initPatientDatabase,
  initWardDatabase,
  productSale,
  inpatientProductSale,
  requistionProductSale,
  addDeposit,
  addWard,
  holdPrescription,
  uploadPrescription,
  getAllOs,
  addOsMethod,
  addDrugTherapyProblemMethod,
  clearMessage,
  sendMessage,
  fuccProductSale,
} from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const PrescriptionValidation = (props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const patientRef = useRef(null);
  const osRef = useRef(null);
  const [format, setFormat] = useState({
    clinicType: "PSYCHIATRY",
    serviceType: "OUT-PATIENT",
    pricingType: "NORMAL",
  });
  const [prescriptionPreview, setPrescriptionPreview] = useState({
    // change this
    openPreview: false,
    changedReceipent: false,
    addPatientModal: false,
    previewSearchRender: false,
    selectedReceipent: "",
    receipent: null,
    addDeposit: false,
    patientSearch: "",
    filteredItems: [],
    held: false,
    heldProducts: [],
    collector: "",
  });
  // CHECK RECEIPT AND COST PRICE ARE SAME Start Here
  const [prescription, setPrescription] = useState([]);
  const [os, setOs] = useState({
    loading: false,
    osModal: false,
    osRender: false,
    osType: "",
    osValue: "",
    products: [],
    prevOsProducts: [],
    firstClick: false,
  });
  const [dtp, setDtp] = useState({
    loading: false,
    show: false,
  });
  const [numberProducts, setNumberProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [extraCharge, setExtraCharge] = useState(0);
  const [search, setSearch] = useState("");
  const [searchRender, setSearchRender] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const wardDatabase = useSelector((state) => state.general.wards.database);
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const produtDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const validationLoader = useSelector(
    (state) => state.prescriptionValidation.loading
  );
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const addDrugTherapyProblemMethodHandler = useCallback(
    (e, token, setState, preview, location, unit, clinic) =>
      dispatch(
        addDrugTherapyProblemMethod(
          e,
          token,
          setState,
          preview,
          location,
          unit,
          clinic
        )
      ),
    [dispatch]
  );
  const initPatientDatabaseHandler = useCallback(
    (token, search, setState) =>
      dispatch(initPatientDatabase(token, search, setState)),
    [dispatch]
  );
  const initWardDatabaseHandler = useCallback(
    (token) => dispatch(initWardDatabase(token)),
    [dispatch]
  );
  const addDrugDepositHandler = useCallback(
    (e, preview, setPreview, token) =>
      dispatch(addDeposit(e, preview, setPreview, token)),
    [dispatch]
  );
  const addOsMethodHandler = useCallback(
    (e, token, setState) => dispatch(addOsMethod(e, token, setState)),
    [dispatch]
  );
  const productSaleHandler = useCallback(
    (
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
      extraCharge,
      totalPrice
    ) =>
      dispatch(
        productSale(
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
          extraCharge,
          totalPrice
        )
      ),
    [dispatch]
  );
  const requistionProductSaleHandler = useCallback(
    (
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
    ) =>
      dispatch(
        requistionProductSale(
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
        )
      ),
    [dispatch]
  );
  const fuccProductSaleHandler = useCallback(
    (
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
    ) =>
      dispatch(
        fuccProductSale(
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
        )
      ),
    [dispatch]
  );
  const inPatientProductSaleHandler = useCallback(
    (
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
    ) =>
      dispatch(
        inpatientProductSale(
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
        )
      ),
    [dispatch]
  );
  const holdPrescriptionHandler = useCallback(
    (
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
    ) =>
      dispatch(
        holdPrescription(
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
        )
      )
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const addWardHandler = useCallback(
    (data, token, preview) => dispatch(addWard(data, token, preview)),
    [dispatch]
  );
  const getOsHandler = useCallback(
    (token, setState, productName) =>
      dispatch(getAllOs(token, setState, productName)),
    [dispatch]
  );
  const prescriptionValidationHandler = useCallback(
    (prescription, setPrescriptionPreview) =>
      dispatch(prescriptionValidation(prescription, setPrescriptionPreview)),
    [dispatch]
  );
  const uploadPrescriptionHandler = useCallback(
    (
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
    ) =>
      dispatch(
        uploadPrescription(
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
        )
      ),
    [dispatch]
  );
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const { patientSearch } = prescriptionPreview;
  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
    initWardDatabaseHandler(token);
  }, [initProductDatabaseHandler, token, $location, unit, clinic]);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (patientSearch === patientRef?.current?.value) {
        // send Patients Request //

        initPatientDatabaseHandler(
          token,
          patientSearch,
          setPrescriptionPreview
        );
      } else {
        clearTimeout(timer);
      }
    }, 500);
  }, [patientSearch, patientRef]);
  const { osValue, firstClick } = os;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (osValue === osRef?.current?.value) {
        if (!firstClick) {
          // send OS Request //
          getOsHandler(token, setOs, osValue);
          // DELETE CATEGORY NEXT
        }
      } else {
        clearTimeout(timer);
      }
    }, 1000);
  }, [osValue, osRef]);

  return (
    <div className={classes.prescriptionValidation}>
      <ChatMessenger message={mainMessage} />
      <Message
        message={message}
        error={errorMessage}
      />

      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      {/* OUT OF STOCK */}
      <OutOfStockComponent
        closed={() => {
          setOs((prevState) => {
            return {
              ...prevState,
              osModal: false,
              osRender: false,
              osValue: "",
            };
          });
        }}
        addOs={addOsMethodHandler}
        token={token}
        setState={setOs}
        state={os}
        osRef={osRef}
      />
      {/* DTP */}
      <DrugTherapyProblemsComponent
        state={dtp}
        setState={setDtp}
        preview={prescriptionPreview}
        token={token}
        clinic={clinic}
        location={$location}
        unit={unit}
        closed={() =>
          setDtp((prevState) => {
            return {
              ...prevState,
              show: false,
            };
          })
        }
        addDtp={addDrugTherapyProblemMethodHandler}
      />
      {/* for held Prescriptions */}
      <Modal
        show={prescriptionPreview.held}
        modalClosed={() => {
          setPrescriptionPreview((prevState) => {
            return {
              ...prevState,
              held: false,
            };
          });
        }}
      >
        <HeldProducts
          heldProducts={prescriptionPreview.heldProducts}
          uploadPrescription={uploadPrescriptionHandler}
          setProducts={setPrescription}
          setTotalPrice={setTotalPrice}
          setNumberProducts={setNumberProducts}
          setPreview={setPrescriptionPreview}
          setFormat={setFormat}
          setExtraCharge={setExtraCharge}
        />
      </Modal>

      {/* prescription format */}
      <Modal
        show={prescriptionModal}
        modalClosed={() => {
          setPrescriptionModal(false);
        }}
      >
        <PrescriptionFormat
          format={format}
          setPrescriptionFormat={setPrescriptionFormat}
          modal={setPrescriptionModal}
          setFormat={setFormat}
          updatePrescriptionPrice={updatePrescriptionPrice}
          setPrescription={setPrescription}
          setNumber={setNumberProducts}
          setTotalPrice={setTotalPrice}
          products={productDatabase}
          setPreview={setPrescriptionPreview}
        />
      </Modal>
      {produtDatabaseLoader ? (
        <Spinner />
      ) : prescriptionPreview.openPreview ? (
        <PrescriptionPreview
          format={format}
          clinic={clinic}
          patientRef={patientRef}
          setPrescriptionPreview={setPrescriptionPreview}
          prescriptionPreview={prescriptionPreview}
          prescription={prescription}
          setPrescription={setPrescription}
          receipentSearch={receipentSearchHandler}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          extraCharge={extraCharge}
          setExtraCharge={setExtraCharge}
          setNumberProducts={setNumberProducts}
          wardDatabase={wardDatabase}
          productSaleHandler={productSaleHandler}
          inPatientProductSale={inPatientProductSaleHandler}
          requistionProductSale={requistionProductSaleHandler}
          fuccProductSale={fuccProductSaleHandler}
          setReceipent={setReceipentHandler}
          removeReceipent={removeReceipentHandler}
          addWard={addWardHandler}
          loader={validationLoader}
          addDrugDeposit={addDrugDepositHandler}
          dtp={setDtp}
        />
      ) : (
        <React.Fragment>
          <div className={classes.productSearch}>
            <Input
              config={{
                type: "search",
                placeholder: "SEARCH THE NAME OF PRODUCT",
                value: search,
                autoFocus: true,
              }}
              changed={(e) => {
                setSearch(e.target.value);
                filteredItems(
                  e,
                  productDatabase,
                  setSearchRender,
                  setFilteredProducts
                );
              }}
            />
          </div>
          <div className={classes.setButtons}>
            <Button
              changed={setPrescriptionModal}
              config={{
                className: classes.confirm,
              }}
            >
              SET FORMAT
            </Button>

            <Button
              config={{
                className: classes.confirm,
              }}
              changed={() =>
                setOs((prevState) => {
                  return {
                    ...prevState,
                    osModal: true,
                  };
                })
              }
            >
              ADD O/S
            </Button>
          </div>

          {searchRender && (
            <SearchRender
              setPrescription={setPrescription}
              filteredProducts={filteredProducts}
              addPrescriptionItem={addPrescriptionItem}
              products={productDatabase}
              setSearchRender={setSearchRender}
              setTotalPrice={setTotalPrice}
              setNumberProducts={setNumberProducts}
              pricing={format.pricingType}
              setSearch={setSearch}
            />
          )}
          {/* Add Patient or OS or DTPs */}
          <div className={classes.prescription}>
            <h4 className={classes.title}>PRESCRIPTION</h4>
            <div
              className={[
                classes.productStructure,
                classes.prescriptionHeadings,
              ].join(" ")}
            >
              <div>PRODUCT NAME</div>
              <div>QTY</div>
              <div>PRICE</div>
              <div>SUM TOTAL</div>
            </div>
            <div className={classes.prescriptionList}>
              {
                <PrescriptionItems
                  prescription={prescription}
                  classes={classes}
                  updatePrescriptionQuantity={updatePrescriptionQuantity}
                  setPrescription={setPrescription}
                  setTotalPrice={setTotalPrice}
                  setNumberProducts={setNumberProducts}
                  deleteProductItem={deleteProductItem}
                  pricing={format.pricingType}
                />
              }
            </div>
            <div className={classes.interaction}>
              <div className={classes.requistionInformation}>
                <div>Number of Products</div>
                <div>{numberProducts}</div>
              </div>
              <div className={classes.requistionInformation}>
                <div>Extra Charge</div>
                <input
                  value={extraCharge}
                  min={0}
                  onChange={(e) => {
                    if (e.target.value.match(/^[0-9]+$/)) {
                      setExtraCharge(+e.target.value);
                    } else {
                      setExtraCharge(0);
                    }
                  }}
                  style={{
                    width: "100px",
                    backgroundColor: "transparent",
                    outline: "none",
                    border: "none",
                    textAlign: "right",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </div>
              <div className={classes.requistionInformation}>
                <div>TOTAL</div>
                <div
                  style={{
                    letterSpacing: "2px",
                  }}
                >
                  ₦
                  {Intl.NumberFormat("en-GB").format(
                    Math.ceil((totalPrice + +extraCharge) / 50) * 50
                  )}
                </div>
              </div>
            </div>
            <div>
              <Button
                config={{
                  className: classes.hold,
                  style: {
                    margin: "5px",
                  },
                }}
                changed={(e) => {
                  holdPrescriptionHandler(
                    e,
                    setPrescription,
                    setPrescriptionPreview,
                    prescription,
                    prescriptionPreview,
                    setTotalPrice,
                    setNumberProducts,
                    setExtraCharge,
                    format,
                    extraCharge
                  );
                }}
              >
                {prescription.length ? "HOLD" : "HELD"}
              </Button>
              <Button
                config={{
                  className: classes.confirm,
                  style: {
                    margin: "5px",
                  },
                }}
                changed={() => {
                  prescriptionValidationHandler(
                    prescription,
                    setPrescriptionPreview,
                    setPrescription,
                    token,
                    $location,
                    unit
                  );
                }}
              >
                PREVIEW
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default React.memo(PrescriptionValidation);
