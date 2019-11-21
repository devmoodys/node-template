import { DROP_PINS, dropPins, normalizeMapParams } from "../mapWidget";
import mockStore from "__tests__/support/mockStore";

let store;
const params = [
  {
    dropPin: true,
    param1: "PARAM1",
    param2: null,
    param3: "PARAM3",
    PARAM4: undefined
  }
];

const cleanedParams = {
  dropPin: true,
  param1: "PARAM1",
  param3: "PARAM3"
};

beforeEach(() => {
  store = mockStore({});
});

afterEach(() => {
  fetch.resetMocks();
});

describe("dropPins", () => {
  let actionCreator;

  describe("when params are passed with dropPin true", () => {
    beforeEach(() => {
      actionCreator = dropPins(params);
    });

    it("dispatches DROP_PINS with cleaned params", async () => {
      await store.dispatch(actionCreator);
      expect(store.getActions()).toContainEqual({
        pins: [cleanedParams],
        type: DROP_PINS
      });
    });
  });
});

describe("normalizeMapParams", () => {
  it("removes empty values", () => {
    const nullParams = {
      PARAM1: "PARAM1",
      NULLPARAM: null,
      PARAM3: "PARAM3",
      UNDEFINED_PARAM: undefined
    };
    expect(normalizeMapParams(nullParams)).toEqual({
      PARAM1: "PARAM1",
      PARAM3: "PARAM3"
    });
  });

  it("stringifies everything but dropPin", () => {
    const randomTypeParams = {
      PARAM1: 1,
      dropPin: true,
      PARAM3: false,
      PARAM4: "PARAM4",
      PARAM5: () => 1
    };
    expect(normalizeMapParams(randomTypeParams)).toEqual({
      PARAM1: "1",
      dropPin: true,
      PARAM3: "false",
      PARAM4: "PARAM4",
      PARAM5: "function PARAM5() {return 1;}"
    });
  });
});
