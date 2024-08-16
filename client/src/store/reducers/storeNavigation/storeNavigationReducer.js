import signup from "../../../assets/images/NavigationImages/signup.png";
import signin from "../../../assets/images/NavigationImages/signin.png";
import contact from "../../../assets/images/NavigationImages/contact.png";
import notification from "../../../assets/images/NavigationImages/notification.png";
import message from "../../../assets/images/NavigationImages/message.png";
import about from "../../../assets/images/NavigationImages/about.png";
import dashboard from "../../../assets/images/NavigationImages/dashboard.png";
import inventory from "../../../assets/images/NavigationImages/inventory.png";
import logout from "../../../assets/images/NavigationImages/logout.png";
import report from "../../../assets/images/NavigationImages/reports.png";
import store from "../../../assets/images/NavigationImages/store.png";
import {
  RESET_ACTIVE_LINK,
  SET_ACTIVE_LINK,
  TOGGLE_FEATURES,
  RESET_FEATURES,
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATION,
  CLEAR_NOTIFICATION_MESSAGE,
} from "../../actions/actionTypes/actionTypes";
const storeIntialState = {
  authenticatedLinks: [
    {
      src: dashboard,
      alt: "Dashboard",
      description: "Dashboard",
      link: true,
      to: "/pharma-app/store-dashboard",
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
      src: inventory,
      alt: "Inventory",
      description: "Inventory",
      link: false,
      openFeature: false,
      active: false,
      authenticated: true,
      links: [
        {
          linkName: "ADD PRODUCT",
          linkHref: "/pharma-app/add-product",
        },
        {
          linkName: "EDIT PRODUCT",
          linkHref: "/pharma-app/edit-product",
        },
        {
          linkName: "PRODUCT CATEGORY",
          linkHref: "/pharma-app/product-category",
        },
        {
          linkName: "DELETE PRODUCT",
          linkHref: "/pharma-app/delete-product",
        },
        {
          linkName: "PRODUCT INVENTORY",
          linkHref: "/pharma-app/product-inventory",
        },
        {
          linkName: "OTHER UNITS INVENTORY",
          linkHref: "/pharma-app/inventory-otherunits",
        },

        {
          linkName: "TRANSFER",
          linkHref: "/pharma-app/transfer-products",
        },
        {
          linkName: "ADD EXPIRIES",
          linkHref: "/pharma-app/add-expiries",
        },
        {
          linkName: "SHORTDATED",
          linkHref: "/pharma-app/shortdated",
        },
      ],
    },
    {
      src: store,
      alt: "Store",
      description: "Store Services",
      link: false,
      openFeature: false,
      active: false,
      authenticated: true,
      links: [
        {
          linkName: "RECEIVE PRODUCT",
          linkHref: "/pharma-app/receive-products",
        },
        {
          linkName: "ISSUE REQUISTION",
          linkHref: "/pharma-app/issue-products",
        },
        {
          linkName: "SUPPLIES",
          linkHref: "/pharma-app/supplies",
        },
        {
          linkName: "SUPPLIERS",
          linkHref: "/pharma-app/suppliers",
        },
        {
          linkName: "REORDER LEVEL",
          linkHref: "/pharma-app/reorder-level",
        },
        {
          linkName: "EXCHANGE PRODUCTS",
          linkHref: "/pharma-app/exchange-products",
        },
      ],
    },
    {
      src: report,
      alt: "Report",
      description: "Reports",
      link: false,
      openFeature: false,
      active: false,
      authenticated: true,
      adminUser: true,
      links: [
        {
          linkName: "STORE  REPORT",
          linkHref: "/pharma-app/store-report",
        },
        {
          linkName: "STORE  VISUALIZATION REPORT",
          linkHref: "/pharma-app/store-visualization-report",
        },
        {
          linkName: "REPORT ON INVENTORY",
          linkHref: "/pharma-app/inventory-report",
        },
        {
          linkName: "OS REPORT",
          linkHref: "/pharma-app/os-report",
        },
        {
          linkName: "OS/EXPIRIES VISUALIZATION REPORT",
          linkHref: "/pharma-app/os-expiries-visualization-report",
        },
      ],
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
    // {
    //   src: signup,
    //   alt: "Sign Up",
    //   description: "Sign up",
    //   link: true,
    //   to: "/pharma-app/sign-up",
    //   active: false,
    //   authenticated: false,
    // },
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
const storeNavigation = (state = storeIntialState, action) => {
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
        const links = JSON.parse(JSON.stringify(state.authenticatedLinks));
        // const links = structuredClone(state.authenticatedLinks);
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

export default storeNavigation;
