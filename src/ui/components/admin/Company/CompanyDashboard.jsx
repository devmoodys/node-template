import React, { Component } from "react";
import AdminLayout from "../AdminLayout";
import { connect } from "react-redux";
import NavLink from "ui/components/shared/NavLink";
import CompaniesTable from "./CompaniesTable";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";

class CompanyDashboard extends Component {
  render() {
    return (
      <AdminLayout
        className="CompanyDashboard"
        breadcrumbs={[{ label: "Dashboard", path: "/admin" }]}
        title="Company Dashboard"
      >
        <div className="CompanyDashboard__new-user-button-container">
          <NavLink
            className="CompanyDashboard__new-user-button Button Button--action"
            to="/admin/companies/new"
          >
            Add New Company
          </NavLink>
        </div>
        <CompaniesTable />
      </AdminLayout>
    );
  }
}

const CompanyDashboardComponent = AuthenticateAdmin(CompanyDashboard);

export default connect(null)(CompanyDashboardComponent);
