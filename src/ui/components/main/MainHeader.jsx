import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import SearchWidget from "ui/components/widgets/SearchWidget";
import AccountMenu from "ui/components/account/AccountMenu";
import NavLink from "ui/components/shared/NavLink";

class MainHeader extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <nav className="MainHeader">
        <NavLink to="/" className="MainHeader__brand">
          <img
            className="MainHeader__logo"
            src={require("../../images/brand.svg")}
          />
        </NavLink>

        {this.props.location.pathname.includes("resetPassword") ? null : (
          <SearchWidget />
        )}
        <div className="MainHeader__right-nav">
          {authenticated && <AccountMenu className="MainHeader__menu" />}
        </div>
      </nav>
    );
  }
}

MainHeader.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  role: PropTypes.string,
  location: PropTypes.object
};

function mapStateToProps({ authenticated, currentUser }) {
  return {
    authenticated,
    role: currentUser.role
  };
}

export default withRouter(connect(mapStateToProps)(MainHeader));
