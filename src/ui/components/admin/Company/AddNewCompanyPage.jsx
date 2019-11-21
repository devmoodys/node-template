import React, { Component } from "react";
import AdminLayout from "../AdminLayout";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";
import NewCompanyForm from "./NewCompanyForm";

class AddNewCompanyPage extends Component {
  render() {
    return (
      <AdminLayout
        className="AddNewCompanyPage"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin" },
          { label: "Company Dashboard", path: "/admin/companies" }
        ]}
        title="Add Company"
      >
        <NewCompanyForm />
      </AdminLayout>
    );
  }
}

export default AuthenticateAdmin(AddNewCompanyPage);
