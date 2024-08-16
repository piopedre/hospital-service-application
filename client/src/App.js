import React, { Suspense, useCallback, useEffect, lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Login Import
import Login from "./container/Login/Login";
import Spinner from "./components/UI/Spinner/Spinner";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./hoc/Layout/Layout";
import "./fonts/Montserrat-VariableFont_wght.ttf";
import { reAuthenticate } from "./store/actions/action/auth/loginAction";
import io from "socket.io-client";

// About
const About = lazy(() => {
  return import("./container/About/About");
});

const Contact = lazy(() => {
  return import("./container/Contact/Contact");
});
// Error Component
const ErrorComponent = lazy(() => {
  return import("./container/InitInstitution/ErrorComponent/ErrorComponent");
});
// institution
const InstitutionComponents = lazy(() => {
  return import(
    "./container/InitInstitution/InstitutionComponents/InstitutionComponents"
  );
});
const InitInstitution = lazy(() => {
  return import("./container/InitInstitution/InitInstitution");
});
const InstitutionLogin = lazy(() => {
  return import(
    "./container/InitInstitution/InstitutionLogin/InstitutionLogin"
  );
});
const InstitutionLogout = lazy(() => {
  return import(
    "./container/InitInstitution/InstitutionLogout/InstitutionLogout"
  );
});
// Async imports
// User
const Register = lazy(() => {
  return import("./container/Register/Register");
});
const UserRole = lazy(() => {
  return import("./container/Register/UserRole/UserRole");
});

const EditUser = lazy(() => {
  return import("./container/Register/User/EditUser/EditUser");
});
const DeleteUser = lazy(() => {
  return import("./container/Register/User/DeleteUser/DeleteUser");
});
const Logout = lazy(() => {
  return import("./container/Logout/Logout");
});
// Dashboard
const Dashboard = lazy(() => {
  return import("./container/Dashboard/Dashboard");
});
const StoreDashboard = lazy(() => {
  return import("./container/StoreServices/Dashboard/StoreDashboard");
});
// Message / Notification
const MessageApp = lazy(() => {
  return import("./container/MessageApp/MessageApp");
});
const NotificationApp = lazy(() => {
  return import("./container/Notification/Notification");
});
// Inventory Imports
const AddProduct = lazy(() => {
  return import("./container/Inventory/AddProduct/AddProduct");
});
const EditProduct = lazy(() => {
  return import("./container/Inventory/EditProduct/EditProduct");
});
const Category = lazy(() => {
  return import("./container/Inventory/Category/Category");
});
const ProductInventory = lazy(() => {
  return import("./container/Inventory/ProductInventory/ProductInventory");
});
const DeleteProduct = lazy(() => {
  return import("./container/Inventory/Delete/DeleteProduct");
});

const ReceiveRequistion = lazy(() => {
  return import("./container/Inventory/ReceiveRequistion/ReceiveRequistion");
});
const Requistions = lazy(() => {
  return import("./container/Inventory/Requistions/Requistions");
});

const ReceiveTransferProducts = lazy(() => {
  return import(
    "./container/Inventory/ReceiveTransferProducts/ReceiveTransferProducts"
  );
});
const AddExpiries = lazy(() => {
  return import("./container/Inventory/AddExpiries/AddExpiries");
});
const ShortDatedProducts = lazy(() => {
  return import("./container/Inventory/ShortDatedProducts/ShortDatedProducts");
});
const InventoryOtherUnits = lazy(() => {
  return import(
    "./container/Inventory/InventoryOtherUnits/InventoryOtherUnits"
  );
});
// Patient Services Import
const Feedback = lazy(() => {
  return import("./container/PatientServices/Feedback/Feedback");
});
const FeedbackReport = lazy(() => {
  return import(
    "./container/PatientServices/Feedback/FeedbackReport/FeedbackReport"
  );
});
const PrescriptionValidation = lazy(() => {
  return import(
    "./container/PatientServices/PrescriptionValidation/PrescriptionValidation"
  );
});
const InventoryReport = lazy(() => {
  return import("./container/Inventory/ReportInventory/ReportInventory");
});
const ProductSales = lazy(() => {
  return import("./container/PatientServices/ProductSales/ProductSales");
});
const ReturnProducts = lazy(() => {
  return import("./container/PatientServices/ReturnProducts/ReturnProducts");
});
const ProductSalesReport = lazy(() => {
  return import(
    "./container/PatientServices/ProductSalesReport/ProductSalesReport"
  );
});
const ProductVisualization = lazy(() => {
  return import(
    "./container/PatientServices/ProductVisualization/ProductVisualization"
  );
});
const DailySalesReport = lazy(() => {
  return import(
    "./container/PatientServices/ProductVisualization/DailySalesReport/DailySalesReport"
  );
});
const DrugTherapyProblem = lazy(() => {
  return import(
    "./container/PatientServices/DrugTherapyProblem/DrugTherapyProblem"
  );
});
const Pharmacovigilance = lazy(() => {
  return import(
    "./container/PatientServices/Pharmacovigilance/Pharmacovigilance"
  );
});
const PharmacovigilanceReport = lazy(() => {
  return import(
    "./container/PatientServices/PharmacovigilanceReport/PharmacovigilanceReport"
  );
});
// Store Services
const ReceiveProducts = lazy(() => {
  return import("./container/StoreServices/ReceiveProducts/ReceiveProducts");
});

const IssuedProducts = lazy(() => {
  return import("./container/StoreServices/IssueProducts/IssueProducts");
});
const Supplies = lazy(() => {
  return import("./container/StoreServices/Supplies/Supplies");
});
const StoreReport = lazy(() => {
  return import("./container/StoreServices/StoreReport/StoreReport");
});
const StoreVisualizationReport = lazy(() => {
  return import(
    "./container/StoreServices/StoreReport/StoreVisualizationReport/StoreVisualizationReport"
  );
});
const ReOrderLevel = lazy(() => {
  return import("./container/StoreServices/ReOrderLevel/ReOrderLevel");
});
const OsReport = lazy(() => {
  return import("./container/StoreServices/OsReport/OsReport");
});
const OsExpiryVisualizationReport = lazy(() => {
  return import(
    "./container/StoreServices/StoreReport/OsExpiryVisualizationReport/OsExpiryVisualizationReport"
  );
});
const Suppliers = lazy(() => {
  return import("./container/StoreServices/Suppliers/Suppliers");
});

// CLINICALS
const PatientConsultation = lazy(() => {
  return import(
    "./container/Clinicals/PatientConsultation/PatientConsultation"
  );
});

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "http://192.168.88.3:3001";

const socket = io(ENDPOINT, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000, // initial delay in milliseconds
  reconnectionDelayMax: 5000, // maximum delay in milliseconds
  randomizationFactor: 0.5, // randomization factor to prevent reconnection storms
});

