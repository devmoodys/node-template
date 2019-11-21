import {
  connectVal,
  CONNECT_VAL_SUCCESSFUL,
  CONNECT_VAL_FAILED,
  refreshUserProperties,
  REFRESH_VAL_PROPERTIES_SUCCESSFUL,
  REFRESH_VAL_PROPERTIES_FAILED
} from "../val";

import { FLASH_SHOW } from "../flash";

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
  fetch.resetMocks();
  mockApiFetch.mockClear();
  mockFetchPartnerConnections.mockClear();
});

describe("connectVal", () => {
  const submission = { registrationUrl: "https://val.example" };

  function subject() {
    store.dispatch(connectVal(submission));
  }

  it("makes an API call to establish the connection", async () => {
    await subject();
    expect(mockApiFetch).toHaveBeenCalledWith("/api/account/val/connect", {
      method: "put",
      body: JSON.stringify(submission)
    });
  });

  describe("if the API call succeeded", () => {
    beforeEach(() => {
      mockApiFetch.mockReturnValue(
        Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      );
    });

    it("dispatches CONNECT_VAL_SUCCESSFUL", async () => {
      await subject();
      expect(store.getActions()[1]).toEqual({
        status: "success",
        type: CONNECT_VAL_SUCCESSFUL
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

    it("dispatches CONNECT_VAL_FAILED", async () => {
      await subject();
      expect(store.getActions()[1]).toMatchObject({
        status: "error",
        type: CONNECT_VAL_FAILED
      });
    });

    it("does not dispatch fetchPartnerConnections()", async () => {
      await subject();
      expect(mockFetchPartnerConnections).not.toHaveBeenCalled();
    });
  });
});

describe("refreshUserProperties", () => {
  function subject() {
    store.dispatch(refreshUserProperties());
  }

  it("makes an API call to import val properties for user", async () => {
    await subject();
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/api/account/val/import_properties",
      { method: "post" }
    );
  });

  describe("if the API call was successful", () => {
    beforeEach(() => {
      mockApiFetch.mockReturnValue(
        Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      );
    });

    it("dispatches REFRESH_VAL_PROPERTIES_SUCCESSFUL", async () => {
      await subject();
      expect(store.getActions()).toContainEqual({
        type: REFRESH_VAL_PROPERTIES_SUCCESSFUL
      });
    });

    it("dispatches a Success Flash with a message", async () => {
      await subject();
      expect(store.getActions()).toContainEqual({
        type: FLASH_SHOW,
        flash: {
          message:
            "Your VAL properties and being reindexed and will be available to search in Metropolis in a few moments.",
          type: "success"
        }
      });
    });
  });

  describe("if the API call failed", () => {
    beforeEach(() => {
      mockApiFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 }));
    });

    it("dispatches REFRESH_VAL_PROPERTIES_FAILED with the error", async () => {
      await subject();
      expect(store.getActions()).toContainEqual({
        type: REFRESH_VAL_PROPERTIES_FAILED,
        error: new Error("status code: 500")
      });
    });

    it("dispatches an Error Flash with a message", async () => {
      await subject();
      expect(store.getActions()).toContainEqual({
        type: FLASH_SHOW,
        flash: {
          message:
            "There was a problem refreshing your val properties. Status code: 500",
          type: "error"
        }
      });
    });
  });

  describe("if the API call throws an error", () => {
    const error = new Error("Somthing horribly wrong");
    beforeEach(() => {
      mockApiFetch.mockReturnValue(Promise.reject(error));
    });

    it("dispatched REFRESH_VAL_PROPERTIES_FAILED with the error", async () => {
      await subject();
      expect(store.getActions()).toContainEqual({
        error,
        type: REFRESH_VAL_PROPERTIES_FAILED
      });
    });

    it("dispatches an Error Flash with a message", async () => {
      await subject();
      expect(store.getActions()).toContainEqual({
        type: FLASH_SHOW,
        flash: {
          message:
            "There was a problem refreshing your val properties: Somthing horribly wrong",
          type: "error"
        }
      });
    });
  });
});
