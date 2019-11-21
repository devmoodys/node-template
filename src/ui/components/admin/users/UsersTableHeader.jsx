import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { hasSuperAdminAccess } from "helpers/authorization";

export default function UsersTableHeader({ role }) {
  return (
    <div
      className={`UsersTable__header${
        hasSuperAdminAccess(role) ? "-superadmin" : ""
      }`}
    >
      <div className={cx("UsersTable__columnName", "ms-column-1")}>
        User Login
      </div>
      <div className={cx("UsersTable__columnName", "ms-column-2")}>Role</div>
      {hasSuperAdminAccess(role) && (
        <div className={cx("UsersTable__columnName", "ms-column-3")}>
          Company
        </div>
      )}
      <div
        className={cx(
          "UsersTable__columnName-center",
          { "ms-column-4": hasSuperAdminAccess(role) },
          { "ms-column-3": !hasSuperAdminAccess(role) }
        )}
      >
        Status
      </div>
      <div
        className={cx(
          "UsersTable__columnName-center",
          { "ms-column-5": hasSuperAdminAccess(role) },
          { "ms-column-4": !hasSuperAdminAccess(role) }
        )}
      >
        Delete
      </div>
    </div>
  );
}

UsersTableHeader.propTypes = {
  role: PropTypes.string
};
