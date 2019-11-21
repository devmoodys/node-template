import {
  queryString,
  updateHistory,
  addFilterToSearch,
  removeFilterFromSearch,
  addPartnerFilterToSearch,
  addAllPartnerFiltersToSearch,
  removeAllPartnerFiltersFromSearch,
  filterEmptyPartners
} from "ui/helpers/filters";

import {
  NULL_PARTNER,
  searchForNoPartners,
  partnerAppNames
} from "ui/helpers/apps";
import { stringify } from "query-string";

describe("Filter Helpers", () => {
  let history = {
    location: { pathname: "/", search: "" },
    push: path => {
      const search = path.split("/").pop();
      history.location.search = search;
    }
  };

  afterEach(() => {
    history.location = { pathname: "/", search: "" };
  });

  describe("addFilterToSearch", () => {
    describe("when there no currently selected tags", () => {
      it("adds tag to history search", () => {
        addFilterToSearch(history, "newTag", { q: "turtle", tags: null });
        expect(history.location.search).toEqual("?q=turtle&tags=newTag");
      });
    });

    describe("when there are selected tags", () => {
      it("adds tag to history search", () => {
        addFilterToSearch(history, "newTag", {
          q: "badger",
          tags: ["oldTag1", "oldTag2"]
        });
        expect(history.location.search).toEqual(
          "?q=badger&tags=oldTag1&tags=oldTag2&tags=newTag"
        );
      });
    });

    describe("when the tag is already selected", () => {
      it("does not update the history search", () => {
        const currentSearch = "?q=fox&tags=oldTag1&tags=oldTag2&tags=oldTag3";
        history.location.search = currentSearch;
        addFilterToSearch(history, "oldTag2", {
          q: "fox",
          tags: ["oldTag1", "oldTag2", "oldTag3"]
        });
        expect(history.location.search).toEqual(currentSearch);
      });
    });

    describe("when partner filter exists", () => {
      it("maintains partner filter", () => {
        const currentSearch = "?q=bear&partners=val";
        history.location.search = currentSearch;
        addFilterToSearch(history, "newTag", {
          q: "bear",
          tags: [],
          partners: ["val"]
        });
        expect(history.location.search).toEqual(
          "?partners=val&q=bear&tags=newTag"
        );
      });
    });
  });

  describe("removeFilterFromSearch", () => {
    describe("when the tag is a current tag", () => {
      it("removes the tag from the filter", () => {
        removeFilterFromSearch(history, "oldTag2", {
          q: "mouse",
          tags: ["oldTag1", "oldTag2", "oldTag3"]
        });
        expect(history.location.search).toEqual(
          "?q=mouse&tags=oldTag1&tags=oldTag3"
        );
      });
    });

    describe("when there are no tags", () => {
      it("does not change the history search", () => {
        const currentSearch = "?q=bear";
        history.location.search = currentSearch;
        removeFilterFromSearch(history, "oldTag2", {
          q: "bear",
          tags: null
        });
        expect(history.location.search).toEqual(currentSearch);
      });
    });
    describe("when the tag is not a current tag", () => {
      it("does not change the history search", () => {
        const currentSearch = "?q=toad&tags=oldTag1&tags=oldTag2&tags=oldTag3";
        history.location.search = currentSearch;
        removeFilterFromSearch(history, "newTag", {
          q: "toad",
          tags: ["oldTag1", "oldTag2", "oldTag3"]
        });
        expect(history.location.search).toEqual(currentSearch);
      });
    });

    describe("when partner filters exist", () => {
      it("maintains partner filters", () => {
        const currentSearch = "?q=bear&partners=val&tags=oldTag";
        history.location.search = currentSearch;
        removeFilterFromSearch(history, "oldTag", {
          q: "bear",
          tags: ["oldTag"],
          partners: ["val"]
        });
        expect(history.location.search).toEqual("?partners=val&q=bear");
      });
    });
  });

  describe("addPartnerFilterToSearch", () => {
    describe("when user specifically did a search for NO partners, i.e. clicked the button to remove all app check boxes.", () => {
      it("adds partner filter to history search", () => {
        addPartnerFilterToSearch(history, "newApp", {
          q: "turtle",
          partners: searchForNoPartners()
        });
        expect(history.location.search).toEqual("?partners=newApp&q=turtle");
      });
    });

    describe("when there is a partner filter", () => {
      it("adds a partner filter with old partner filter", () => {
        addPartnerFilterToSearch(history, "newApp", {
          q: "badger",
          partners: ["oldApp"]
        });
        expect(history.location.search).toEqual(
          "?partners=oldApp&partners=newApp&q=badger"
        );
      });
    });
  });

  describe("addAllPartnerFiltersToSearch", () => {
    describe("when user clicks to add all partners to search", () => {
      it("adds partner filter to history search", () => {
        addAllPartnerFiltersToSearch(history, {
          q: "turtle"
        });
        expect(history.location.search).toEqual(
          "?" +
            stringify({ q: "turtle", partners: Object.keys(partnerAppNames) })
        );
      });
    });
  });

  describe("removeAllPartnerFiltersFromSearch", () => {
    describe("when user clicks to remove all partners from search", () => {
      it("creates a special search for NO partners", () => {
        removeAllPartnerFiltersFromSearch(history, {});
        expect(history.location.search).toEqual(`?partners=${NULL_PARTNER}`);
      });
    });
  });

  describe("queryString", () => {
    it("returns a query string from q and tags", () => {
      expect(queryString("/", "dog", ["tag1", "tag2", "tag3"])).toEqual(
        "/?q=dog&tags=tag1&tags=tag2&tags=tag3"
      );
    });

    it("uses the pathname", () => {
      expect(queryString("/widget", "cat", ["tag1", "tag2", "tag3"])).toEqual(
        "/widget?q=cat&tags=tag1&tags=tag2&tags=tag3"
      );
    });
  });

  describe("updateHistory", () => {
    it("updates the history search from q and tags", () => {
      updateHistory(history, "cat", ["tag1"]);
      expect(history.location.search).toEqual("?q=cat&tags=tag1");
    });
  });

  describe("filterEmptyPartners", () => {
    it("removes empty partners", () => {
      const partners = { cmm: 0, compstak: 3, val: 12 };
      expect(filterEmptyPartners(partners)).toEqual({ compstak: 3, val: 12 });
    });
  });
});
