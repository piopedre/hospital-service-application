import { useEffect, useCallback, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { institutionLogout } from "../../../store";
import { Navigate } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
const InstitutionLogout = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: true,
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const institutionLogoutHandler = useCallback((token, setState) =>
    dispatch(institutionLogout(token, setState))
  );
  useEffect(() => {
    institutionLogoutHandler(token, setState);
  }, []);
  return (
    <Fragment>
      {!isAuthenticated && !token && (
        <Navigate
          replace
          to='/institution/login'
        />
      )}
      {state.loading ? <Spinner /> : null}
    </Fragment>
  );
};

export default InstitutionLogout;
