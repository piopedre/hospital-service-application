import React, { useEffect, useCallback } from "react";
import classes from "./Logout.module.css";
import PharmacyLogo from "../../components/PharmacyLogo/PharmacyLogo";
import Button from "../../components/UI/Button/Button";
import { loggingOut, resetActiveLink, logout } from "../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Logout = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const logoutHandler = useCallback(
    (token) => dispatch(loggingOut(token)),
    [dispatch]
  );
  const noTokenLogoutHandler = useCallback(() => dispatch(logout()));
  const resetActiveLinkHandler = useCallback(
    () => dispatch(resetActiveLink()),
    [dispatch]
  );
  useEffect(() => {
    if (token) {
      logoutHandler(token);
      resetActiveLinkHandler();
    } else {
      noTokenLogoutHandler();
    }
  }, [logoutHandler, resetActiveLinkHandler, token]);
  return (
    <div className={classes.logout}>
      <PharmacyLogo />
      <h2 className={classes.success}> ✓ Logout Successful</h2>

      <br></br>
      <br></br>
      <h4>Have a nice day ahead</h4>
      <br></br>
      <br></br>
      <h5 className={classes.warning}>
        Please exit the browser for security reasons
      </h5>
      <Button
        config={{
          className: classes.hold,
        }}
        changed={() => navigate("/pharma-app/login", { replace: true })}
      >
        LOGIN
      </Button>
    </div>
  );
});

export default Logout;
