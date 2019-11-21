import React, { Component } from "react";
import { connect } from "react-redux";
import AdminLayout from "./AdminLayout";
import PropTypes from "prop-types";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";
import AdminTool from "ui/components/admin/AdminTool";

class AdminHomePage extends Component {
  render() {
    const { company, role } = this.props.currentUser;
    const companyName = company === null ? "" : `: ${company.company_name}`;
    return (
      <AdminLayout
        className="AdminHomePage"
        title={`Admin Dashboard${companyName}`}
      >
        <div className="AdminHomePage__tools">
          <AdminTool label="Manage Users" className="users" to="/admin/users" />
          {role === "superadmin" && (
            <AdminTool
              label="Companies"
              className="users"
              to="/admin/companies"
            />
          )}
          <AdminTool
            label="View Interchange Adapters"
            className="adapters"
            to="/admin/adapters"
          />
        </div>
      </AdminLayout>
    );
  }
}

AdminHomePage.propTypes = {
  currentUser: PropTypes.object
};

function mapStateToProps({ currentUser }) {
  return {
    currentUser
  };
}

const AdminHomePageComponent = AuthenticateAdmin(AdminHomePage);

export default connect(mapStateToProps)(AdminHomePageComponent);
