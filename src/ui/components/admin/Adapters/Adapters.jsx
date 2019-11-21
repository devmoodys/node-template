import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";
import AdminLayout from "ui/components/admin/AdminLayout";
import PartnerAdapters from "./PartnerAdapters";
import { fetchDefaultAdapters } from "ui/store/actions/defaultAdapters";
import { sortAdapters } from "ui/helpers/adapters";

class Adapters extends Component {
  componentDidMount() {
    this.props.loadDefaultAdapters();
  }

  render() {
    const { defaultAdapters } = this.props;
    const adapters = sortAdapters(defaultAdapters);

    return (
      <AdminLayout
        className="Adapters"
        breadcrumbs={[{ label: "Dashboard", path: "/admin" }]}
        title="Interchange Adapters"
      >
        <div className="Adapters__grid">
          <div className="Adapters-grid-header">
            <div className={cx("Adapters-grid-header__column", "ms-column-1")}>
              Name
            </div>
            <div className={cx("Adapters-grid-header__column", "ms-column-2")}>
              Origin
            </div>
            <div className={cx("Adapters-grid-header__column", "ms-column-3")}>
              Destination
            </div>
          </div>
          {adapters["cmbs"].length > 0 && (
            <PartnerAdapters adapters={adapters} partner={"cmbs"} />
          )}
          {adapters["cmm"].length > 0 && (
            <PartnerAdapters adapters={adapters} partner={"cmm"} />
          )}
          {adapters["compstak"].length > 0 && (
            <PartnerAdapters adapters={adapters} partner={"compstak"} />
          )}
          {adapters["val"].length > 0 && (
            <PartnerAdapters adapters={adapters} partner={"val"} />
          )}
          {adapters["reis"].length > 0 && (
            <PartnerAdapters adapters={adapters} partner={"reis"} />
          )}
        </div>
      </AdminLayout>
    );
  }
}

Adapters.propTypes = {
  loadDefaultAdapters: PropTypes.func.isRequired,
  defaultAdapters: PropTypes.array.isRequired
};

function mapStateToProps({ defaultAdapters }) {
  return {
    defaultAdapters: defaultAdapters.adapters
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadDefaultAdapters: () => {
      dispatch(fetchDefaultAdapters());
    }
  };
}

const AdaptersDashboard = connect(mapStateToProps, mapDispatchToProps)(
  Adapters
);

export default AuthenticateAdmin(AdaptersDashboard);
