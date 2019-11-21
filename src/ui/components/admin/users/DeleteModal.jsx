import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import Modal from "ui/components/apps/Modal";
import {
  hideDeleteModal,
  showDeleteModal
} from "../../../store/actions/deleteModal";
import { deleteUser } from "../../../store/actions/users";
import Button from "ui/components/shared/Button";

export class DeleteModal extends React.Component {
  componentDidMount() {
    const { openOnMount, handleOpen } = this.props;
    if (openOnMount) {
      handleOpen();
    }
  }

  render() {
    const {
      className,
      handleClose,
      handleDeleteUser,
      isOpen,
      user
    } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className={cx("DeleteModal", className)}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <h4>
          {`Are you sure you want to delete "`}
          <em>{user.email}</em>
          {`"?`}
        </h4>
        <Button className="confirm" onClick={handleDeleteUser.bind(this, user)}>
          Yes
        </Button>
        <Button className="cancel" onClick={handleClose.bind(this, isOpen)}>
          No
        </Button>
      </Modal>
    );
  }
}

DeleteModal.propTypes = {
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.object,
  openOnMount: PropTypes.bool
};

DeleteModal.defaultProps = {
  openOnMount: false,
  isOpen: false
};

function mapStateToProps({ deleteModal }) {
  return {
    isOpen: deleteModal.isOpen,
    user: deleteModal.userToDelete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: function(isOpen) {
      if (isOpen) {
        dispatch(hideDeleteModal());
      }
    },
    handleOpen: function(user) {
      dispatch(showDeleteModal(user));
    },
    handleDeleteUser: function(user) {
      dispatch(deleteUser(user));
      dispatch(hideDeleteModal());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
