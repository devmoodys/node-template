import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { hasSuperAdminAccess } from "helpers/authorization";

import ToggleSwitch from "ui/components/apps/ToggleSwitch";

function UserRow({ user, role, toggleStatus, currentUserId }) {
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
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.object,
  role: PropTypes.string,
  currentUserId: PropTypes.number,
  toggleStatus: PropTypes.func
};

export default UserRow;
