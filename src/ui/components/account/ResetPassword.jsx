import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { parse } from "query-string";
import { requestPasswordChange, resetPassword } from "ui/store/actions/users";
import Flash from "ui/components/notification/Flash";
import MainLayout from "ui/components/main/MainLayout";

const RESETTING = "RESETTING";
const REQUESTING = "REQUESTING";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    const { token, email, tempPassword } = parse(this.props.location.search);
    const status = token && email && tempPassword ? RESETTING : REQUESTING;
    this.state = {
      newPassword: "",
      newPasswordConfirm: "",
      requestEmail: "",
      status
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    const { status, newPassword, newPasswordConfirm } = this.state;
    const { requestPasswordChange, resetPassword } = this.props;
    if (status === RESETTING) {
      if (newPassword !== newPasswordConfirm) {
        alert("New password and confirmed password are not the same!");
        return;
      }
      const { token, email, tempPassword } = parse(this.props.location.search);
      resetPassword(email, tempPassword, newPassword, token);
    } else if (status === REQUESTING) {
      requestPasswordChange(this.state.requestEmail);
    }
  };
  handleEmailChange = e => {
    this.setState({ requestEmail: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ newPassword: e.target.value });
  };
  handlePasswordConfirmChange = e => {
    this.setState({ newPasswordConfirm: e.target.value });
  };
  render() {
    return (
      <MainLayout>
        <Flash />
        <form onSubmit={this.handleSubmit} className="ResetPassword">
          <ul className="ResetPassword__fields">
            <li className="ResetPassword__email">
              <div>
                <label htmlFor="email" className="ResetPassword__label">
                  {this.state.status === REQUESTING
                    ? "Email"
                    : "Please Reset Your Password"}
                </label>
              </div>
              {this.state.status === REQUESTING ? (
                <div className="ResetPassword__field">
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={this.state.requestEmail}
                    onChange={this.handleEmailChange}
                    className="ResetPassword__input"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="ResetPassword__field">
                  <input
                    type="password"
                    placeholder="New Password"
                    name="new password"
                    value={this.state.newPassword}
                    onChange={this.handlePasswordChange}
                    className="ResetPassword__input"
                    autoFocus
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    name="confirm new password"
                    value={this.state.newPasswordConfirm}
                    onChange={this.handlePasswordConfirmChange}
                    className="ResetPassword__input"
                  />
                </div>
              )}
            </li>
            <li>
              <input
                type="submit"
                value="Submit"
                className="ResetPassword__submit Button Button--action"
              />
            </li>
          </ul>
        </form>
      </MainLayout>
    );
  }
}

ResetPassword.propTypes = {
  requestPasswordChange: PropTypes.func,
  resetPassword: PropTypes.func,
  location: PropTypes.object
};

const mapDispatchToProps = dispatch => {
  return {
    requestPasswordChange: email => {
      dispatch(requestPasswordChange(email));
    },
    resetPassword: (email, tempPassword, newPassword, token) => {
      dispatch(resetPassword(email, tempPassword, newPassword, token));
    }
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ResetPassword));
