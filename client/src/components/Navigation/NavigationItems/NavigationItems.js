import React, { useCallback } from "react";
import NavigationItem from "./NavigationItem/NavigationItem";
import NavigationLogo from "../NavigationLogo/NavigationLogo";
import classes from "./NavigationItems.module.css";
import { useSelector, useDispatch } from "react-redux";
// ACTIONS
import { toggleFeatures } from "../../../store/actions/action/navigation/navigationAction";
const NavigationItems = (props) => {
  const authenticatedNavItemList = useSelector((state) =>
    JSON.parse(sessionStorage.getItem("unit"))?.name === "STORE"
      ? state.storeNavigation.authenticatedLinks
      : JSON.parse(sessionStorage.getItem("depLogin"))?.name === "CLINICALS"
      ? state.clinicNavigation.authenticatedLinks
      : JSON.parse(sessionStorage.getItem("isInstitution"))
      ? state.institution.authenticatedLinks
      : state.navigation.authenticatedLinks
  );
  const notAuthenticatedNavItemList = useSelector((state) =>
    JSON.parse(sessionStorage.getItem("unit"))?.name === "STORE"
      ? state.storeNavigation.notAuthenticatedLinks
      : JSON.parse(sessionStorage.getItem("isInstitution"))
      ? state.institution.notAuthenticatedLinks
      : state.navigation.notAuthenticatedLinks
  );
  // institutionlist,
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const dispatch = useDispatch();
  const toggleFeaturesHandler = useCallback(
    (index, authStatus) => dispatch(toggleFeatures(index, authStatus)),
    [dispatch]
  );

  let navigationItems = notAuthenticatedNavItemList;

  if (isAuthenticated) {
    navigationItems = authenticatedNavItemList;
  }
  return (
    <div className={classes.NavigationBar}>
      {navigationItems.map((imageLink, index) => (
        <NavigationItem
          auth={isAuthenticated}
          key={index}
          index={index}
          clicked={toggleFeaturesHandler}
          link={imageLink.link}
          to={imageLink.to}
          links={imageLink.links}
          activeLink={imageLink.active}
          openFeatures={imageLink.openFeature}
          closeSideDrawer={props.closeSideDrawer}
          admin={imageLink?.adminUser}
          adminStatus={JSON.parse(sessionStorage.getItem("id"))?.admin}
        >
          <NavigationLogo
            notification={imageLink?.notification}
            navbar={imageLink.navbar}
            image={imageLink.src}
            description={imageLink.description}
            alt={imageLink.alt}
          />
        </NavigationItem>
      ))}
    </div>
  );
};

export default React.memo(NavigationItems);
