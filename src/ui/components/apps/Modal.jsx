import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import enhanceWithClickOutside from "react-click-outside";

export class Modal extends React.Component {
  handleClickOutside(event) {
    const { toggleClassName } = this.props;
    if (toggleClassName && event.target.classList.contains(toggleClassName)) {
      return;
    }
    this.props.handleClose();
  }

  render() {
    const { children, className, isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <div className={cx("Modal", className)}>
        <div className="Modal__point" />
        {children}
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleClassName: PropTypes.string
};

export default enhanceWithClickOutside(Modal);
