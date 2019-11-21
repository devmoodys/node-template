import { connectCmm, CONNECT_CMM_SUCCESSFUL, CONNECT_CMM_FAILED } from "../cmm";

import mockStore from "__tests__/support/mockStore";

jest.mock("ui/store/actions/apiClient", () => {
  return {
    apiFetch: jest.fn().mockReturnValue(Promise.resolve({}))
  };
});

jest.mock("ui/store/actions/partners", () => {
  return { fetchPartnerConnections: jest.fn() };
});

const mockApiFetch = require("ui/store/actions/apiClient").apiFetch;
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

describe("connectCmm", () => {
  const credentials = { username: "cmmuser", password: "secret" };

  function subject() {
    store.dispatch(connectCmm(credentials));
  }

  it("makes an API call to establish the connection", async () => {
    await subject();
    expect(mockApiFetch).toHaveBeenCalledWith("/api/account/cmm/connect", {
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

    it("dispatches CONNECT_CMM_SUCCESSFUL", async () => {
      await subject();
      expect(store.getActions()[1]).toEqual({
        status: "success",
        type: CONNECT_CMM_SUCCESSFUL
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

    it("dispatches CONNECT_CMM_FAILED", async () => {
      await subject();
      expect(store.getActions()[1]).toMatchObject({
        status: "error",
        type: CONNECT_CMM_FAILED
      });
    });

    it("does not dispatch fetchPartnerConnections()", async () => {
      await subject();
      expect(mockFetchPartnerConnections).not.toHaveBeenCalled();
    });
  });
});
