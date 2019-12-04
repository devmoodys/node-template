import { JsonApiClient } from "systems/fetch";
export const API_URL = process.env.CLS_USERS_API_URL;
export const API_KEY = process.env.CLS_USERS_API_KEY;

export default class ApiClient {
  constructor() {
    this.client = new JsonApiClient(
      API_URL,
      {},
      {
        "x-api-key": API_KEY
      }
    );
  }

  getCompany = async (field, values) => {
    const response = await this.client.get("v1/cre/admin/company", {
      field,
      values,
      page: 1
    });
    const result = await response.json();
    return result[0];
  };

  createCompany = async companyObj => {
    const response = await this.client.post("v1/cre/admin/company", [
      companyObj
    ]);
    const result = await response.json();
    return result;
  };
  // field here can be "id" as "userId" or "email".
  updateCompany = async (field, value, updateObject) => {
    const response = await this.client.put(
      `v1/cre/admin/company?${field}=${value}`,
      updateObject
    );
    const result = await response.json();
    return result;
  };

  getCompanies = async (field, values, page) => {
    const response = await this.client.get("v1/cre/admin/company", {
      field,
      values,
      page
    });
    const result = await response.json();
    return result;
  };
}
