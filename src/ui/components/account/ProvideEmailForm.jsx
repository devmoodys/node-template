import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import LoginFormInner from "ui/components/account/LoginFormInner";
import { createUserinIndividualSubWaitlist } from "ui/store/actions/individualSubscription";

class ProvideEmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }
  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.closeForm();

    if (!this.props.sendEmailOnSubmit) {
      this.props.handleSubmit(this.state.email);
    } else {
      this.props.submit(this.state.email);
    }
  };

  render() {
    const { closeForm } = this.props;
    if (this.props.isSignInForm) {
      return (
        <LoginFormInner
          closeForm={closeForm}
          inPopup={true}
          loginError={this.props.loginError}
        />
      );
    }
    return (
      <form className="ProvideEmailForm">
        <div className="ProvideEmailForm__content">
          <span className="ProvideEmailForm__close-button" onClick={closeForm}>
            +
          </span>
          <div className="ProvideEmailForm__title">{this.props.title}</div>
          <div className="ProvideEmailForm__description">
            {this.props.description}
          </div>
          {this.props.showLocalSubmitEmailForm && (
            <ul className="ProvideEmailForm__fields">
              <li>
                <div>
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                    className="ProvideEmailForm__email-input"
                  />
                </div>
              </li>
              <li>
                <div
                  onClick={e => this.onSubmit(e)}
                  className="ProvideEmailForm__submit"
                >
                  Submit
                </div>
              </li>
            </ul>
          )}
        </div>
      </form>
    );
  }
}

ProvideEmailForm.propTypes = {
  closeForm: PropTypes.func,
  title: PropTypes.string,
  submit: PropTypes.func,
  description: PropTypes.string,
  sendEmailOnSubmit: PropTypes.bool,
  isSignInForm: PropTypes.bool,
  loginError: PropTypes.string,
  handleSubmit: PropTypes.func,
  token: PropTypes.string,
  showLocalSubmitEmailForm: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: function(name) {
      dispatch(createUserinIndividualSubWaitlist(name));
    }
  };
}

export default connect(null, mapDispatchToProps)(ProvideEmailForm);
