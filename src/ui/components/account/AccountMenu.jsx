import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { connect } from "react-redux";

import AccountMenuDropDown from "./AccountMenuDropDown";

import { toggleDropDown } from "ui/store/actions/accountMenu";

function AccountMenu({
  className,
  userEmail,
  toggleAccountMenu,
  showDropDown
}) {
  return (
    <nav className={cx("AccountMenu", className)}>
      <div className="AccountMenu__inner" onClick={toggleAccountMenu}>
        <div className="AccountMenu__email">{userEmail}</div>
        <img
          src={require("../../images/icon-account-white.svg")}
          className="AccountMenu__icon"
        />
      </div>
      {showDropDown && (
        <AccountMenuDropDown toggleClassName="AccountMenu__inner" />
      )}
    </nav>
  );
}

AccountMenu.propTypes = {
  className: PropTypes.string,
  userEmail: PropTypes.string,
  toggleAccountMenu: PropTypes.func,
  showDropDown: PropTypes.bool
};

function mapStateToProps({ currentUser, accountMenu }) {
  const { email } = currentUser;
  const { dropDown } = accountMenu;
  return {
    userEmail: email,
    showDropDown: dropDown
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleAccountMenu: function() {
      dispatch(toggleDropDown());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountMenu);
