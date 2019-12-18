import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ThreeBounceSpinner from "ui/components/spinners/ThreeBounceSpinner";
import { isURIComponentPresent } from "helpers/presence";
import { parse } from "query-string";
import { getBadge } from "ui/store/actions/badge";
import { sendMessageToParent } from "ui/helpers/messaging";

class BadgeWidgetV2 extends React.Component {
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
  generateOriginalBadgeContainer = queryObject => {
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
              process.env.METROPOLIS_URL
            }?lat=${lat}&long=${long}&styles=${encodeURIComponent(
              styles
            )}&type=${typeOverride}&token=${encodeURIComponent(token)}&getPin=${
              status === "FAILED" ? false : true
            }&clientRequesting=${
              clsData.clientRequesting
            }&userNameRequesting=${userNameRequesting}`
          : `${
              process.env.METROPOLIS_URL
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
        <div className={"BadgeWidgetV2"} style={parentStyleCombined}>
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
  };

  getBadgeIcon = (color, showScore, locationScore) => {
    const iconImage = (
      <img
        className={"BadgeWidget__badgeIcon__image"}
        src={require(`../../images/badge-icon-${color}.svg`)}
      />
    );
    if (!showScore || !locationScore) {
      return iconImage;
    } else {
      return (
        <span className={"BadgeWidget__badgeIcon"}>
          {iconImage}
          <span className={"BadgeWidget__badgeIcon__score"}>
            {locationScore}
          </span>
        </span>
      );
    }
  };

  getBadgeHexagon = (size, color, locationScore, includeHeader) => {
    const badgeImage = (
      <img
        className={"BadgeWidget__badgeHexagon__image"}
        src={require(`../../images/badge-hexagon-${size}-${color}.svg`)}
      />
    );
    const badgeStyle = { color: color == "white" ? "#0c3693" : "white" };
    const showHeaderClass = includeHeader
      ? "BadgeWidget__badgeHexagon__score__with-title"
      : "";
    const badgeHexagon = (
      <div className={"BadgeWidget__badgeHexagon"}>
        {badgeImage}
        <div
          className={`BadgeWidget__badgeHexagon__main BadgeWidget__badgeHexagon__main__${color} BadgeWidget__badgeHexagon__main__${size}`}
          style={badgeStyle}
        >
          {locationScore ? (
            <div>
              <div
                className={`BadgeWidget__badgeHexagon__score ${showHeaderClass} BadgeWidget__badgeHexagon__score__${size}`}
              >
                {locationScore}
              </div>
              {!includeHeader && (
                <div
                  className={`BadgeWidget__badgeHexagon__CLSText BadgeWidget__badgeHexagon__CLSText__${size}`}
                >
                  CLS
                </div>
              )}
            </div>
          ) : (
            <div
              className={`BadgeWidget__badgeHexagon__score ${showHeaderClass} BadgeWidget__badgeHexagon__score__${size} BadgeWidget__CLSText__${size}__no-score`}
            >
              CLS
            </div>
          )}
        </div>
      </div>
    );

    if (includeHeader) {
      const combination = (
        <div className={"BadgeWidget__badgeHexagon__header"}>
          {badgeHexagon}
          <div className={`BadgeWidget__badgeHexagon__header__text`}>
            Commercial Location Score
          </div>
        </div>
      );
      return combination;
    } else {
      return badgeHexagon;
    }
  };

