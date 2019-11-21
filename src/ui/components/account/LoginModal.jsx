import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { hideLoginModal } from "ui/store/actions/mainLoginPage";

class LoginModal extends React.Component {
  componentDidMount() {
    document.addEventListener("mousedown", this.clickOutsideModal, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutsideModal, false);
  }

  clickOutsideModal = e => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.props.hideLoginModal();
  };

  render() {
    const { loginError } = this.props;

    return (
      <form
        ref={node => (this.node = node)}
        className="LoginModal"
        method="post"
        action="/login"
      >
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="LoginFormInner__input"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="LoginFormInner__input"
        />
        <input type="submit" value="Login" className="LoginFormInner__submit" />
        {loginError && (
          <h3 className="LoginFormInner__error-message">{`error: ${loginError}`}</h3>
        )}
        <Link to="/resetPassword">Reset Password</Link>
      </form>
    );
  }
}

LoginModal.propTypes = {
  loginError: PropTypes.string,
  hideLoginModal: PropTypes.func
};

function mapStateToProps({ mainLoginPage }) {
  return {
    login: mainLoginPage.login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideLoginModal: function() {
      dispatch(hideLoginModal());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
