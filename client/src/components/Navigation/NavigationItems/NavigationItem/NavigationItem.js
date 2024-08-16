import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import classes from "./NavigationItem.module.css";
const navigationItem = React.memo((props) => {
  const navigate = useNavigate();
  return !props.admin ? (
    props.link ? (
      <div
        onClick={() => {
          props.clicked(props.index, props.auth);
          return navigate(props.to);
        }}
        className={[
          classes.Navigation_Link,
          props.activeLink ? classes.Active : classes.NotActive,
        ].join(" ")}
      >
        <NavLink
          onClick={props.closeSideDrawer}
          to={props.to}
        >
          {props.children}
        </NavLink>
      </div>
    ) : (
      <div
        onClick={() => props.clicked(props.index, props.auth)}
        className={[
          classes.Navigation_Features,
          classes.Navigation_Link,
          props.activeLink ? classes.Active : classes.NotActive,
        ].join(" ")}
      >
        {props.children}
        <ul
          className={
            props.openFeatures ? classes.Toggle_Features : classes.Features_List
          }
        >
          {props.links.map((link) => (
            <li
              className={classes.Features_Link}
              key={link.linkName}
            >
              <NavLink
                onClick={props.closeSideDrawer}
                to={link.linkHref}
              >
                {link.linkName}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    )
  ) : props.admin === props.adminStatus ? (
    props.link ? (
      <div
        onClick={() => {
          props.clicked(props.index, props.auth);
          return navigate(props.to);
        }}
        className={[
          classes.Navigation_Link,
          props.activeLink ? classes.Active : classes.NotActive,
        ].join(" ")}
      >
        <NavLink
          onClick={props.closeSideDrawer}
          to={props.to}
        >
          {props.children}
        </NavLink>
      </div>
    ) : (
      <div
        onClick={() => props.clicked(props.index, props.auth)}
        className={[
          classes.Navigation_Features,
          classes.Navigation_Link,
          props.activeLink ? classes.Active : classes.NotActive,
        ].join(" ")}
      >
        {props.children}
        <ul
          className={
            props.openFeatures ? classes.Toggle_Features : classes.Features_List
          }
        >
          {props.links.map((link) => (
            <li
              className={classes.Features_Link}
              key={link.linkName}
            >
              <NavLink
                onClick={props.closeSideDrawer}
                to={link.linkHref}
              >
                {link.linkName}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    )
  ) : null;
});
export default navigationItem;
// figure out how to work this permission
