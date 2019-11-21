import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

class LoginFormInner extends React.Component {
  render() {
    const { loginError, inPopup } = this.props;

    const parentClass = inPopup ? "ProvideEmailForm" : "";
    const contentClass = inPopup ? "ProvideEmailForm__content" : "";
    const styleContentElement = inPopup ? { paddingTop: "30px" } : {};

    return (
      <form className={parentClass} method="post" action="/login">
        <div className={contentClass} style={styleContentElement}>
          {this.props.inPopup && (
            <span
              className="ProvideEmailForm__close-button ProvideEmailForm__close-button-login"
              onClick={this.props.closeForm}
            >
              +
            </span>
          )}
          <ul className="LoginFormInner__fields">
            <li>
              <input
                type="text"
                placeholder="Username"
                name="username"
                className="LoginFormInner__input"
              />
            </li>

            <li>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="LoginFormInner__input"
              />
            </li>

            <li>
              <input
                type="submit"
                value="Login"
                className="LoginFormInner__submit"
              />
            </li>
          </ul>
          {loginError && (
            <h3 className="LoginFormInner__error-message">{`error: ${loginError}`}</h3>
          )}
          <br />
          <Link to="/resetPassword">Reset Password</Link>
        </div>
      </form>
    );
  }
}

LoginFormInner.propTypes = {
  inPopup: PropTypes.bool,
  closeForm: PropTypes.func,
  loginError: PropTypes.string
};

export default withRouter(LoginFormInner);
