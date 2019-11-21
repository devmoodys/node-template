import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router";
import cx from "classnames";
import {
  hasSuperAdminAccess,
  hasExclusiveAdminAccess
} from "helpers/authorization";

import { createNewUser } from "ui/store/actions/users";
import { fetchCompanies } from "ui/store/actions/companies";

class NewUserForm extends React.Component {
  componentDidMount() {
    const { loadCompanies, role } = this.props;
    if (hasSuperAdminAccess(role)) {
      loadCompanies();
    }
  }

  render() {
    const { handleSubmit, error, role, companies } = this.props;
    return (
      <form method="post" onSubmit={handleSubmit} className="NewUserForm">
        <ul className="NewUserForm__fields">
          <li className="NewUserForm__email">
            <div>
              <label htmlFor="email" className="NewUserForm__label">
                Email / User Login
              </label>
            </div>
            <div className="NewUserForm__field">
              <Field
                className={cx("NewUserForm__input", {
                  "NewUserForm__input--error": error && error.email
                })}
                component="input"
                type="text"
                placeholder="Email"
                name="email"
              />
              {error &&
                error.email && (
                  <div className="NewUserForm__error">{error.email}</div>
                )}
            </div>
          </li>

          {hasExclusiveAdminAccess(role) && (
            <li className="NewUserForm__role">
              <div>
                <label htmlFor="role" className="NewUserForm__label">
                  Role
                </label>
              </div>
              <div className="NewUserForm__field">
                <Field
                  className={cx("NewUserForm__select", {
                    "NewUserForm__select--error": error && error.role
                  })}
                  component="select"
                  name="role"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Field>
                <div className="NewUserForm__select-caret" />
                {error &&
                  error.role && (
                    <div className="NewUserForm__error">{error.role}</div>
                  )}
              </div>
            </li>
          )}
          {hasSuperAdminAccess(role) && (
            <li className="NewUserForm__company">
              <div>
                <label htmlFor="role" className="NewUserForm__label">
                  Company
                </label>
              </div>
              <div className="NewUserForm__field">
                <Field
                  className={cx("NewUserForm__select", {
                    "NewUserForm__select--error": error && error.companyName
                  })}
                  component="select"
                  name="companyName"
                >
                  <option value="">Select Company</option>
                  {companies.map((company, idx) => (
                    <option
                      key={`option-key-${idx}`}
                      value={company.company_name}
                    >
                      {company.company_name}
                    </option>
                  ))}
                </Field>
                <div className="NewUserForm__select-caret" />
                {error &&
                  error.companyName && (
                    <div className="NewUserForm__error">
                      {error.companyName}
                    </div>
                  )}
              </div>
            </li>
          )}
          <li>
            <input
              type="submit"
              value="Submit"
              className="NewUserForm__submit Button Button--action"
            />
          </li>
        </ul>
      </form>
    );
  }
}

NewUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loadCompanies: PropTypes.func.isRequired,
  error: PropTypes.object,
  companies: PropTypes.array,
  role: PropTypes.string
};

const NewUserReduxForm = reduxForm({
  form: "newUser",
  initialValues: {
    email: "",
    companyName: "",
    role: ""
  }
})(NewUserForm);

function mapStateToProps({ companies, currentUser }) {
  return {
    role: currentUser.role,
    companies: companies.companies
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (values, dispatch, props) => {
      dispatch(createNewUser(values, ownProps.history, props.role));
    },
    loadCompanies: () => {
      dispatch(fetchCompanies());
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewUserReduxForm)
);