  getBadgeContainer = (
    fullWidth,
    color,
    locationScore,
    customMiddleColumnText
  ) => {
    const narrowWidth = (
      <div className={"BadgeWidget__badgeContainer"}>
        <div className={"BadgeWidget__badgeContainer__hexagon-container"}>
          {this.getBadgeHexagon("large", color, locationScore, false)}
        </div>
        <div className={"BadgeWidget__badgeContainer__content"}>
          <div className={"BadgeWidget__badgeContainer__content__verified"}>
            <img
              className={"BadgeWidget__badgeHexagon"}
              src={require(`../../images/badge-verify-button.svg`)}
            />
          </div>
          <div
            className={"BadgeWidget__badgeContainer__content__icon-and-header"}
          >
            {this.getBadgeIcon("white", false)}
            <div
              className={`BadgeWidget__badgeContainer__content__header BadgeWidget__badgeHeader BadgeWidget__badgeHeader-container BadgeWidget__badgeHeader-blue`}
            >
              Commercial Location Score
            </div>
          </div>
          <div className={"BadgeWidget__badgeContainer__content__learn-more"}>
            <img
              className={"BadgeWidget__badgeHexagon"}
              src={require(`../../images/badge-learn-more-button.svg`)}
            />
          </div>
        </div>
      </div>
    );

    if (!fullWidth) {
      return narrowWidth;
    } else {
      const defaultMiddleColText =
        "An innovative new quantitative scoring tool that objectively assesses property desirability.";
      return (
        <div className={"BadgeWidget__badgeContainer__container-full-width"}>
          {narrowWidth}

          <div className={"BadgeWidget__badgeContainer__middle-column"}>
            <div
              className={
                "BadgeWidget__badgeContainer__middle-column__logo-container"
              }
            >
              <img
                className={"BadgeWidget__middle-column__logo"}
                src={require(`../../images/moodys-analytics-logo.svg`)}
              />
            </div>
            <div
              className={"BadgeWidget__badgeContainer__middle-column__blurb"}
            >
              {customMiddleColumnText || defaultMiddleColText}
            </div>
          </div>
          <div className={"BadgeWidget__badgeContainer__third-column"}>
            <div className={"BadgeWidget__badgeContainer__third-column__title"}>
              Subcomponents
            </div>
            <img
              className={"BadgeWidget__badgeContainer__third-column__donut"}
              src={require(`../../images/donut-for-badge.png`)}
            />
          </div>
        </div>
      );
    }
  };

  render() {
    const queryObject = parse(this.props.location.search);
    const { badgeType, middleColumnText } = queryObject;
    const { status } = this.state;
    let { locationScore } = this.state.clsData || {};
    if (badgeType.includes("icon")) {
      let showScore = null;
      if (badgeType.includes("score") && status === "LOADED" && locationScore) {
        showScore = true;
      }
      switch (badgeType) {
        case "icon-blue":
          return this.getBadgeIcon("blue", showScore);
        case "icon-with-score":
          return this.getBadgeIcon("white", showScore, locationScore);
        case "icon-with-score-blue":
          return this.getBadgeIcon("blue", showScore, locationScore); // showScore, locationScore);
        default:
          return this.getBadgeIcon("white", showScore);
      }
    } else if (badgeType.includes("hexagon")) {
      let showHeader = null;
      if (badgeType.includes("header")) {
        showHeader = true;
      }
      switch (badgeType) {
        case "hexagon-small":
          return this.getBadgeHexagon(
            "small",
            "white",
            locationScore,
            showHeader
          );
        case "hexagon-small-blue":
          return this.getBadgeHexagon(
            "small",
            "blue",
            locationScore,
            showHeader
          );
        case "hexagon-medium":
          return this.getBadgeHexagon(
            "medium",
            "white",
            locationScore,
            showHeader
          );
        case "hexagon-medium-blue":
          return this.getBadgeHexagon(
            "medium",
            "blue",
            locationScore,
            showHeader
          );
        case "hexagon-large":
          return this.getBadgeHexagon(
            "large",
            "white",
            locationScore,
            showHeader
          );
        case "hexagon-large-blue":
          return this.getBadgeHexagon(
            "large",
            "blue",
            locationScore,
            showHeader
          );
        case "hexagon-with-header":
          return this.getBadgeHexagon(
            "small",
            "white",
            locationScore,
            showHeader
          );
        case "hexagon-with-header-blue":
          return this.getBadgeHexagon(
            "small",
            "blue",
            locationScore,
            showHeader
          );
        default:
          return this.getBadgeHexagon("small", "white", null, false); // will just show badge with CLS instead of #
      }
    } else if (badgeType.includes("container")) {
      let fullWidth = false;
      if (badgeType.includes("full-width")) {
        fullWidth = true;
      }
      switch (badgeType) {
        case "badge-container":
          return this.getBadgeContainer(fullWidth, "white", locationScore);
        case "badge-container-blue":
          return this.getBadgeContainer(fullWidth, "blue", locationScore);
        case "badge-container-full-width":
          return this.getBadgeContainer(
            fullWidth,
            "white",
            locationScore,
            middleColumnText
          );
        case "badge-container-full-width-blue":
          return this.getBadgeContainer(
            fullWidth,
            "blue",
            locationScore,
            middleColumnText
          );
        default:
          return this.getBadgeContainer(false, "white", null);
      }
    } else {
      this.generateOriginalBadgeContainer(queryObject);
    }
  }
}

BadgeWidgetV2.propTypes = {
  location: PropTypes.object
};

export default connect(null, null)(BadgeWidgetV2);
