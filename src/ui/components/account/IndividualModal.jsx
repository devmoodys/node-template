import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createUserinIndividualSubWaitlist } from "ui/store/actions/individualSubscription";
import { hideIndividualModal } from "ui/store/actions/mainLoginPage";

class IndividualModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

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

    this.props.hideIndividualModal();
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    if (!this.props.sendEmailOnSubmit) {
      this.props.handleSubmit(this.state.email);
      this.props.hideIndividualModal();
    } else {
      this.props.submit(this.state.email);
      this.props.hideIndividualModal();
    }
  };

  render() {
    return (
      <form className="IndividualModal" ref={node => (this.node = node)}>
        <h2>Request Individual</h2>
        <br />
        <p>
          COMING SOON -- If you are interested in an individual subscription and
          would like to be notified when they become available, please provide
          your email address.
        </p>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={this.state.email}
          onChange={this.handleEmailChange}
          className="ProvideEmailForm__email-input"
        />
        <div
          onClick={e => this.onSubmit(e)}
          className="ProvideEmailForm__submit"
        >
          Submit
        </div>
      </form>
    );
  }
}

IndividualModal.propTypes = {
  handleSubmit: PropTypes.func,
  submit: PropTypes.func,
  hideIndividualModal: PropTypes.func,
  sendEmailOnSubmit: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: function(name) {
      dispatch(createUserinIndividualSubWaitlist(name));
    },
    hideIndividualModal: function() {
      dispatch(hideIndividualModal());
    }
  };
}

export default connect(null, mapDispatchToProps)(IndividualModal);
