import signin from "../../../../assets/images/NavigationImages/signin.png";
import contact from "../../../../assets/images/NavigationImages/contact.png";
import about from "../../../../assets/images/NavigationImages/about.png";
import notification from "../../../../assets/images/NavigationImages/notification.png";
import message from "../../../../assets/images/NavigationImages/message.png";
import dashboard from "../../../../assets/images/NavigationImages/dashboard.png";
import logout from "../../../../assets/images/NavigationImages/logout.png";
import patient from "../../../../assets/images/NavigationImages/patient.png";

// ACTION TYPES
import {
  RESET_ACTIVE_LINK,
  SET_ACTIVE_LINK,
  TOGGLE_FEATURES,
  ADD_NOTIFICATION,
  RESET_FEATURES,
  CLEAR_NOTIFICATION,
  CLEAR_NOTIFICATION_MESSAGE,
} from "../../../actions/actionTypes/actionTypes";
const intialState = {
  authenticatedLinks: [
    {
      src: dashboard,
      alt: "Dashboard",
      description: "Dashboard",
      link: true,
      to: "/pharma-app/dashboard",
      active: true,
      authenticated: true,
    },
    {
      src: notification,
      alt: "Notification",
      description: "Notification",
      link: true,
      to: "/pharma-app/notification",
      active: false,
      authenticated: true,
      notification: [],
    },
    {
      src: message,
      alt: "Message",
      description: "Message",
      link: true,
      to: "/pharma-app/messages",
      active: false,
      authenticated: true,
      notification: [],
    },

    {
      src: patient,
      alt: "Patient",
      description: "Patient",
      link: true,
      to: "/app/patient-services",
      active: false,
      authenticated: false,
    },
    {
      src: logout,
      alt: "Log out",
      description: "Log Out",
      link: true,
      to: "/pharma-app/log-out",
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
      to: "/pharma-app/login",
      active: true,
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

const clinicNavigation = (state = intialState, action) => {
  switch (action.type) {
    case TOGGLE_FEATURES:
      if (state.length - 1 < action.index) {
        return state;
      } else {
        sessionStorage.setItem("activeLink", JSON.stringify(action.index));
        let newState = JSON.parse(JSON.stringify(state.notAuthenticatedLinks));
        if (action.authStatus) {
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
      const links = JSON.parse(JSON.stringify(state.authenticatedLinks));
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
    case ADD_NOTIFICATION:
      const authLinks = JSON.parse(JSON.stringify(state.authenticatedLinks));
      if (action.notification.type === "message") {
        const notificationLink = authLinks.find(
          (link) => link.description === "Message"
        );
        const notificationIndex = authLinks.findIndex(
          (link) => link.description === "Message"
        );
        const duplicate = [...notificationLink.notification].find(
          (not) => not._id === action.notification._id
        );
        if (duplicate) {
          return {
            ...state,
            authenticatedLinks: authLinks,
          };
        } else {
          notificationLink.notification = [
            ...notificationLink.notification,
            action.notification,
          ];
          authLinks[notificationIndex] = notificationLink;
          return {
            ...state,
            authenticatedLinks: authLinks,
          };
        }
      } else {
        const notificationLink = authLinks.find(
          (link) => link.description === "Notification"
        );
        const notificationIndex = authLinks.findIndex(
          (link) => link.description === "Notification"
        );
        const duplicate = [...notificationLink.notification].find(
          (not) => not._id === action.notification._id
        );

        if (duplicate) {
          return {
            ...state,
            authenticatedLinks: authLinks,
          };
        } else {
          notificationLink.notification = [
            ...notificationLink.notification,
            action.notification,
          ];
          authLinks[notificationIndex] = notificationLink;
          return {
            ...state,
            authenticatedLinks: authLinks,
          };
        }
      }

    case CLEAR_NOTIFICATION:
      const authTLinks = JSON.parse(JSON.stringify(state.authenticatedLinks));
      const notificationLink = authTLinks.find(
        (link) => link.description === "Notification"
      );
      const notificationIndex = authTLinks.findIndex(
        (link) => link.description === "Notification"
      );
      notificationLink.notification = [];
      authTLinks[notificationIndex] = notificationLink;
      return {
        ...state,
        authenticatedLinks: authTLinks,
      };
    case CLEAR_NOTIFICATION_MESSAGE:
      const authMLinks = JSON.parse(JSON.stringify(state.authenticatedLinks));
      const messageLink = authMLinks.find(
        (link) => link.description === "Message"
      );
      const messageIndex = authMLinks.findIndex(
        (link) => link.description === "Message"
      );
      messageLink.notification = [];
      authMLinks[messageIndex] = messageLink;
      return {
        ...state,
        authenticatedLinks: authMLinks,
      };

    case RESET_FEATURES:
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

export default clinicNavigation;
