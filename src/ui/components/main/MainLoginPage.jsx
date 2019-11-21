import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import cx from "classnames";
import LoginLayout from "./LoginLayout";
import LoginForm from "ui/components/account/LoginForm";
import MainLoginPageInfoFooter from "./MainLoginPageInfoFooter";
import MainLoginPageInfoDetail from "./MainLoginPageInfoDetail";
import AboutSection from "./AboutSection";
import PopUpPreview from "../popup/PopUpPreview.js";
import { isBlank } from "helpers/presence.js";
import { withRouter } from "react-router";
import { getBadge } from "ui/store/actions/badge";
import { cleanMatch } from "ui/helpers/formatters";
import { parse } from "query-string";
import { usernameTokenLogin } from "ui/store/actions/login";
import Flash from "ui/components/notification/Flash";

class MainLoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clsData: {}
    };
  }

  componentDidMount() {
    if (this.props.isVerifiedPage) {
      usernameTokenLogin(this.props.location.search);
      this.setCLSData(); // => set
    }
  }
  render() {
    const {
      clientRequesting,
      userNameRequesting,
      token,
      type: typeOverride
    } = parse(this.props.location.search);
    const { isVerifiedPage } = this.props;
    return (
      <LoginLayout className={cx("MainLoginPage", this.props.className)}>
        <Flash />
        {isVerifiedPage &&
          this.state &&
          !isBlank(this.state.clsData) && (
            <PopUpPreview
              address={cleanMatch(this.state.clsData.match.html)}
              type={this.state.clsData.type}
              score={this.state.clsData.locationScore}
              properties={this.state.clsData}
              typeOverride={typeOverride}
            />
          )}
        <LoginForm
          isVerifiedPage={isVerifiedPage}
          clientRequesting={clientRequesting}
          userNameRequesting={userNameRequesting}
          token={token}
        />
        <div className="MainLoginPage__info">
          <MainLoginPageInfoDetail />
          <AboutSection />
          <MainLoginPageInfoFooter />
        </div>
      </LoginLayout>
    );
  }
  setCLSData = () => {
    getBadge(this.props.location.search)
      .then(responseBody => {
        this.setState({
          clsData: responseBody,
          status: "LOADED"
        });
      })
      .catch(_ => {
        this.setState({
          status: "FAILED",
          clsData: {}
        });
      });
  };
}

MainLoginPage.propTypes = {
  isVerifiedPage: PropTypes.bool,
  className: PropTypes.string,
  location: PropTypes.object,
  usernameTokenLogin: PropTypes.func
};

export default withRouter(connect(null, null)(MainLoginPage));
