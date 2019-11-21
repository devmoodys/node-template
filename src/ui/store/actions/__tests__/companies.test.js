import {
  fetchCompanies,
  createNewCompany,
  COMPANIES_FETCHING,
  COMPANIES_FETCH_SUCCESSFUL,
  COMPANIES_FETCH_FAILED
} from "../companies";
import { FLASH_SHOW } from "../flash";
import mockStore from "__tests__/support/mockStore";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});
const apiClientModule = require("ui/store/actions/apiClient");

let store;
let dispatch;

beforeEach(() => {
  store = mockStore({});
  dispatch = jest.fn();
});

afterEach(() => {
  apiClientModule.apiFetch.mockClear();
});

describe("fetchCompanies", () => {
  const actionCreator = fetchCompanies();

  describe("given a store dispatch", () => {
    it("dispatches a COMPANIES_FETCHING", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        type: COMPANIES_FETCHING
      });
    });

    it("attempts to fetch the companies", async () => {
      await actionCreator(dispatch);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith("/api/companies");
    });

    describe("if the companies are successfully fetched", () => {
      const companies = [{ name: "Company 1" }, { name: "Company 2" }];

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve(companies))
          })
        );
      });

      it("dispatches COMPANIES_FETCH_SUCCESSFUL with companies", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          companies,
          type: COMPANIES_FETCH_SUCCESSFUL
        });
      });
    });

    describe("if the fetch failed", () => {
      const error = new Error("a bad thing");

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
      });

      it("dispatches COMPANIES_FETCH_FAILED with error", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          error,
          type: COMPANIES_FETCH_FAILED
        });
      });
    });
  });
});

describe("createNewCompany", () => {
  describe("when all params are valid", () => {
    const params = {
      companyName: "The Best Company",
      maxActiveUsers: 5,
      accountActiveLengthAmmount: 1,
      accountActiveLengthType: "year"
    };
    let history = {
      location: { pathname: "/admin/companies/new" },
      push: path => {
        history.location.pathname = path;
      }
    };
    const actionCreator = createNewCompany(params, history);

    afterEach(() => {
      history.location.pathname = "/admin/companies/new";
    });

    it("calls /api/companies/new with params", async () => {
      await store.dispatch(actionCreator);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
        "/api/companies/new",
        {
          method: "post",
          body: JSON.stringify({
            companyName: params.companyName,
            maxActiveUsers: params.maxActiveUsers,
            accountActiveLength: `${params.accountActiveLengthAmmount} ${
              params.accountActiveLengthType
            }`
          })
        }
      );
    });

    describe("when response is ok", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve({}))
          })
        );
      });
      it("redirects page to /admin/companies", async () => {
        await store.dispatch(actionCreator);
        expect(history.location.pathname).toEqual("/admin/companies");
      });

      it("dispatches FLASH_SHOW with success message", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toEqual([
          {
            type: FLASH_SHOW,
            flash: {
              message: "Company The Best Company was created.",
              type: "success"
            }
          }
        ]);
      });
    });

    describe("when response is not ok", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.reject("An error occurred")
        );
      });
      it("does not redirect", async () => {
        await store.dispatch(actionCreator);
        expect(history.location.pathname).toEqual("/admin/companies/new");
      });

      it("dispatches FLASH_SHOW with error message", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toEqual([
          {
            type: FLASH_SHOW,
            flash: {
              message: "An error occurred",
              type: "error"
            }
          }
        ]);
      });
    });
  });
});
