import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideEnterpriseModal } from "ui/store/actions/mainLoginPage";

class EnterpriseModal extends React.Component {
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

    this.props.hideEnterpriseModal();
  };

  render() {
    const { clientRequesting } = this.props;
    const sourceMap = {
      catylist: "https://go.reis.com/l/502061/2019-05-28/42k9yz",
      reis: "https://go.reis.com/l/502061/2019-05-06/3xzl1d"
    };
    const source =
      sourceMap[clientRequesting] ||
      "https://go.reis.com/l/502061/2019-05-28/42kb2b";

    return (
      <div className="EnterpriseModal" ref={node => (this.node = node)}>
        <h2>Sign up for Enterprise</h2>
        <br />
        <p>
          If you are interested in an Enterprise license, please provide your
          email address and a member of our Customer Success team will contact
          you to discuss our group licensing packages.
        </p>
        <br />
        <iframe src={source} className="EnterpriseModal__iframe" />
      </div>
    );
  }
}

EnterpriseModal.propTypes = {
  clientRequesting: PropTypes.string,
  hideEnterpriseModal: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    hideEnterpriseModal: function() {
      dispatch(hideEnterpriseModal());
    }
  };
}

export default connect(null, mapDispatchToProps)(EnterpriseModal);
