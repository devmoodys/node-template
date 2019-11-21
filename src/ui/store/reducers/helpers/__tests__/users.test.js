import {
  FILTER_USERS_BY_COMPANY,
  FILTER_USERS_BY_ROLE,
  FILTER_USERS_BY_STATUS
} from "ui/store/actions/users";

import { runFiltersAndReturnState } from "../users";

const userArray = [
  {
    email: "user_1@client.net",
    company_id: 2,
    role: "user",
    status: "active"
  },
  {
    email: "user_2@client.net",
    company_id: 5,
    role: "user",
    status: "active"
  },
  {
    email: "user_3@client.net",
    company_id: 2,
    role: "admin",
    status: "active"
  },
  {
    email: "user_4@client.net",
    company_id: 5,
    role: "admin",
    status: "active"
  },
  {
    email: "user_5@client.net",
    company_id: 5,
    role: "user",
    status: "inactive"
  }
];

describe("Run Filters and Return State", () => {
  let state, action;
  beforeEach(() => {
    state = {
      users: userArray,
      filters: [],
      filteredCompanyId: "all",
      filteredRole: "all",
      filteredStatus: "all"
    };
  });

  describe("Runs a single filter, then returns the correct state", () => {
    it("Filter by company", () => {
      action = { companyId: 2, type: FILTER_USERS_BY_COMPANY };

      expect(
        runFiltersAndReturnState(state, action, action.companyId)
      ).toMatchObject({
        users: userArray,
        filteredResults: [
          {
            email: "user_1@client.net",
            company_id: 2,
            role: "user",
            status: "active"
          },
          {
            email: "user_3@client.net",
            company_id: 2,
            role: "admin",
            status: "active"
          }
        ],
        filters: ["company"],
        filteredCompanyId: 2,
        filteredRole: "all",
        filteredStatus: "all"
      });
    });

    it("Filter by role", () => {
      action = { role: "admin", type: FILTER_USERS_BY_ROLE };

      expect(
        runFiltersAndReturnState(state, action, action.role)
      ).toMatchObject({
        users: userArray,
        filteredResults: [
          {
            email: "user_3@client.net",
            company_id: 2,
            role: "admin",
            status: "active"
          },
          {
            email: "user_4@client.net",
            company_id: 5,
            role: "admin",
            status: "active"
          }
        ],
        filters: ["role"],
        filteredCompanyId: "all",
        filteredRole: "admin",
        filteredStatus: "all"
      });
    });

    it("Filter by status", () => {
      action = { status: "inactive", type: FILTER_USERS_BY_STATUS };

      expect(
        runFiltersAndReturnState(state, action, action.status)
      ).toMatchObject({
        users: userArray,
        filteredResults: [
          {
            email: "user_5@client.net",
            company_id: 5,
            role: "user",
            status: "inactive"
          }
        ],
        filters: ["status"],
        filteredCompanyId: "all",
        filteredRole: "all",
        filteredStatus: "inactive"
      });
    });
  });

  describe("Runs multiple filters, and returns the correct state", () => {
    beforeEach(() => {
      state = {
        users: userArray,
        filters: ["company"],
        filteredCompanyId: 2,
        filteredRole: "all",
        filteredStatus: "all"
      };
    });

    it("Filters company, then role", () => {
      action = { role: "admin", type: FILTER_USERS_BY_ROLE };
      expect(
        runFiltersAndReturnState(state, action, action.role)
      ).toMatchObject({
        users: userArray,
        filteredResults: [
          {
            email: "user_3@client.net",
            company_id: 2,
            role: "admin",
            status: "active"
          }
        ],
        filters: ["company", "role"],
        filteredCompanyId: 2,
        filteredRole: "admin",
        filteredStatus: "all"
      });
    });

    it("Filters company, then status", () => {
      action = { status: "active", type: FILTER_USERS_BY_STATUS };
      expect(
        runFiltersAndReturnState(state, action, action.status)
      ).toMatchObject({
        users: userArray,
        filteredResults: [
          {
            email: "user_1@client.net",
            company_id: 2,
            role: "user",
            status: "active"
          },
          {
            email: "user_3@client.net",
            company_id: 2,
            role: "admin",
            status: "active"
          }
        ],
        filters: ["company", "status"],
        filteredCompanyId: 2,
        filteredRole: "all",
        filteredStatus: "active"
      });
    });
  });

  describe("Selecting all, clears filteredResults array", () => {
    beforeEach(() => {
      state = {
        users: userArray,
        filters: ["company"],
        filteredCompanyId: 2,
        filteredRole: "all",
        filteredStatus: "all"
      };
    });

    it("Clears filteredResults array ", () => {
      action = { companyId: "all", type: FILTER_USERS_BY_COMPANY };
      expect(
        runFiltersAndReturnState(state, action, action.companyId)
      ).toMatchObject({
        users: userArray,
        filteredResults: [],
        filters: [],
        filteredCompanyId: "all",
        filteredRole: "all",
        filteredStatus: "all"
      });
    });
  });
});
