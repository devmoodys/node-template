import { JsonApiClient } from "systems/fetch";
export const API_URL = process.env.CLS_USERS_URL;

export default class ApiClient {
  constructor() {
    this.client = new JsonApiClient(API_URL);
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

  getUsers = async page => {
    const response = await this.client.get("v1/cre/admin/user", {
      field: "email",
      values: "all",
      page
    });
    const result = await response.json();
    return result;
  };
}
