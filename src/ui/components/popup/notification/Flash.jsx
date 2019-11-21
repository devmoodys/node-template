import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import enhanceWithClickOutside from "react-click-outside";
import { clearFlash } from "ui/store/actions/flash";
import classNames from "classnames";

export class Flash extends React.Component {
  handleClickOutside() {
    const { clearFlash } = this.props;
    clearFlash();
  }

  render() {
    const { type, message, clearFlash } = this.props;

    if (!type || !message) {
      return null;
    }
    const flashClass = classNames("Flash", `Flash--${type}`);

    return (
      <div className={flashClass}>
        <div className="Flash__close-flash-button-container">
          <img
            src={require("../../images/icon-close.svg")}
            className="Flash__close-flash-button"
            onClick={_ => {
              clearFlash();
            }}
          />
        </div>
        <div className="Flash__message">{message}</div>
      </div>
    );
  }
}

Flash.propTypes = {
  type: PropTypes.string,
  message: PropTypes.node,
  clearFlash: PropTypes.func
};

function mapStateToProps(state) {
  const { flash } = state;
  return flash;
}

function mapDispatchToProps(dispatch) {
  return {
    clearFlash: () => dispatch(clearFlash())
  };
}

const EnhancedFlash = enhanceWithClickOutside(Flash);
export default connect(mapStateToProps, mapDispatchToProps)(EnhancedFlash);
