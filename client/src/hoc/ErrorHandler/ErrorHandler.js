import React, { Fragment } from "react";
import Modal from "../../components/Modal/Modal";
const errorHandler = (props) => {
  return (
    <Fragment>
      <Modal
        show={props.error}
        modalClosed={props.clearError}
      >
        {props.error ? `${props.error} ${props.status}` : null}
      </Modal>
    </Fragment>
  );
};

export default React.memo(errorHandler);
