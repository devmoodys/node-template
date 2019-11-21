import {
  fetchPartnerConnections,
  fetchPartnersHealth,
  fetchPartnerHealth,
  disconnectPartner,
  PARTNER_HEALTH_FETCHING,
  PARTNER_HEALTH_SUCCESSFUL,
  PARTNER_HEALTH_FAILED,
  PARTNER_CONNECTIONS_LOADED,
  PARTNER_CONNECTIONS_FAILED,
  DISCONNECT_PARTNER_SUCCESSFUL,
  DISCONNECT_PARTNER_FAILED
} from "../partners";
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
  store = mockStore({
    partners: {
      partners: [
        { partner: "cmm" },
        { partner: "compstak" },
        { partner: "val" }
      ]
    }
  });
  dispatch = jest.fn();
});

afterEach(() => {
  apiClientModule.apiFetch.mockClear();
});

describe("fetchPartnerConnections", () => {
  const actionCreator = fetchPartnerConnections();

  describe("given a store dispatch", () => {
    it("attempts to fetch the partnerConnections", async () => {
      await actionCreator(dispatch);
      expect(apiClientModule.apiFetch).toHaveBeenCalledWith("/api/partners");
    });

    describe("if the statuses are successfully fetched", () => {
      const partnerConnections = {
        partners: [
          { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
          { partner: "compstak", status: "disconnected" },
          { partner: "val", status: "connected", connectedAs: "valUser" }
        ],
        totalConnected: 2
      };

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve(partnerConnections))
          })
        );
      });

      it("dispatches PARTNER_CONNECTIONS_LOADED with connections", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          partnerConnections,
          type: PARTNER_CONNECTIONS_LOADED
        });
      });
    });

    describe("if the fetch failed", () => {
      const error = new Error("a bad thing");

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
      });

      it("dispatches PARTNER_CONNECTIONS_FAILED with error", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          error,
          type: PARTNER_CONNECTIONS_FAILED
        });
      });
    });
  });
});

describe("disconnectPartner", () => {
  describe("given a partnerIdentifier", () => {
    const partnerIdentifier = "cmm";
    const actionCreator = disconnectPartner(partnerIdentifier);

    describe("given a store dispatch", () => {
      it("attempts to delete the partner credentials", async () => {
        await actionCreator(dispatch);
        expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
          "/api/partners/cmm",
          { method: "DELETE" }
        );
      });

      describe("if the delete is successfully", () => {
        beforeEach(() => {
          apiClientModule.apiFetch.mockReturnValue(
            Promise.resolve({
              ok: true,
              json: jest.fn().mockReturnValue(Promise.resolve({}))
            })
          );
        });

        it("dispatches DISCONNECT_PARTNER_SUCCESSFUL", async () => {
          await store.dispatch(actionCreator);
          expect(store.getActions()).toContainEqual({
            partnerIdentifier: "cmm",
            type: DISCONNECT_PARTNER_SUCCESSFUL
          });
        });
      });

      describe("if the delete failed", () => {
        const error = new Error("a bad thing");

        beforeEach(() => {
          apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
        });

        it("dispatches DISCONNECT_PARTNER_FAILED and an error flash message with the error", async () => {
          await store.dispatch(actionCreator);
          expect(store.getActions()).toEqual([
            {
              error: error,
              partnerIdentifier: "cmm",
              type: DISCONNECT_PARTNER_FAILED
            }
          ]);
        });
      });
    });
  });
});

describe("fetchPartnersHealth", () => {
  const actionCreator = fetchPartnersHealth();

  describe("given a store dispatch", () => {
    describe("when partners are in the state", () => {
      it("dispatches PARTNER_HEALTH_FETCHING with cmm", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          partner: "cmm",
          type: PARTNER_HEALTH_FETCHING
        });
      });

      it("dispatches PARTNER_HEALTH_FETCHING with compstak", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          partner: "compstak",
          type: PARTNER_HEALTH_FETCHING
        });
      });

      it("dispatches PARTNER_HEALTH_FETCHING with val", async () => {
        await store.dispatch(actionCreator);
        expect(store.getActions()).toContainEqual({
          partner: "compstak",
          type: PARTNER_HEALTH_FETCHING
        });
      });
    });
  });
});

describe("fetchPartnerHealth", () => {
  describe("given a dispatch and a partner", () => {
    function actionCreator(partner) {
      return fetchPartnerHealth(partner);
    }

    it("dispatches PARTNER_HEALTH_FETCHING with the given partner", async () => {
      await store.dispatch(actionCreator("val"));
      expect(store.getActions()).toContainEqual({
        partner: "val",
        type: PARTNER_HEALTH_FETCHING
      });
    });

    describe("when the partner is cmm", () => {
      it("attempts to fetch the cmm health", async () => {
        await store.dispatch(actionCreator("cmm"));
        expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
          "/api/partners/cmm/health"
        );
      });
    });
    describe("when the partner is compstak", () => {
      it("attempts to fetch the compstak health", async () => {
        await store.dispatch(actionCreator("compstak"));
        expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
          "/api/partners/compstak/health"
        );
      });
    });
    describe("when the partner is val", () => {
      it("attempts to fetch the val health", async () => {
        await store.dispatch(actionCreator("val"));
        expect(apiClientModule.apiFetch).toHaveBeenCalledWith(
          "/api/partners/val/health"
        );
      });
    });

    describe("if the health fetch is successful", () => {
      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve(true))
          })
        );
      });

      it("dispatches PARTNER_HEALTH_SUCCESSFUL with the partner and health", async () => {
        await store.dispatch(actionCreator("cmm"));
        expect(store.getActions()).toContainEqual({
          health: true,
          partner: "cmm",
          type: PARTNER_HEALTH_SUCCESSFUL
        });
      });
    });

    describe("if the health fetch fails", () => {
      const error = new Error("a bad thing");

      beforeEach(() => {
        apiClientModule.apiFetch.mockReturnValue(Promise.reject(error));
      });

      it("dispatches PARTNER_HEALTH_FAILED with the partner and error", async () => {
        await store.dispatch(actionCreator("compstak"));
        expect(store.getActions()).toContainEqual({
          error: error,
          partner: "compstak",
          type: PARTNER_HEALTH_FAILED
        });
      });
    });
  });
});
