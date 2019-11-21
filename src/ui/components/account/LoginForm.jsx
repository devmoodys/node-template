import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { emailSalesToSetupCLSUser } from "ui/store/actions/sales";

import LoginModal from "ui/components/account/LoginModal";
import EnterpriseModal from "ui/components/account/EnterpriseModal";
import IndividualModal from "ui/components/account/IndividualModal";

class LoginForm extends React.Component {
  render() {
    const {
      isVerifiedPage,
      clientRequesting,
      login,
      individual,
      enterprise,
      loginError,
      emailSalesToSetupCLSUser,
      token
    } = this.props;
    const parentContainerClass = isVerifiedPage
      ? `LoginForm LoginForm__verified`
      : `LoginForm`;
    const subHeaderClass = isVerifiedPage
      ? `LoginForm__Header-description-longer LoginForm__Header-description`
      : `LoginForm__Header-description`;

    const textHeaderClass = isVerifiedPage
      ? `LoginForm__text-verified`
      : `LoginForm__text`;

    return (
      <div className={parentContainerClass}>
        <div className="LoginForm__content">
          <div className={textHeaderClass}>
            <div className="LoginForm__Header-title">
              Know the score,<br />know the submarket—<br />without ever walking
              the block
            </div>
            <div className={subHeaderClass}>
              {`Empowering smarter commercial real estate decisions through data, analytics, and relentless innovation.`}
            </div>
          </div>
          <div className="LoginForm__image">
            <img src={require("ui/images/moodys-laptop-2.png")} />
          </div>
          {login && <LoginModal loginError={loginError} />}
          {enterprise && (
            <EnterpriseModal clientRequesting={clientRequesting} />
          )}
          {individual && (
            <IndividualModal
              submit={inputEmail => emailSalesToSetupCLSUser(inputEmail, token)}
            />
          )}
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  isVerifiedPage: PropTypes.bool,
  clientRequesting: PropTypes.string,
  userNameRequesting: PropTypes.string,
  loginError: PropTypes.string,
  token: PropTypes.string,
  emailSalesToSetupCLSUser: PropTypes.func,
  login: PropTypes.bool,
  individual: PropTypes.bool,
  enterprise: PropTypes.bool
};

function mapStateToProps({ loginError, mainLoginPage }) {
  return {
    loginError,
    login: mainLoginPage.login,
    individual: mainLoginPage.individual,
    enterprise: mainLoginPage.enterprise
  };
}

function mapDispatchToProps(dispatch) {
  return {
    emailSalesToSetupCLSUser: (username, token) => {
      dispatch(emailSalesToSetupCLSUser(username, token));
    }
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginForm)
);