function App() {
  const [state, setState] = useState({
    socket: false,
  });
  const dispatch = useDispatch();

  const reAuthenticateHandler = useCallback(
    () => dispatch(reAuthenticate()),
    [dispatch]
  );

  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      reAuthenticateHandler();
    }
  }, [reAuthenticateHandler, isAuthenticated]);
  useEffect(() => {
    if (isAuthenticated) {
      socket.on("connected", () => {
        setState((prevState) => {
          return {
            ...prevState,
            socket: true,
          };
        });
      });
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
      return () => {
        socket.off("connected", () => {
          setState((prevState) => {
            return {
              ...prevState,
              socket: false,
            };
          });
        });
        socket.disconnect();
      };
    }
  }, [isAuthenticated, socket]);
  return (
    <div className='App'>
      <Layout>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* CLINICALS */}
            <Route
              path='/app/patient-services'
              element={<PatientConsultation socket={socket} />}
            />

            {/* PHARMACY */}
            <Route
              path='/pharma-app/feedback'
              element={<Feedback socket={socket} />}
            />
            <Route
              path='/pharma-app/feedback-report'
              element={<FeedbackReport socket={socket} />}
            />
            <Route
              path='/pharma-app/daily-products-visualization-report'
              element={<DailySalesReport socket={socket} />}
            />
            <Route
              path='/pharma-app/product-visualization-report'
              element={<ProductVisualization socket={socket} />}
            />
            <Route
              path='/pharma-app/product-sales-report'
              element={<ProductSalesReport socket={socket} />}
            />
            <Route
              path='/pharma-app/os-expiries-visualization-report'
              element={<OsExpiryVisualizationReport socket={socket} />}
            />

            <Route
              path='/pharma-app/prescription-validation'
              element={<PrescriptionValidation socket={socket} />}
            />
            <Route
              path='/pharma-app/return-product-sales'
              element={<ReturnProducts socket={socket} />}
            />
            <Route
              path='/pharma-app/product-sales'
              element={<ProductSales socket={socket} />}
            />
            <Route
              path='/pharma-app/drug-therapy-problems-report'
              element={<DrugTherapyProblem socket={socket} />}
            />
            <Route
              path='/pharma-app/pharmacovigilance'
              element={<Pharmacovigilance socket={socket} />}
            />
            <Route
              path='/pharma-app/pharmacovigilance-report'
              element={<PharmacovigilanceReport socket={socket} />}
            />
            <Route
              path='/pharma-app/inventory-report'
              element={<InventoryReport socket={socket} />}
            />
            {/* Store Services */}
            <Route
              path='/pharma-app/reorder-level'
              element={<ReOrderLevel socket={socket} />}
            />
            <Route
              path='/pharma-app/receive-products'
              element={<ReceiveProducts socket={socket} />}
            />
            <Route
              path='/pharma-app/issue-products'
              element={<IssuedProducts socket={socket} />}
            />
            <Route
              path='/pharma-app/supplies'
              element={<Supplies socket={socket} />}
            />
            <Route
              path='/pharma-app/suppliers'
              element={<Suppliers socket={socket} />}
            />
            <Route
              path='/pharma-app/store-report'
              element={<StoreReport socket={socket} />}
            />
            <Route
              path='/pharma-app/store-visualization-report'
              element={<StoreVisualizationReport socket={socket} />}
            />
            <Route
              path='/pharma-app/os-report'
              element={<OsReport socket={socket} />}
            />
            <Route
              path='/pharma-app/exchange-products'
              element={
                <ReceiveProducts
                  exchange
                  socket={socket}
                />
              }
            />
            {/* INVENTORY */}
            <Route
              path='/pharma-app/shortdated'
              element={<ShortDatedProducts socket={socket} />}
            />
            <Route
              path='/pharma-app/inventory-otherunits'
              element={<InventoryOtherUnits socket={socket} />}
            />
            <Route
              path='/pharma-app/add-expiries'
              element={<AddExpiries socket={socket} />}
            />
            <Route
              path='/pharma-app/transfer-products'
              element={<ReceiveTransferProducts socket={socket} />}
            />
            <Route
              path='/pharma-app/requistions'
              element={<Requistions socket={socket} />}
            />
            <Route
              path='/pharma-app/requistion'
              element={<ReceiveRequistion socket={socket} />}
            />
            <Route
              path='/pharma-app/delete-product'
              element={<DeleteProduct socket={socket} />}
            />
            <Route
              path='/pharma-app/product-inventory'
              element={<ProductInventory socket={socket} />}
            />
            <Route
              path='/pharma-app/product-category'
              element={<Category socket={socket} />}
            />
            <Route
              path='/pharma-app/edit-product'
              element={<EditProduct socket={socket} />}
            />
            <Route
              path='/pharma-app/add-product'
              element={<AddProduct socket={socket} />}
            />
            <Route
              path='/pharma-app/messages'
              element={
                <MessageApp
                  socket={socket}
                  stateSocket={state.socket}
                />
              }
            />
            <Route
              path='/pharma-app/notification'
              element={<NotificationApp socket={socket} />}
            />
            <Route
              path='/pharma-app/store-dashboard'
              element={<StoreDashboard socket={socket} />}
            />
            <Route
              path='/pharma-app/dashboard'
              element={<Dashboard socket={socket} />}
            />
            {/* institution */}
            <Route
              path='/institution/signup'
              Component={InitInstitution}
            />
            <Route
              path='/institution/edit-user'
              Component={EditUser}
            />
            <Route
              path='/institution/delete-user'
              Component={DeleteUser}
            />
            <Route
              path='/institution/components'
              Component={InstitutionComponents}
            />
            <Route
              path='/institution/login'
              Component={InstitutionLogin}
            />
            <Route
              path='/institution/log-out'
              Component={InstitutionLogout}
            />
            {/* User Auth */}
            <Route
              path='/pharma-app/log-out'
              Component={Logout}
            />
            <Route
              path='/institution/add-user'
              Component={Register}
            />
            <Route
              path='/institution/user-role'
              Component={UserRole}
            />

            <Route
              path='/institution/about'
              Component={About}
            />
            <Route
              path='/institution/contact'
              Component={Contact}
            />
            <Route
              path='/pharma-app/login'
              Component={Login}
            />

            <Route
              path='/'
              element={
                <Navigate
                  replace
                  to='/institution/about'
                />
              }
            />
            <Route
              path='*'
              Component={ErrorComponent}
            />
            <Route />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  );
}

export default App;
