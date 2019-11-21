import {
  getRecentSearches,
  RECENT_SEARCHES_SUCCESSFUL,
  RECENT_SEARCHES_FAILED
} from "../searchHistory";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});

describe("getRecentSearches", () => {
  const apiClientModule = require("ui/store/actions/apiClient");

  let dispatch;
  const actionCreator = getRecentSearches();

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it("makes an API call to establish the connection", async () => {
    await actionCreator(dispatch);
    expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
      "/api/mostRecentSearches",
      {
        method: "get"
      }
    );
  });

  describe("if the API call succeeded", () => {
    beforeEach(() => {
      apiClientModule.apiFetch.mockReturnValue(
        Promise.resolve({
          ok: true,
          json: jest.fn().mockReturnValue(Promise.resolve([{ q: "thing" }]))
        })
      );
    });

    it("dispatches RECENT_SEARCHES_SUCCESSFUL", async () => {
      await actionCreator(dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        mostRecentSearches: [{ q: "thing" }],
        type: RECENT_SEARCHES_SUCCESSFUL
      });
    });
  });

  describe("if the API call fails", () => {
    const error = new Error("a bad thing");

    beforeEach(() => {
      apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
    });

    it("dispatches a RECENT_SEARCHES_FAILED with the error", async () => {
      await actionCreator(dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        error,
        type: RECENT_SEARCHES_FAILED
      });
    });
  });
});
