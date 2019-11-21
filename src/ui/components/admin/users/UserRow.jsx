import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { connect } from "react-redux";
import { hasSuperAdminAccess } from "helpers/authorization";

import ToggleSwitch from "ui/components/apps/ToggleSwitch";
import IconButton from "ui/components/shared/IconButton";
import { showDeleteModal } from "ui/store/actions/deleteModal";

function UserRow({ user, role, openDeleteModal, toggleStatus, currentUserId }) {
  function handleToggle(userId) {
    if (currentUserId !== userId) {
      toggleStatus(userId);
    }
  }

  return (
    <div className={`UserRow${hasSuperAdminAccess(role) ? "-superadmin" : ""}`}>
      <div
        className={cx(
          "UserRow__details",
          {
            inactive: user.status === "inactive"
          },
          "ms-column-1"
        )}
      >
        {user.email}
      </div>
      <div
        className={cx(
          "UserRow__details",
          {
            inactive: user.status === "inactive"
          },
          "ms-column-2"
        )}
      >
        {user.role}
      </div>
      <div
        className={cx(
          "UserRow__details",
          {
            inactive: user.status === "inactive"
          },
          "ms-column-3"
        )}
      >
        {hasSuperAdminAccess(role) ? user.company_name : ""}
      </div>
      <div
        className={cx(
          "UserRow__details",
          { "ms-column-4": hasSuperAdminAccess(role) },
          { "ms-column-3": !hasSuperAdminAccess(role) },
          {
            "fill-width": currentUserId === user.id
          }
        )}
      >
        {currentUserId !== user.id && (
          <ToggleSwitch
            className="center-by-margin"
            handleToggle={handleToggle.bind(this, user.id)}
            isOn={user.status === "active"}
          />
        )}
      </div>
      <div
        className={cx(
          "UserRow__details",
          { "ms-column-5": hasSuperAdminAccess(role) },
          { "ms-column-4": !hasSuperAdminAccess(role) },
          {
            "fill-width": currentUserId === user.id
          },
          "text-center"
        )}
      >
        {currentUserId !== user.id && (
          <IconButton
            src={require("../../../images/icon-x.svg")}
            onClick={openDeleteModal.bind(this, user)}
          />
        )}
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.object,
  role: PropTypes.string,
  currentUserId: PropTypes.number,
  toggleStatus: PropTypes.func,
  openDeleteModal: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    openDeleteModal: user => {
      dispatch(showDeleteModal(user));
    }
  };
}

export default connect(null, mapDispatchToProps)(UserRow);
