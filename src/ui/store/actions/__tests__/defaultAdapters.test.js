import {
  fetchDefaultAdapters,
  DEFAULT_ADAPTERS_FETCHING,
  DEFAULT_ADAPTERS_FETCH_SUCCESSFUL,
  DEFAULT_ADAPTERS_FETCH_FAILED
} from "../defaultAdapters";
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

describe("fetchDefaultAdapters", () => {
  const actionCreator = fetchDefaultAdapters();

  describe("given a store dispatch", () => {
    it("dispatches a DEFAULT_ADAPTERS_FETCHING", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        type: DEFAULT_ADAPTERS_FETCHING
      });
    });

    it("attempts to fetch the default adapters", async () => {
      await actionCreator(dispatch);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
        "/api/defaultAdapters"
      );
    });

    describe("if the default adapters are successfully fetched", () => {
      const adapters = [
        {
          id: 1,
          name: "CMM Export Adapter",
          origin: "cmm",
          destination: "interchange",
          is_default: true
        },
        {
          id: 2,
          name: "Val Export Adapter",
          origin: "val",
          destination: "interchange",
          is_default: true
        }
      ];

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve(adapters))
          })
        );
      });

      it("dispatches USERS_FETCH_SUCCESSFUL with users", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          adapters,
          type: DEFAULT_ADAPTERS_FETCH_SUCCESSFUL
        });
      });
    });

    describe("if the fetch failed", () => {
      const error = new Error("a bad thing");

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
      });

      it("dispatches USERS_FETCH_FAILED with error", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          error,
          type: DEFAULT_ADAPTERS_FETCH_FAILED
        });
      });
    });
  });
});
