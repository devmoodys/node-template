import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import NavLink from "ui/components/shared/NavLink";
import Button from "ui/components/shared/Button";

import {
  showLoginModal,
  hideLoginModal,
  showIndividualModal,
  hideIndividualModal,
  showEnterpriseModal,
  hideEnterpriseModal
} from "ui/store/actions/mainLoginPage";

class LoginHeader extends Component {
  constructor(props) {
    super(props);
  }

  handleLogin = () => {
    const { showLoginModal, hideLoginModal, login } = this.props;

    if (!login) {
      showLoginModal();
    } else {
      hideLoginModal();
    }
  };

  handleIndividual = () => {
    const { showIndividualModal, hideIndividualModal, individual } = this.props;

    if (!individual) {
      showIndividualModal();
    } else {
      hideIndividualModal();
    }
  };

  handleEnterprise = () => {
    const { showEnterpriseModal, hideEnterpriseModal, enterprise } = this.props;

    if (!enterprise) {
      showEnterpriseModal();
    } else {
      hideEnterpriseModal();
    }
  };

  render() {
    return (
      <nav className="MainHeader">
        <NavLink to="/" className="MainHeader__brand">
          <img
            className="MainHeader__logo"
            src={require("../../images/brand.svg")}
          />
        </NavLink>
        <div className="MainHeader__right-nav">
          <Button
            className="LoginHeader__loginButton"
            onClick={this.handleLogin}
          >
            Login
          </Button>
          <Button
            className="LoginHeader__enterpriseButton"
            onClick={this.handleEnterprise}
          >
            Enterprise
          </Button>
          <Button
            className="LoginHeader__individualButton"
            onClick={this.handleIndividual}
          >
            Individual
          </Button>
        </div>
      </nav>
    );
  }
}

LoginHeader.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  role: PropTypes.string,
  toggleLogin: PropTypes.func,
  showLoginModal: PropTypes.func,
  hideLoginModal: PropTypes.func,
  showIndividualModal: PropTypes.func,
  hideIndividualModal: PropTypes.func,
  showEnterpriseModal: PropTypes.func,
  hideEnterpriseModal: PropTypes.func,
  login: PropTypes.bool,
  enterprise: PropTypes.bool,
  individual: PropTypes.bool
};

function mapStateToProps({ authenticated, currentUser, mainLoginPage }) {
  return {
    authenticated,
    role: currentUser.role,
    login: mainLoginPage.login,
    individual: mainLoginPage.individual
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showLoginModal: function() {
      dispatch(showLoginModal());
    },
    hideLoginModal: function() {
      dispatch(hideLoginModal());
    },
    showIndividualModal: function() {
      dispatch(showIndividualModal());
    },
    hideIndividualModal: function() {
      dispatch(hideIndividualModal());
    },
    showEnterpriseModal: function() {
      dispatch(showEnterpriseModal());
    },
    hideEnterpriseModal: function() {
      dispatch(hideEnterpriseModal());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginHeader);
