import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import CompanyRow from "./CompanyRow";
import { fetchCompanies, updateCompany } from "ui/store/actions/companies";

class CompaniesTable extends React.Component {
  componentDidMount() {
    this.props.loadCompanies();
  }

  render() {
    let companies, companyRows;
    if (this.props.companies) {
      companies = this.props.companies;
      companyRows = companies.map((company, i) => {
        return (
          <CompanyRow
            id={company.id}
            name={company.company_name}
            maxActiveUsers={company.max_active_users}
            activeUsers={company.active_users}
            createdAt={company.created_at}
            expiresAt={company.end_date}
            key={`company-row-${i}`}
            updateCompany={this.props.updateCompany}
          />
        );
      });
    } else {
      return <div>Loading...</div>;
    }

    return (
      <div className="CompaniesTable">
        <div className="CompaniesTable__header">
          <div className={cx("CompaniesTable__columnName", "ms-column-1")}>
            Id
          </div>
          <div className={cx("CompaniesTable__columnName", "ms-column-2")}>
            Name
          </div>
          <div className={cx("CompaniesTable__columnName", "ms-column-3")}>
            Active Users
          </div>
          <div className={cx("CompaniesTable__columnName", "ms-column-4")}>
            Max Active Users
          </div>
          <div className={cx("CompaniesTable__columnName", "ms-column-5")}>
            Created At
          </div>
          <div className={cx("CompaniesTable__columnName", "ms-column-6")}>
            Expires At
          </div>
          <div className={cx("CompaniesTable__columnName", "ms-column-7")}>
            Update
          </div>
        </div>
        <div className="CompaniesTable__rows">{companyRows}</div>
      </div>
    );
  }
}

CompaniesTable.propTypes = {
  companies: PropTypes.array,
  loadCompanies: PropTypes.func.isRequired,
  updateCompany: PropTypes.func
};

function mapStateToProps({ companies }) {
  return {
    companies: companies.companies
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadCompanies: () => {
      dispatch(fetchCompanies());
    },
    updateCompany: (companyId, endDate, maxActiveUsers) => {
      dispatch(updateCompany(companyId, endDate, maxActiveUsers));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesTable);
