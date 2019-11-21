import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router";
import cx from "classnames";

import { createNewCompany } from "ui/store/actions/companies";

function NewCompanyForm({ handleSubmit, error }) {
  return (
    <form method="post" onSubmit={handleSubmit} className="NewCompanyForm">
      <ul className="NewCompanyForm__fields">
        <li className="NewCompanyForm__list">
          <div>
            <label htmlFor="email" className="NewCompanyForm__label">
              Company Name
            </label>
          </div>
          <div className="NewCompanyForm__field">
            <Field
              className={cx("NewCompanyForm__input", {
                "NewCompanyForm__input--error": error && error.companyName
              })}
              component="input"
              type="text"
              name="companyName"
            />
            {error &&
              error.email && (
                <div className="NewCompanyForm__error">{error.companyName}</div>
              )}
          </div>
        </li>
        <li className="NewCompanyForm__list">
          <div>
            <label htmlFor="role" className="NewCompanyForm__label">
              Max Active Users
            </label>
          </div>
          <div className="NewCompanyForm__field">
            <Field
              className={cx("NewCompanyForm__input", {
                "NewCompanyForm__input--error": error && error.maxActiveUsers
              })}
              component="input"
              type="number"
              name="maxActiveUsers"
            />
            {error &&
              error.maxActiveUsers && (
                <div className="NewCompanyForm__error">
                  {error.maxActiveUsers}
                </div>
              )}
          </div>
        </li>
        <li className="NewCompanyForm__list">
          <div>
            <label htmlFor="role" className="NewCompanyForm__label">
              Account Active Length
            </label>
          </div>
          <div className="NewCompanyForm__field">
            <Field
              className={cx("NewCompanyForm__input", {
                "NewCompanyForm__input--error":
                  error && error.accountActiveLengthAmmount
              })}
              component="input"
              type="number"
              name="accountActiveLengthAmmount"
            />
            {error &&
              error.accountActiveLengthAmmount && (
                <div className="NewCompanyForm__error">
                  {error.accountActiveLengthAmmount}
                </div>
              )}
          </div>
        </li>
        <li className="NewCompanyForm__list">
          <div>
            <label htmlFor="role" className="NewCompanyForm__label">
              Account Active Length Type
            </label>
          </div>
          <div className="NewCompanyForm__field">
            <Field
              className={cx("NewCompanyForm__select", {
                "NewCompanyForm__select--error": error && error.maxActiveUsers
              })}
              component="select"
              name="accountActiveLengthType"
            >
              <option value="">Select Type</option>
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </Field>
            <div className="NewCompanyForm__select-caret" />
            {error &&
              error.maxActiveUsers && (
                <div className="NewCompanyForm__error">
                  {error.maxActiveUsers}
                </div>
              )}
          </div>
        </li>
        <li>
          <input
            type="submit"
            value="Submit"
            className="NewCompanyForm__submit Button Button--action"
          />
        </li>
      </ul>
    </form>
  );
}

NewCompanyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
};

const NewUserReduxForm = reduxForm({
  form: "newCompany",
  initialValues: {
    companyName: "",
    maxActiveUsers: 5,
    accountActiveLengthAmmount: 1,
    accountActiveLengthType: "year"
  }
})(NewCompanyForm);

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (values, dispatch) => {
      dispatch(createNewCompany(values, ownProps.history));
    }
  };
};

export default withRouter(connect(null, mapDispatchToProps)(NewUserReduxForm));
