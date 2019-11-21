import React from "react";
import {
  formatConnectionMessage,
  partnerIdentifierToAppName
} from "ui/helpers/apps";

describe("partnerIdentifierToAppName", () => {
  it("returns the correct app name", () => {
    expect(partnerIdentifierToAppName("compstak")).toEqual("CompStak");
    expect(partnerIdentifierToAppName("somethingOtherThanCompstak")).toEqual(
      "Unknown"
    );
  });
});

describe("formatConnectionMessage", () => {
  let status;
  let connectedAs = "test-user";

  function subject() {
    return formatConnectionMessage(status, connectedAs);
  }

  describe("for a pending connection", () => {
    beforeEach(() => {
      status = "pending";
    });

    it("returns 'not connected'", () => {
      expect(subject()).toEqual("Not connected");
    });
  });

  describe("for a disconnected connection", () => {
    beforeEach(() => {
      status = "disconnected";
    });

    it("returns 'not connected'", () => {
      expect(subject()).toEqual("Not connected");
    });
  });

  describe("for a connected connection", () => {
    beforeEach(() => {
      status = "connected";
    });

    describe("when connected as is defined", () => {
      beforeEach(() => {
        connectedAs = "test-user";
      });

      it("returns 'Connected as ...'", () => {
        expect(subject()).toEqual("Connected as test-user");
      });
    });

    describe("when connected as is undefined", () => {
      beforeEach(() => {
        connectedAs = undefined;
      });

      it("returns Connected", () => {
        expect(subject()).toEqual("Connected");
      });
    });
  });

  describe("for an error connection", () => {
    beforeEach(() => {
      status = "error";
    });

    it("returns Login failed; please reconnect div", () => {
      expect(subject()).toEqual(
        <div>
          <img className="AppConnectionStatus__icon" src="test-file-stub" />
          <span>Login failed; please reconnect</span>
        </div>
      );
    });
  });
});
