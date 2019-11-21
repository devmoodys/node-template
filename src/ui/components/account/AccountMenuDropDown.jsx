import React from "react";
import PropTypes from "prop-types";
import enhanceWithClickOutside from "react-click-outside";
import { connect } from "react-redux";

import { hideDropDown } from "ui/store/actions/accountMenu";

export class AccountMenuDropDown extends React.Component {
  handleClickOutside(event) {
    const { toggleClassName } = this.props;
    if (toggleClassName && event.target.closest(`.${toggleClassName}`)) {
      return;
    }
    this.props.handleClose();
  }

  render() {
    return (
      <div className="AccountMenuDropDown">
        <ul>
          <li>
            <a href="/logout" className="AccountMenuDropDown__item">
              Logout
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

AccountMenuDropDown.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  toggleClassName: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return {
    handleClose: function() {
      dispatch(hideDropDown());
    }
  };
}

const EnhancedAccountMenuDropDown = enhanceWithClickOutside(
  AccountMenuDropDown
);
export default connect(null, mapDispatchToProps)(EnhancedAccountMenuDropDown);
