import {
  addPartnerToSearchQuery,
  removePartnerFromSearchQuery,
  addAllPartnersToSearchQuery,
  removeAllPartnersFromSearchQuery
} from "ui/helpers/search";

import { partnerAppNames } from "ui/helpers/apps";

jest.mock("ui/store/actions/search", () => {
  return { updateSearch: jest.fn() };
});

const mockUpdateSearch = require("ui/store/actions/search").updateSearch;

describe("Search Helpers", () => {
  afterEach(() => {
    mockUpdateSearch.mockClear();
  });

  describe("addPartnerToSearchQuery", () => {
    describe("when partner is not in search query", () => {
      it("adds partner to search query", () => {
        addPartnerToSearchQuery(
          "newApp",
          {
            q: "turtle",
            tags: ["a", "b"],
            partners: ["app1", "app2"]
          },
          mockUpdateSearch
        );
        expect(mockUpdateSearch).toHaveBeenCalledWith(
          "turtle",
          ["a", "b"],
          ["app1", "app2", "newApp"]
        );
      });
    });
    describe("when partner is in search query already", () => {
      it("does not update the search query", () => {
        addPartnerToSearchQuery(
          "newApp",
          {
            q: "turtle",
            tags: ["a", "b"],
            partners: ["newApp", "app2"]
          },
          mockUpdateSearch
        );
        expect(mockUpdateSearch).not.toHaveBeenCalled();
      });
    });
  });

  describe("removePartnerFromSearchQuery", () => {
    describe("when partner is in search query", () => {
      it("removes partner from search query", () => {
        removePartnerFromSearchQuery(
          "newApp",
          {
            q: "turtle",
            tags: ["a", "b"],
            partners: ["newApp", "app2"]
          },
          mockUpdateSearch
        );
        expect(mockUpdateSearch).toHaveBeenCalledWith(
          "turtle",
          ["a", "b"],
          ["app2"]
        );
      });
    });
    describe("when partner is not in search query", () => {
      it("does not make a call to update the search query", () => {
        removePartnerFromSearchQuery(
          "newApp",
          {
            q: "turtle",
            tags: ["a", "b"],
            partners: ["app1", "app2"]
          },
          mockUpdateSearch
        );
        expect(mockUpdateSearch).not.toHaveBeenCalled();
      });
    });
  });

  describe("addAllPartnersToSearchQuery", () => {
    it("adds all partners to search query", () => {
      addAllPartnersToSearchQuery(
        {
          q: "turtle",
          tags: ["a", "b"],
          partners: []
        },
        mockUpdateSearch
      );
      expect(mockUpdateSearch).toHaveBeenCalledWith(
        "turtle",
        ["a", "b"],
        Object.keys(partnerAppNames)
      );
    });
  });
  describe("removeAllPartnersFromSearchQuery", () => {
    it("removes all partners from search query", () => {
      removeAllPartnersFromSearchQuery(
        {
          q: "turtle",
          tags: ["a", "b"],
          partners: Object.keys(partnerAppNames)
        },
        mockUpdateSearch
      );
      expect(mockUpdateSearch).toHaveBeenCalledWith("turtle", ["a", "b"], []);
    });
  });
});
