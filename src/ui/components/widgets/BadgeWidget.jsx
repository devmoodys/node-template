import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ThreeBounceSpinner from "ui/components/spinners/ThreeBounceSpinner";
import { isURIComponentPresent } from "helpers/presence";
import { parse } from "query-string";
import { getBadge } from "ui/store/actions/badge";
import { sendMessageToParent } from "ui/helpers/messaging";

class BadgeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clsData: {},
      status: "LOADING"
    };
  }
  componentDidMount() {
    getBadge(this.props.location.search)
      .then(responseBody => {
        sendMessageToParent("metropolis.badgeLoaded");
        this.setState({
          clsData: responseBody,
          status: "LOADED"
        });
      })
      .catch(_ => {
        sendMessageToParent("metropolis.badgeFailed");
        this.setState({
          status: "FAILED",
          clsData: {}
        });
      });
  }
  render() {
    const queryObject = parse(this.props.location.search);

    const {
      address,
      lat,
      long,
      userNameRequesting,
      styles,
      type: typeOverride
    } = queryObject;
    let styleObj = isURIComponentPresent(styles)
      ? JSON.parse(decodeURIComponent(styles))
      : {};

    const token = decodeURIComponent(queryObject.token);
    const { clsData, status } = this.state;
    if (status === "LOADING") {
      return <ThreeBounceSpinner type={"small"} />;
    } else {
      const link =
        lat && long
          ? `${
              process.env.CLS_URL
            }?lat=${lat}&long=${long}&styles=${encodeURIComponent(
              styles
            )}&type=${typeOverride}&token=${encodeURIComponent(token)}&getPin=${
              status === "FAILED" ? false : true
            }&clientRequesting=${
              clsData.clientRequesting
            }&userNameRequesting=${userNameRequesting}`
          : `${
              process.env.CLS_URL
            }?address=${address}&styles=${encodeURIComponent(
              styles
            )}&type=${typeOverride}&token=${encodeURIComponent(token)}&getPin=${
              status === "FAILED" ? false : true
            }&clientRequesting=${
              clsData.clientRequesting
            }&userNameRequesting=${userNameRequesting}`;
      const body = queryObject.body;
      const typeContainerClass =
        clsData.type && clsData.type.length > 8
          ? "BadgeWidget__main__container__clsBadge-container__top-section__type-container BadgeWidget__main__container__clsBadge-container__top-section__type-container-long"
          : "BadgeWidget__main__container__clsBadge-container__top-section__type-container";
      const parentStyle = {
        padding: "0",
        border: "1px solid lightgray"
      };

      let scoreStyle = {
        top:
          isURIComponentPresent(typeOverride) || status === "FAILED"
            ? "55px"
            : "43px"
      };
      let hexagonStyle = {};
      let hexagonPatternedStyle = {};
      let typeContainerStyle = {};
      let upperContentStyle = {};
      let containerStyle = {};
      let titleStyle = {};
      let clsBadgeContainerStyle = {};
      let linkContainerStyle = {};

      if (styleObj.width) {
        let width = parseInt(
          styleObj.width.substring(0, styleObj.width.length - 1)
        );
        width = width > 120 ? width : 120; //minimum

        const factor = width / 334;
        containerStyle = { height: parseInt(177 * factor) + "px" };
        scoreStyle = {
          fontSize: parseInt(34 * factor) + "px",
          top:
            (isURIComponentPresent(typeOverride)
              ? parseInt(55 * factor)
              : parseInt(43 * factor)) + "px",
          marginLeft: "1px"
        };
        typeContainerStyle = {
          fontSize: parseInt(14 * factor) + "px",
          top: parseInt(72 * factor) + "px",
          marginTop: parseInt(10 * factor) + "px"
        };
        hexagonStyle = {
          width: parseInt(110 * factor) + "px",
          marginLeft: parseInt(9 * factor) + "px",
          marginTop: parseInt(10 * factor) + "px"
        };
        hexagonPatternedStyle = { width: parseInt(125 * factor) + "px" };
        upperContentStyle = { width: parseInt(185 * factor) - 10 + "px" };
        titleStyle = {
          fontSize: parseInt(24 * factor) + "px",
          lineHeight: parseInt(27 * factor) + "px"
        };
        clsBadgeContainerStyle = {
          marginTop: parseInt(24 * factor) + "px"
        };
        linkContainerStyle = {
          padding: parseInt(10 * factor * 0.9) + "px",
          fontSize: parseInt(13 * factor * 1.2) + "px"
        };
      }

      const customHTMLStyle = styleObj.bodyStyle ? styleObj.bodyStyle : {};
      const backgroundColor = styleObj.backgroundColor
        ? { backgroundColor: styleObj.backgroundColor }
        : {};

      const mainStyle = styleObj.border ? { border: styleObj.border } : {};
      const parentStyleCombined = {
        ...parentStyle,
        ...backgroundColor,
        ...mainStyle
      };
      const linkStyle = styleObj.linkColor ? { color: styleObj.linkColor } : {};
      const { type, locationScore } = this.state.clsData || {};
      return (
        <div className={"BadgeWidget"} style={parentStyleCombined}>
          <div className="BadgeWidget__main">
            <div
              className="BadgeWidget__main__container"
              style={containerStyle}
            >
              <div
                className="BadgeWidget__main__container__clsBadge-container"
                style={clsBadgeContainerStyle}
              >
                <img
                  className="BadgeWidget__main__container__clsBadge-container__hexagon-patterned"
                  src={require("../../images/hex-badge-patterned.svg")}
                  style={hexagonPatternedStyle}
                />
                <div className="BadgeWidget__main__container__clsBadge-container__top-section">
                  <img
                    className="BadgeWidget__main__container__clsBadge-container__top-section__hexagon"
                    style={hexagonStyle}
                    src={require("../../images/hex-badge.png")}
                  />
                  {status === "LOADED" ? (
                    <div>
                      <div
                        className="BadgeWidget__main__container__clsBadge-container__top-section__score"
                        style={scoreStyle}
                      >
                        {locationScore}
                      </div>
                      {isURIComponentPresent(typeOverride) ? null : (
                        <div
                          className={typeContainerClass}
                          style={typeContainerStyle}
                        >
                          <div className="BadgeWidget__main__container__clsBadge-container__top-section__type-container__type">
                            {type}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div
                        className="BadgeWidget__main__container__clsBadge-container__top-section__score"
                        style={scoreStyle}
                      >
                        CLS
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="BadgeWidget__main__container__upper_content_info"
                style={upperContentStyle}
              >
                <div
                  className="BadgeWidget__main__container__upper_content_info__title"
                  style={titleStyle}
                >
                  Commercial Location Score
                </div>
                {isURIComponentPresent(body) && (
                  <div
                    className="BadgeWidget__main__container__upper_content_info__custominfo"
                    style={customHTMLStyle}
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                )}
              </div>
            </div>
            <div
              className="BadgeWidget__main__moody-link__container"
              style={linkContainerStyle}
            >
              <a
                className="BadgeWidget__main__moody-link"
                href={link}
                rel="noopener noreferrer"
                target="_blank"
                style={linkStyle}
              >
                {status === "LOADED"
                  ? "Click to verify with Moody's"
                  : "Click to explore Commercial Location Score"}
              </a>
            </div>
          </div>
        </div>
      );
    }
  }
}

BadgeWidget.propTypes = {
  location: PropTypes.object
};

export default connect(null, null)(BadgeWidget);
