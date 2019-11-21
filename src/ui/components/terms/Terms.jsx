import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { acceptTerms } from "ui/store/actions/currentUser";
import Checkbox from "ui/components/shared/Checkbox";
import ReisTerms from "./ReisTerms";
import DefaultTerms from "./DefaultTerms";

export class Terms extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accepted: false };
  }

  toggleAccepted = () => {
    this.setState(previousState => {
      return { accepted: !previousState.accepted };
    });
  };

  render() {
    const { handleAccept, currentUser } = this.props;
    const { accepted } = this.state;
    return (
      <div className="Terms">
        <div className="Terms__body">
          <div className="Terms__title">ACCESS AGREEMENT</div>
          {currentUser.loginTypes[currentUser.loginTypes.length - 1] ===
          "reis" ? (
            <ReisTerms />
          ) : (
            <DefaultTerms />
          )}
        </div>
        <div className="Terms__footer">
          <Checkbox
            className="Terms__check"
            checked={accepted}
            onClick={this.toggleAccepted}
          >
            I accept
          </Checkbox>
          <input
            className="Terms__button"
            type="submit"
            value="Submit"
            onClick={handleAccept}
            disabled={!accepted}
          />
        </div>
      </div>
    );
  }
}

Terms.propTypes = {
  handleAccept: PropTypes.func,
  currentUser: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    handleAccept: function() {
      dispatch(acceptTerms());
    }
  };
}

export default connect(null, mapDispatchToProps)(Terms);
//
