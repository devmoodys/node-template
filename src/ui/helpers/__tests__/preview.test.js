import { FAILED, LOADED } from "ui/store/reducers/preview";
import { isAppLinkVisible, getTarget } from "../preview";

describe("isAppLinkVisible", () => {
  let partner;
  let type;
  let status;

  function subject() {
    return isAppLinkVisible(partner, type, status);
  }

  describe("when status is FAILED", () => {
    beforeEach(() => {
      partner = "compstak";
      type = "property";
      status = FAILED;
    });

    it("returns false", () => {
      expect(subject()).toEqual(false);
    });
  });

  describe("when status is LOADED", () => {
    beforeEach(() => {
      status = LOADED;
    });

    describe("when partner is cls", () => {
      beforeEach(() => {
        partner = "cls";
        type = "property";
      });

      it("returns false", () => {
        expect(subject()).toEqual(false);
      });
    });

    describe("when partner is cmbs", () => {
      beforeEach(() => {
        partner = "cmbs";
      });

      describe("when type is deal", () => {
        beforeEach(() => {
          type = "deal";
        });

        it("returns true", () => {
          expect(subject()).toEqual(true);
        });
      });

      describe("when type is loan", () => {
        beforeEach(() => {
          type = "loan";
        });

        it("returns false", () => {
          expect(subject()).toEqual(false);
        });
      });
    });
  });
});

describe("getTarget", () => {
  const app1 = "app1";
  const app2 = "app2";

  describe("when view is widget", () => {
    const view = "widget";

    describe("when partner and app are the same", () => {
      it("returns _top", () => {
        expect(getTarget(view, app1, app1)).toEqual("_top");
      });
    });
    describe("when partner and app are different", () => {
      it("returns _blank", () => {
        expect(getTarget(view, app1, app2)).toEqual("_blank");
      });
    });
  });
  describe("when view is main", () => {
    const view = "main";
    it("returns _blank", () => {
      expect(getTarget(view, app1, app1)).toEqual("_blank");
    });
  });
  describe("when view is null", () => {
    it("returns _blank", () => {
      expect(getTarget(null, app1, app1)).toEqual("_blank");
    });
  });
  describe("when view is undefined", () => {
    it("returns _blank", () => {
      expect(getTarget(undefined, app1, app1)).toEqual("_blank");
    });
  });
});
