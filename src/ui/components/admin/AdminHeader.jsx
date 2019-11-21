import React, { Component } from "react";

import AccountMenu from "ui/components/account/AccountMenu";

class AdminHeader extends Component {
  redirectToHome = () => {
    window.location.pathname = "/";
  };

  render() {
    return (
      <nav className="AdminHeader">
        <div className="AdminHeader__brand" onClick={this.redirectToHome}>
          <img
            className="AdminHeader__logo"
            src={require("../../images/brand.svg")}
          />
        </div>
        <div className="AdminHeader__right-nav">
          <div
            className="AdminHeader__button Button Button--action"
            onClick={this.redirectToHome}
          >
            Return to Search
          </div>
          <AccountMenu className="AdminHeader__menu" />
        </div>
      </nav>
    );
  }
}

export default AdminHeader;
