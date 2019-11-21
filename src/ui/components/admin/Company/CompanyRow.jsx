import React from "react";
import moment from "moment";
import cx from "classnames";
import PropTypes from "prop-types";
import Button from "ui/components/shared/Button";
import { SingleDatePicker } from "react-dates";

export default class CompanyRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      maxActiveUsers: props.maxActiveUsers,
      endDate: moment(props.expiresAt)
    };
  }

  renderEditOrSubmit = () => {
    if (this.state.editable) {
      return (
        <div className="CompanyRow__edit">
          <Button className="edit__submit" onClick={this.onSubmit}>
            Submit
          </Button>
          <Button
            className="edit__cancel"
            onClick={() => this.setState({ editable: false })}
          >
            Cancel
          </Button>
        </div>
      );
    }
    return (
      <Button
        className="toggle_edit"
        onClick={() => this.setState({ editable: true })}
      >
        Edit
      </Button>
    );
  };

  onSubmit = () => {
    const { id, updateCompany } = this.props;
    const { endDate, maxActiveUsers } = this.state;
    this.setState({ editable: false });
    updateCompany(id, endDate.valueOf(), parseInt(maxActiveUsers));
  };

  renderMaxActiveUsers = maxActiveUsers => {
    if (this.state.editable) {
      return (
        <input
          className="edit__active__users"
          onChange={e => this.setState({ maxActiveUsers: e.target.value })}
          type="number"
          value={this.state.maxActiveUsers}
        />
      );
    }
    return maxActiveUsers;
  };

  renderExpiresAt = expiresAt => {
    if (this.state.editable) {
      return (
        <SingleDatePicker
          date={this.state.endDate} // momentPropTypes.momentObj or null
          onDateChange={endDate => this.setState({ endDate })} // PropTypes.func.isRequired
          focused={this.state.focused} // PropTypes.bool
          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired,
        />
      );
    }
    return moment(expiresAt).format("MMM Do YY");
  };

  render() {
    const {
      id,
      name,
      maxActiveUsers,
      activeUsers,
      createdAt,
      expiresAt
    } = this.props;
    return (
      <form
        className={cx("CompanyRow", {
          "reached-max-users": activeUsers === maxActiveUsers
        })}
      >
        <div className={cx("CompanyRow__details", "ms-column-1")}>{id}</div>
        <div className={cx("CompanyRow__details", "ms-column-2")}>{name}</div>
        <div className={cx("CompanyRow__details", "ms-column-3")}>
          {activeUsers}
        </div>
        <div className={cx("CompanyRow__details", "ms-column-4")}>
          {this.renderMaxActiveUsers(maxActiveUsers)}
        </div>
        <div className={cx("CompanyRow__details", "ms-column-5")}>
          {moment(createdAt).format("MMM Do YY")}
        </div>
        <div className={cx("CompanyRow__details", "ms-column-6")}>
          {this.renderExpiresAt(expiresAt)}
        </div>
        <div className={cx("CompanyRow__details", "ms-column-7")}>
          {this.renderEditOrSubmit()}
        </div>
      </form>
    );
  }
}

CompanyRow.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  maxActiveUsers: PropTypes.number,
  activeUsers: PropTypes.number,
  createdAt: PropTypes.string,
  expiresAt: PropTypes.string,
  updateCompany: PropTypes.func
};
