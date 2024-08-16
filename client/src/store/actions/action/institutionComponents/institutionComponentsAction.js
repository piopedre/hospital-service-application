import {
  addDepartmentRequest,
  addLocationRequest,
  addUnitRequest,
  getInstitutionRequest,
} from "../../../../Utility/institution/initInstitution";
import { clearAuthentication } from "../auth/loginAction";
import {
  sendProductMessenger,
  resetProductMessenger,
} from "../inventory/addProductAction";
import {
  activateUser,
  deactivateUser,
  deleteUserMethod,
  updateUser,
} from "../../../../Utility/users/usersChat";
import { validatePassword } from "../auth/registerAction";
export const getDepartmentsMethod = (token, setState) => {
  setState((prevState) => {
    return {
      ...prevState,
      loading: true,
    };
  });
  return async (dispatch) => {
    try {
      const institutionResponse = await getInstitutionRequest(token);
      if (institutionResponse?.ok) {
        const institution = await institutionResponse.json();
        const departments = institution.departments;
        if (!departments.length) {
          throw {
            message: "There is no registered Department",
            status: 404,
          };
        }
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            departments,
          };
        });
      } else {
        throw {
          message: institutionResponse.statusText,
          status: institutionResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          departments: [],
        };
      });
    }
  };
};
const addComponentMethod = (
  e,
  setState,
  addMethod,
  token,
  sucessMessage,
  errorMessage
) => {
  e.preventDefault();
  setState((prevState) => {
    return {
      ...prevState,
      loading: true,
    };
  });
  return async (dispatch) => {
    try {
      const formData = Object.fromEntries(new FormData(e.target).entries());
      const locationResponse = await addMethod(token, JSON.stringify(formData));
      if (locationResponse?.ok) {
        dispatch(sendProductMessenger(sucessMessage));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        dispatch(getDepartmentsMethod(token, setState));
      } else {
        throw {
          message: locationResponse.statusText,
          status: locationResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger(errorMessage, true));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
    }
  };
};
export const componentMethod = (e, state, setState, token) => {
  return (dispatch) => {
    if (state.links.department) {
      dispatch(
        addComponentMethod(
          e,
          setState,
          addDepartmentRequest,
          token,
          "Department successfuly added",
          "unable to add Department"
        )
      );
    } else {
      dispatch(
        addComponentMethod(
          e,
          setState,
          addLocationRequest,
          token,
          "Location successfuly added",
          "unable to add location"
        )
      );
    }
  };
};
export const addUnitMethod = (e, setState, state, token) => {
  e.preventDefault();
  return async (dispatch) => {
    if (!state.departments.length) {
      dispatch(
        sendProductMessenger("A department is needed to add a unit", true)
      );
      setTimeout(() => {
        resetProductMessenger();
      }, 3000);
      return;
    }
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const formData = Object.fromEntries(new FormData(e.target).entries());
      const department = [...state.departments].find(
        (dep) => dep.name === formData.department
      );
      const newForm = {
        ...formData,
        department: department._id,
      };
      const addUnitResponse = await addUnitRequest(
        token,
        JSON.stringify(newForm)
      );
      if (addUnitResponse?.ok) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            unitModal: false,
          };
        });
        dispatch(sendProductMessenger("unit added Successfully"));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      } else {
        throw {
          message: addUnitResponse.statusText,
          status: addUnitResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            unitModal: true,
          };
        });
        dispatch(sendProductMessenger("unable to add unit", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
    }
  };
};

export const deleteUser = (setState, token, state) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          deleteModal: false,
        };
      });

      const deleteResponse = await deleteUserMethod(token, state.id);
      if (deleteResponse?.ok) {
        dispatch(
          sendProductMessenger(
            `User ${state.userName} has been deleted Successfully ✓`
          )
        );
        setState((prevState) => {
          return {
            ...prevState,
            userName: "",
            id: "",
            users: [],
          };
        });
      } else {
        throw {
          message: deleteResponse.statusText,
          status: deleteResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable to delete User", true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };
};
export const activateUserMethod = (setState, token, state) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          edit: false,
          activationModal: false,
        };
      });

      const activateResponse = await activateUser(
        token,
        state.selectedUser._id
      );
      if (activateResponse?.ok) {
        dispatch(sendProductMessenger(`Activation Successfully ✓`));
        setState((prevState) => {
          return {
            ...prevState,
            users: [],
          };
        });
      } else {
        throw {
          message: activateResponse.statusText,
          status: activateResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable activate User", true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };
};
export const deactivateUserMethod = (setState, token, state) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          edit: false,
          activationModal: false,
          deactivation: false,
        };
      });

      const deactivationResponse = await deactivateUser(
        token,
        state.selectedUser._id
      );
      if (deactivationResponse?.ok) {
        dispatch(sendProductMessenger(`Deactivation Successfully ✓`));
        setState((prevState) => {
          return {
            ...prevState,
            users: [],
          };
        });
      } else {
        throw {
          message: deactivationResponse.statusText,
          status: deactivationResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable deactivate User", true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };
};

export const editUserMethod = (e, setState, token, state) => {
  e.preventDefault();
  return async (dispatch) => {
    const body = {};
    [("firstName", "lastName", "username")].forEach((key) => {
      if (state[key] !== state.selectedUser[key]) {
        body[key] = state[key];
      }
    });
    if (state.userRole !== state.selectedUser.role?.name) {
      const newRole = state.userRoles.find(
        (role) => role.name === state.userRole
      );
      body.role = newRole._id;
    }
    if (state.department !== state.selectedUser.department.name) {
      const department = state.departments.find(
        (dep) => dep.name === state.department
      );
      body.department = department._id;
    }
    // check for password
    if (state.password) {
      if (state.password === state.retypePassword) {
        if (
          !validatePassword(
            state,
            dispatch,
            sendProductMessenger,
            resetProductMessenger
          )
        ) {
          return;
        }
        body.password = state.password;
      } else {
        dispatch(sendProductMessenger(`Passwords don't match`, true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        return;
      }
    }
    const newBody = JSON.stringify(body);
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          edit: false,
        };
      });

      const activateResponse = await updateUser(
        token,
        state.selectedUser._id,
        newBody
      );
      if (activateResponse?.ok) {
        dispatch(sendProductMessenger(`changes saved Successfully ✓`));
        setState((prevState) => {
          return {
            ...prevState,
            users: [],
          };
        });
      } else {
        throw {
          message: activateResponse.statusText,
          status: activateResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable edit User", true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };
};
