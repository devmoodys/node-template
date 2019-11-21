import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function UsersTableFilters({
  filterRole,
  filterCompany,
  filterStatus,
  companies
}) {
  return (
    <div className="UsersTable__filter-superadmin">
      <div
        className={cx(
          "UsersTable__filter-superadmin__columnName",
          "ms-column-2"
        )}
      >
        <select type="select" onChange={filterRole.bind(this)}>
          <option value="all">all</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="superadmin">superadmin</option>
        </select>
      </div>
      <div
        className={cx(
          "UsersTable__filter-superadmin__columnName",
          "ms-column-3"
        )}
      >
        <select type="select" onChange={filterCompany.bind(this)}>
          <option value="all">all</option>
          {companies.map((company, idx) => {
            const { company_name, id } = company;
            return (
              <option key={`company-option-${idx}`} value={id}>
                {company_name}
              </option>
            );
          })}
        </select>
      </div>
      <div
        className={cx(
          "ms-column-4",
          "UsersTable__filter-superadmin__columnName",
          "center"
        )}
      >
        <select type="select" onChange={filterStatus.bind(this)}>
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>
    </div>
  );
}

UsersTableFilters.propTypes = {
  filterRole: PropTypes.func.isRequired,
  filterCompany: PropTypes.func.isRequired,
  filterStatus: PropTypes.func.isRequired,
  companies: PropTypes.array
};
