import React, { Fragment } from "react";
import Modal from "../../Modal/Modal";
import avatar from "../../../assets/images/avatar.png";
import classes from "./ChatProfile.module.css";
import Button from "../../UI/Button/Button";

const chatProfile = React.memo((props) => {
  return (
    <Fragment>
      <Modal
        show={props.state.deleteModal}
        modalClosed={() => {
          props.setState((prevState) => {
            return {
              ...prevState,
              profile: true,
              deleteModal: false,
            };
          });
        }}
      >
        <div className={classes.deleteModal}>
          <h4>Do you want to continue</h4>
        </div>
        <Button
          config={{ className: classes.confirm }}
          changed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                profile: true,
                deleteModal: false,
              };
            })
          }
        >
          CANCEL
        </Button>
        <Button
          config={{ className: classes.cancel }}
          changed={() =>
            props.deleteGroupChat(props.token, props.state, props.setState)
          }
        >
          DELETE
        </Button>
      </Modal>
      <Modal
        show={props.state.profile}
        modalClosed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              profile: false,
            };
          })
        }
      >
        <h4>{props.state?.chat?.name}</h4>
        <span
          className={classes.groupInfo}
        >{`${props.state.chat?.users.length} participants`}</span>

        <div className={classes.searchedList}>
          {props.state.chat.users.map((user) => (
            <div
              className={classes.searchedUser}
              key={user?._id}
            >
              <img
                src={user?.avatar || avatar}
                style={{
                  height: "20px",
                  width: "20px",
                }}
              />
              <div>
                {user?.firstName} {user?.lastName}
              </div>
            </div>
          ))}
        </div>
        <Button
          config={{ className: classes.confirm }}
          changed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                profile: false,
                createGroupChat: true,
                editGroupChat: true,
                addGroupUsers: [...props.state.chat.users],
                groupChatName: props.state.chat.name,
              };
            })
          }
        >
          EDIT CHAT
        </Button>
        <Button
          config={{ className: classes.cancel }}
          changed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                profile: false,
                deleteModal: true,
              };
            })
          }
        >
          DELETE CHAT
        </Button>
      </Modal>
    </Fragment>
  );
});

export default chatProfile;
