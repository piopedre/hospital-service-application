import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveLink, resetFeatures } from "../../store";
import Navbar from "../../components/Navigation/Navbar/Navbar";
import Sidebar from "../../components/Navigation/Sidebar/Sidebar";
import PharmacySite from "../../components/PharmacySite/PharmacySite";
import Footer from "../../components/Navigation/Footer/Footer";
import pharmacyImage from "../../assets/images/pharmacy.avif";
const Layout = (props) => {
  const dispatch = useDispatch();
  const [showNav, setNav] = useState(false);
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const site = JSON.parse(sessionStorage.getItem("location"))?.name;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  const username = JSON.parse(sessionStorage.getItem("id"))?.username;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const setActiveLinkHandler = useCallback(
    (index, authStatus) => dispatch(setActiveLink(index, authStatus)),
    [dispatch]
  );
  const resetFeaturesHandler = useCallback(
    () => dispatch(resetFeatures()),
    [dispatch]
  );
  useEffect(() => {
    setActiveLinkHandler(
      JSON.parse(sessionStorage.getItem("activeLink")),
      isAuthenticated
    );
  }, [isAuthenticated, setActiveLinkHandler]);
  return (
    <Fragment>
      <Navbar
        checked={() => {
          setNav(!showNav);
          // clear out all Features
          resetFeaturesHandler();
        }}
        sideDrawerState={showNav}
      />
      <Sidebar
        showBackdrop={showNav}
        closedNav={() => setNav(false)}
      />
      <main
        style={{
          backgroundImage: `linear-gradient(#e8f1fbbf, #eaf3fa84),
    url(${pharmacyImage})`,
        }}
      >
        {sessionStorage.getItem("isInstitution") ? null : isAuthenticated ? (
          <PharmacySite
            site={site}
            unit={unit}
            clinic={clinic}
            username={username}
          />
        ) : null}
        {props.children}
      </main>

      <Footer
        year={new Date().getFullYear()}
        name={JSON.parse(sessionStorage.getItem("institution"))?.username}
      />
    </Fragment>
  );
};

export default React.memo(Layout);
