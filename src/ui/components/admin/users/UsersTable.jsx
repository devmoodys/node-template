import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UserRow from "./UserRow";
import { hasSuperAdminAccess } from "helpers/authorization";
import {
  fetchUsers,
  toggleUserStatus,
  filterUsersByCompany,
  filterUsersByRole,
  filterUsersByStatus
} from "ui/store/actions/users";
import { fetchCompanies } from "ui/store/actions/companies";

import UsersTableHeader from "./UsersTableHeader";
import UsersTableFilters from "./UsersTableFilters";
import ThreeBounceSpinner from "ui/components/spinners/ThreeBounceSpinner";

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: "1" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({ page: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.loadUsers(parseInt(this.state.page));
  };

  componentDidMount() {
    const { loadUsers, loadCompanies, currentUser: { role } } = this.props;

    if (hasSuperAdminAccess(role)) {
      loadCompanies();
    }
    loadUsers(1);
  }

  render() {
    const {
      filteredUsers,
      filterCompany,
      filterRole,
      filterStatus,
      users,
      companies,
      currentUser: { role },
      currentUser: { id },
      toggleUserStatus,
      usersStatus
    } = this.props;

    const userArray = filteredUsers.length > 0 ? filteredUsers : users;
    const userRows = userArray.map((user, i) => {
      if (user.nousers) {
        return (
          <div className="NoUsersRow" key={`user-row-${i}`}>
            No users found!
          </div>
        );
      }
      return (
        <UserRow
          role={role}
          user={user}
          key={`user-row-${i}`}
          toggleStatus={toggleUserStatus}
          currentUserId={id}
        />
      );
    });

    return (
      <div className="UsersTable">
        <UsersTableHeader role={role} />
        {hasSuperAdminAccess(role) && (
          <UsersTableFilters
            filterRole={filterRole}
            filterCompany={filterCompany}
            filterStatus={filterStatus}
            companies={companies}
          />
        )}
        {["FETCHING"].includes(usersStatus) ? (
          <ThreeBounceSpinner />
        ) : (
          <div>
            <div className="UsersTable__rows">{userRows}</div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Page:
                <input
                  type="text"
                  value={this.state.page}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </div>
    );
  }
}

UsersTable.propTypes = {
  filteredUsers: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
  loadUsers: PropTypes.func.isRequired,
  filterCompany: PropTypes.func.isRequired,
  filterRole: PropTypes.func.isRequired,
  filterStatus: PropTypes.func.isRequired,
  toggleUserStatus: PropTypes.func.isRequired,
  loadCompanies: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  usersStatus: PropTypes.string
};

function mapStateToProps({ users, currentUser, companies }) {
  return {
    filteredUsers: users.filteredResults,
    users: users.users,
    usersStatus: users.status,
    currentUser: currentUser,
    companies: companies.companies
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadUsers: page => {
      dispatch(fetchUsers(page));
    },
    toggleUserStatus: userId => {
      dispatch(toggleUserStatus(userId));
    },
    loadCompanies: () => {
      dispatch(fetchCompanies());
    },
    filterCompany: e => {
      dispatch(filterUsersByCompany(e.target.value));
    },
    filterRole: e => {
      dispatch(filterUsersByRole(e.target.value));
    },
    filterStatus: e => {
      dispatch(filterUsersByStatus(e.target.value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);
