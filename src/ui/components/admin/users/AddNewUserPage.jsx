import React, { Component } from "react";
import AdminLayout from "../AdminLayout";
import { connect } from "react-redux";
import { hasSuperAdminAccess } from "helpers/authorization";
import PropTypes from "prop-types";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";
import NewUserForm from "./NewUserForm";

class AddNewUserPage extends Component {
  render() {
    const { role } = this.props;
    return (
      <AdminLayout
        className="AddNewUserPage"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin" },
          { label: "Manage Users", path: "/admin/users" }
        ]}
        title={`Add ${hasSuperAdminAccess(role) ? "admin" : "user/admin"}`}
      >
        <NewUserForm />
      </AdminLayout>
    );
  }
}

AddNewUserPage.propTypes = {
  role: PropTypes.string
};

function mapStateToProps({ currentUser }) {
  return {
    role: currentUser.role
  };
}

const AddNewUserPageComponent = connect(mapStateToProps)(AddNewUserPage);

export default AuthenticateAdmin(AddNewUserPageComponent);
