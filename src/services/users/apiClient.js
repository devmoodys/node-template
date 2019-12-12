import { JsonApiClient } from "systems/fetch";
export const API_URL = process.env.CLS_USERS_API_URL;
export const API_KEY = process.env.CLS_USERS_API_KEY;
export const REIS_NETWORK_URL = process.env.METROPOLIS_URL;

export default class ApiClient {
  constructor(token) {
    this.client = new JsonApiClient(
      API_URL,
      {},
      {
        "x-api-key": API_KEY
      }
    );
    if (token) {
      this.metroClient = new JsonApiClient(
        REIS_NETWORK_URL,
        {},
        { Authorization: `Bearer ${token}` }
      );
    }
  }

  getUser = async (field, values) => {
    const response = await this.client.get("v1/cre/admin/user", {
      field,
      values,
      page: 1
    });
    const result = await response.json();
    return result[0];
  };

  createUser = async (companyName, userObj) => {
    const response = await this.client.post(
      `v1/cre/admin/user?companyName=${companyName}`,
      [userObj]
    );
    const result = await response.json();
    return result;
  };
  // when you create a user in CLS, this should automatically make a user in Reis Network.
  createReisNetworkUser = async (
    email,
    role,
    companyName,
    userCreatingUser,
    password
  ) => {
    const response = await this.metroClient.post(`api/v1/newUser`, {
      email,
      role,
      companyName,
      userCreatingUser,
      password
    });
    const result = await response.json();
    return result;
  };
  // field here can be "id" as "userId" or "email".
  updateUser = async (field, value, updateObject) => {
    const response = await this.client.put(
      `v1/cre/admin/user?${field}=${value}`,
      updateObject
    );
    const result = await response.json();
    return result;
  };

  getUsers = async (field, values, page) => {
    const response = await this.client.get("v1/cre/admin/user", {
      field,
      values,
      page
    });
    const result = await response.json();
    return result;
  };
}
