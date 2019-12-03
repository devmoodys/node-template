import { JsonApiClient } from "systems/fetch";
export const API_URL = process.env.CLS_USERS_API_URL;

export default class ApiClient {
  constructor() {
    this.client = new JsonApiClient(API_URL);
  }

  getCompany = async (field, values) => {
    const response = await this.client.get("v1/cre/admin/company", {
      field,
      values
    });
    const result = await response.json();
    return result[0];
  };

  getCompanies = async page => {
    const response = await this.client.get("v1/cre/admin/company", {
      field: "company_name",
      values: "all",
      page
    });
    const result = await response.json();
    return result;
  };
}
