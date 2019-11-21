import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AuthenticateAdmin from "ui/components/routing/AuthenticateAdmin";
import AdminLayout from "ui/components/admin/AdminLayout";
import { returnAdapterRows, selectAdapterById } from "ui/helpers/adapters";
import AdapterDetailMapping from "./AdapterDetailMapping";
import { fetchDefaultAdapters } from "ui/store/actions/defaultAdapters";

class AdapterDetail extends Component {
  componentDidMount() {
    this.props.loadDefaultAdapters();
  }

  render() {
    const { match: { params: { id } }, defaultAdapters } = this.props;
    let adapter_json, name, adapter, origin, destination, adapterObj;

    // While defaultAdapters is being fetched, render loading div below
    if (defaultAdapters.length > 0) {
      adapterObj = selectAdapterById(defaultAdapters, id);
      adapter_json = adapterObj.adapter_json;
      name = adapterObj.name;
      origin = adapterObj.origin;
      destination = adapterObj.destination;
      adapter = returnAdapterRows(adapter_json, adapter_json.partner);
    } else {
      return (
        <AdminLayout className="AdapterDetail">
          <div>Loading...</div>
        </AdminLayout>
      );
    }

    return (
      <AdminLayout
        className="AdapterDetail"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin" },
          { label: "Adapters", path: "/admin/adapters" }
        ]}
        title={name}
      >
        <AdapterDetailMapping
          adapter={adapter}
          origin={origin}
          destination={destination}
        />
      </AdminLayout>
    );
  }
}

AdapterDetail.propTypes = {
  match: PropTypes.object,
  id: PropTypes.string,
  defaultAdapters: PropTypes.array.isRequired,
  loadDefaultAdapters: PropTypes.func.isRequired
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

const AdapterDetailComponent = connect(mapStateToProps, mapDispatchToProps)(
  AdapterDetail
);

export default AuthenticateAdmin(AdapterDetailComponent);
