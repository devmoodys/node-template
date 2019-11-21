import {
  connectCmbs,
  CONNECT_CMBS_SUCCESSFUL,
  CONNECT_CMBS_FAILED
} from "../cmbs";
import mockStore from "__tests__/support/mockStore";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});
const mockApiFetch = require("ui/store/actions/apiClient").apiFetch;

jest.mock("ui/store/actions/partners", () => {
  return { fetchPartnerConnections: jest.fn() };
});
const mockFetchPartnerConnections = require("ui/store/actions/partners")
  .fetchPartnerConnections;

let store;

beforeEach(() => {
  store = mockStore({});
});

afterEach(() => {
  mockApiFetch.mockClear();
  mockFetchPartnerConnections.mockClear();
});

describe("connectCmbs", () => {
  const credentials = { username: "cmmuser", password: "secret" };

  function subject() {
    store.dispatch(connectCmbs(credentials));
  }

  it("makes an API call to establish the connection", async () => {
    await subject();
    expect(mockApiFetch).toHaveBeenCalledWith("/api/account/cmbs/connect", {
      method: "put",
      body: JSON.stringify(credentials)
    });
  });

  describe("if the API call succeeded", () => {
    beforeEach(() => {
      mockApiFetch.mockReturnValue(
        Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      );
    });

    it("dispatches CONNECT_CMBS_SUCCESSFUL", async () => {
      await subject();
      expect(store.getActions()[1]).toEqual({
        status: "success",
        type: CONNECT_CMBS_SUCCESSFUL
      });
    });

    it("dispatches fetchPartnerConnections()", async () => {
      await subject();
      expect(mockFetchPartnerConnections).toHaveBeenCalled();
    });
  });

  describe("if the API call failed", () => {
    beforeEach(() => {
      mockApiFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 }));
    });

    it("dispatches CONNECT_CMBS_FAILED", async () => {
      await subject();
      expect(store.getActions()[1]).toMatchObject({
        status: "error",
        type: CONNECT_CMBS_FAILED
      });
    });

    it("does not dispatch fetchPartnerConnections()", async () => {
      await subject();
      expect(mockFetchPartnerConnections).not.toHaveBeenCalled();
    });
  });
});
