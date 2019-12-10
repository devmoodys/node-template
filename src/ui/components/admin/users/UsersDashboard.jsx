import React, { Component } from "react";
import AdminLayout from "../AdminLayout";
import { connect } from "react-redux";
import NavLink from "ui/components/shared/NavLink";
import UsersTable from "./UsersTable";
import PropTypes from "prop-types";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";

class UsersDashboard extends Component {
  render() {
    const { company } = this.props;
    const companyName = company === null ? "" : `: ${company.company_name}`;
    return (
      <AdminLayout
        className="UsersDashboard"
        breadcrumbs={[{ label: "Dashboard", path: "/admin" }]}
        title={`Manage Users${companyName}`}
      >
        <div className="UsersDashboard__new-user-button-container">
          <NavLink
            className="UsersDashboard__new-user-button Button Button--action"
            to="/admin/users/new"
          >
            Add New User
          </NavLink>
        </div>
        <UsersTable />
      </AdminLayout>
    );
  }
}

UsersDashboard.propTypes = {
  company: PropTypes.object
};

function mapStateToProps({ currentUser }) {
  return {
    company: currentUser.company
  };
}

const UsersDashboardComponent = AuthenticateAdmin(UsersDashboard);

export default connect(mapStateToProps)(UsersDashboardComponent);
