import signup from "../../../assets/images/NavigationImages/signup.png";
import signin from "../../../assets/images/NavigationImages/signin.png";
import contact from "../../../assets/images/NavigationImages/contact.png";
import about from "../../../assets/images/NavigationImages/about.png";
import dashboard from "../../../assets/images/NavigationImages/dashboard.png";
import logout from "../../../assets/images/NavigationImages/logout.png";
import patient from "../../../assets/images/NavigationImages/patient.png";

// ACTION TYPES
import {
  RESET_ACTIVE_LINK,
  SET_ACTIVE_LINK,
  TOGGLE_FEATURES,
  RESET_FEATURES,
} from "../../actions/actionTypes/actionTypes";

const intialState = {
  authenticatedLinks: [
    {
      src: dashboard,
      alt: "Dashboard",
      description: "Add Components",
      link: true,
      to: "/institution/components",
      active: false,
      authenticated: true,
    },
    {
      src: patient,
      alt: "User",
      description: "User",
      link: false,
      openFeature: false,
      active: false,
      authenticated: true,
      links: [
        {
          linkName: "ADD USER ROLE",
          linkHref: "/institution/user-role",
        },

        {
          linkName: "ADD USER",
          linkHref: "/institution/add-user",
        },

        {
          linkName: "EDIT USER",
          linkHref: "/institution/edit-user",
        },
        {
          linkName: "DELETE USER",
          linkHref: "/institution/delete-user",
        },
        {
          linkName: "USER LOGS",
          linkHref: "/institution/user-logs",
        },
      ],
    },

    {
      src: logout,
      alt: "Log out",
      description: "Log Out",
      link: true,
      to: "/institution/log-out",
      active: false,
      authenticated: true,
    },
  ],
  notAuthenticatedLinks: [
    {
      src: signin,
      alt: "Sign in",
      description: "Login",
      link: true,
      to: "/institution/login",
      active: true,
      authenticated: false,
    },
    {
      src: signup,
      alt: "Sign Up",
      description: "Sign up",
      link: true,
      to: "/institution/signup",
      active: false,
      authenticated: false,
    },

    {
      src: about,
      alt: "About",
      description: "About",
      link: true,
      to: "/institution/about",
      active: false,
      authenticated: false,
    },
    {
      src: contact,
      alt: "Contact",
      description: "Contact",
      link: true,
      to: "/institution/contact",
      active: false,
      authenticated: false,
    },
  ],
};

const institutionNavigationReducer = (state = intialState, action) => {
  switch (action.type) {
    case TOGGLE_FEATURES:
      if (state.length - 1 < action.index) {
        return state;
      } else {
        sessionStorage.setItem("activeLink", JSON.stringify(action.index));
        // let newState = structuredClone(state.notAuthenticatedLinks);
        let newState = JSON.parse(JSON.stringify(state.notAuthenticatedLinks));
        if (action.authStatus) {
          // newState = structuredClone(state.authenticatedLinks);
          newState = JSON.parse(JSON.stringify(state.authenticatedLinks));
        }

        if (!newState[action.index]?.active) {
          newState.forEach((link, i) => {
            if (i !== action.index) {
              link.active = false;
            } else {
              link.active = true;
            }
          });
        }
        if (newState[action.index]?.links) {
          if (newState[action.index].openFeature) {
            newState[action.index].openFeature =
              !newState[action.index].openFeature;
          } else {
            newState.forEach((image) => {
              if (image?.links) {
                image.openFeature = false;
              }
            });
            newState[action.index].openFeature =
              !newState[action.index].openFeature;
          }
        } else {
          if (action.authStatus) {
            newState.forEach((image) => {
              if (image.links) {
                image.openFeature = false;
              }
            });
          }
        }
        if (action.authStatus) {
          return {
            ...state,
            authenticatedLinks: newState,
          };
        } else {
          return {
            ...state,
            notAuthenticatedLinks: newState,
          };
        }
      }
    case SET_ACTIVE_LINK:
      if (action.authStatus) {
        // const links = structuredClone(state.authenticatedLinks);
        const links = JSON.parse(JSON.stringify(state.authenticatedLinks));
        if (links.length - 1 < action.index) {
          return state;
        } else {
          if (action.index !== 0) {
            links[0].active = false;
            links[action.index].active = true;
            return {
              ...state,
              authenticatedLinks: links,
            };
          }
        }
      } else {
        // const links = structuredClone(state.notAuthenticatedLinks);
        const links = JSON.parse(JSON.stringify(state.notAuthenticatedLinks));
        if (links.length - 1 < action.index) {
          return state;
        } else {
          if (action.index !== 0) {
            if (links[action.index]) {
              links[0].active = false;
              links[action.index].active = true;
            } else {
              links[0].active = true;
            }

            return {
              ...state,
              notAuthenticatedLinks: links,
            };
          }
        }
      }

    case RESET_ACTIVE_LINK:
      // const links = structuredClone(state.authenticatedLinks);
      const links = JSON.parse(JSON.stringify(state.authenticatedLinks));
      // const notAuthLinks = structuredClone(state.notAuthenticatedLinks);
      const notAuthLinks = JSON.parse(
        JSON.stringify(state.notAuthenticatedLinks)
      );
      links.forEach((link) => (link.active = false));
      notAuthLinks.forEach((link) => (link.active = false));
      notAuthLinks[0].active = true;
      links[0].active = true;
      return {
        ...state,
        authenticatedLinks: links,
        notAuthenticatedLinks: notAuthLinks,
      };
    case RESET_FEATURES:
      // const authNavLinks = structuredClone(state.authenticatedLinks);
      const authNavLinks = JSON.parse(JSON.stringify(state.authenticatedLinks));
      authNavLinks.forEach((link) => {
        if (link.links?.length) {
          link.openFeature = false;
        }
      });
      return {
        ...state,
        authenticatedLinks: authNavLinks,
      };
    default:
      return state;
  }
};

export default institutionNavigationReducer;
