import { merge } from "ramda";
import {
  PARTNER_CONNECTIONS_LOADED,
  PARTNER_CONNECTIONS_FAILED,
  DISCONNECT_PARTNER_SUCCESSFUL,
  DISCONNECT_PARTNER_FAILED,
  PARTNER_CONNECT_STARTED,
  PARTNER_CONNECT_CANCELED,
  PARTNER_HEALTH_FETCHING,
  PARTNER_HEALTH_SUCCESSFUL,
  PARTNER_HEALTH_FAILED
} from "ui/store/actions/partners";
import partners from "../partners";

describe("partners", () => {
  const partnerConnections = {
    partners: [
      { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
      { partner: "compstak", status: "connected", connectedAs: "compstakUser" },
      { partner: "val", status: "disconnected" }
    ],
    totalConnected: 2
  };

  describe("given a PARTNER_HEALTH_FETCHING action", () => {
    const state = partnerConnections;
    const action = {
      partner: "val",
      type: PARTNER_HEALTH_FETCHING
    };

    it("returns a new state with the matching partner status set to 'healthCheck'", () => {
      expect(partners(state, action)).toEqual({
        partners: [
          { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
          {
            partner: "compstak",
            status: "connected",
            connectedAs: "compstakUser"
          },
          { partner: "val", status: "healthCheck" }
        ],
        totalConnected: 2
      });
    });
  });

  describe("given a PARTNER_HEALTH_SUCCESSFUL action", () => {
    describe("when health is healthy", () => {
      const state = partnerConnections;
      const action = {
        partner: "val",
        health: { status: true },
        type: PARTNER_HEALTH_SUCCESSFUL
      };

      it("returns a new state with the matching partner status set to 'connected'", () => {
        expect(partners(state, action)).toEqual({
          partners: [
            { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
            {
              partner: "compstak",
              status: "connected",
              connectedAs: "compstakUser"
            },
            { partner: "val", status: "connected" }
          ],
          totalConnected: 2
        });
      });
    });

    describe("when health is unhealthy", () => {
      const state = partnerConnections;
      const action = {
        partner: "val",
        health: { status: false },
        type: PARTNER_HEALTH_SUCCESSFUL
      };

      it("returns a new state with the matching partner status set to 'error'", () => {
        expect(partners(state, action)).toEqual({
          partners: [
            { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
            {
              partner: "compstak",
              status: "connected",
              connectedAs: "compstakUser"
            },
            { partner: "val", status: "error" }
          ],
          totalConnected: 2
        });
      });
    });
  });

  describe("given a PARTNER_HEALTH_FAILED action", () => {
    const state = partnerConnections;
    const action = {
      partner: "val",
      type: PARTNER_HEALTH_FAILED
    };

    it("returns a new state with the matching partner status set to 'error'", () => {
      expect(partners(state, action)).toEqual({
        partners: [
          { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
          {
            partner: "compstak",
            status: "connected",
            connectedAs: "compstakUser"
          },
          { partner: "val", status: "error" }
        ],
        totalConnected: 2
      });
    });
  });

  describe("given a PARTNER_CONNECTIONS_LOADED action", () => {
    const state = {};
    const action = {
      partnerConnections,
      type: PARTNER_CONNECTIONS_LOADED
    };

    it("returns the partnerConnections with no error as the new state", () => {
      expect(partners(state, action)).toEqual(
        merge(partnerConnections, { error: null, status: "LOADED" })
      );
    });
  });

  describe("given a PARTNER_CONNECTIONS_FAILED action", () => {
    const state = {};
    const error = "THIS IS AN ERROR.";
    const action = {
      error,
      type: PARTNER_CONNECTIONS_FAILED
    };

    it("returns the error as the new state", () => {
      expect(partners(state, action)).toEqual({ error });
    });
  });

  describe("given a DISCONNECT_PARTNER_SUCCESSFUL action", () => {
    const state = partnerConnections;
    const action = {
      partnerIdentifier: "compstak",
      type: DISCONNECT_PARTNER_SUCCESSFUL
    };

    it("returns updated partnerConnections as the new state", () => {
      expect(partners(state, action)).toEqual({
        partners: [
          { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
          { partner: "compstak", status: "disconnected" },
          { partner: "val", status: "disconnected" }
        ],
        totalConnected: 1
      });
    });
  });

  describe("given a DISCONNECT_PARTNER_FAILED action", () => {
    const state = {};
    const action = {
      error: "THIS IS AN ERROR",
      partnerIdentifier: "compstak",
      type: DISCONNECT_PARTNER_FAILED
    };

    it("returns the error and partnerIdentifier as the new state", () => {
      expect(partners(state, action)).toEqual({
        error: "THIS IS AN ERROR",
        partnerIdentifier: "compstak"
      });
    });
  });

  describe("given a PARTNER_CONNECT_STARTED action", () => {
    const state = partnerConnections;
    const action = {
      partnerIdentifier: "val",
      type: PARTNER_CONNECT_STARTED
    };

    it("returns a new state with the matching partner status set to 'pending'", () => {
      expect(partners(state, action)).toEqual({
        partners: [
          { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
          {
            partner: "compstak",
            status: "connected",
            connectedAs: "compstakUser"
          },
          { partner: "val", status: "pending" }
        ],
        totalConnected: 2
      });
    });
  });

  describe("given a PARTNER_CONNECT_CANCELED action", () => {
    const state = partnerConnections;
    const action = {
      partnerIdentifier: "val",
      type: PARTNER_CONNECT_CANCELED
    };

    it("returns a new state with the matching partner status set to 'disconnected'", () => {
      expect(partners(state, action)).toEqual({
        partners: [
          { partner: "cmm", status: "connected", connectedAs: "cmmUser" },
          {
            partner: "compstak",
            status: "connected",
            connectedAs: "compstakUser"
          },
          { partner: "val", status: "disconnected" }
        ],
        totalConnected: 2
      });
    });
  });

  describe("given any other action", () => {
    const state = {};
    const action = { type: "FIZZ_BUZZ", foo: "bar" };

    it("returns the state unchange", () => {
      expect(partners(state, action)).toEqual(state);
    });
  });
});
