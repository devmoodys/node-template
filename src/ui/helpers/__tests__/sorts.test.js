import {
  leaseFactory,
  propertyFactory,
  valuationFactory,
  noiFactory,
  trancheFactory,
  loanFactory
} from "__tests__/support/entities.factory";
import {
  sortLeases,
  sortProperties,
  largestTenantNames,
  totalSqftForTenant,
  topTrancheCusipIsins,
  topLoanNames
} from "ui/helpers/sorts";
import moment from "moment";

describe("sortLeases", () => {
  it("sorts leases first by tenantName", () => {
    const lease1 = leaseFactory.build({ tenantName: "Charlie" });
    const lease2 = leaseFactory.build({ tenantName: "Dillion" });
    const lease3 = leaseFactory.build({ tenantName: "Bob" });
    const lease4 = leaseFactory.build({ tenantName: "Alice" });

    const leases = [lease1, lease2, lease3, lease4];

    expect(sortLeases(leases)).toEqual([lease4, lease3, lease1, lease2]);
  });

  it("sorts by size after tenantName", () => {
    const lease1 = leaseFactory.build({ tenantName: "Charlie" });
    const lease2 = leaseFactory.build({ tenantName: "Dillion", size: 300 });
    const lease3 = leaseFactory.build({ tenantName: "Alice", size: 100 });
    const lease4 = leaseFactory.build({ tenantName: "Bob" });
    const lease5 = leaseFactory.build({ tenantName: "Dillion", size: 150 });
    const lease6 = leaseFactory.build({ tenantName: "Alice", size: 200 });

    const leases = [lease1, lease2, lease3, lease4, lease5, lease6];
    expect(sortLeases(leases)).toEqual([
      lease6,
      lease3,
      lease4,
      lease1,
      lease2,
      lease5
    ]);
  });

  it("sorts by most recent leaseStartDate after tenantName and size", () => {
    const lease1 = leaseFactory.build({
      tenantName: "Charlie",
      size: 400,
      leaseStartDate: moment("2016-02-01")
    });
    const lease2 = leaseFactory.build({ tenantName: "Dillion", size: 300 });
    const lease3 = leaseFactory.build({
      tenantName: "Alice",
      size: 100,
      leaseStartDate: moment("2017-05-25")
    });
    const lease4 = leaseFactory.build({ tenantName: "Bob" });
    const lease5 = leaseFactory.build({
      tenantName: "Charlie",
      size: 400,
      leaseStartDate: moment("2017-03-02")
    });
    const lease6 = leaseFactory.build({ tenantName: "Dillion", size: 150 });
    const lease7 = leaseFactory.build({
      tenantName: "Alice",
      size: 200,
      leaseStartDate: moment("2004-04-18")
    });

    const leases = [lease1, lease2, lease3, lease4, lease5, lease6, lease7];
    expect(sortLeases(leases)).toEqual([
      lease7,
      lease3,
      lease4,
      lease5,
      lease1,
      lease2,
      lease6
    ]);
  });
});

describe("sortProperties", () => {
  it("sorts properties first by valuation", () => {
    const val1 = valuationFactory.build({ valuation: 100 });
    const val2 = valuationFactory.build({ valuation: 200 });
    const val3 = valuationFactory.build({ valuation: 50 });
    const noi1 = noiFactory.build({ noi: 500 });
    const noi2 = noiFactory.build({ noi: 250 });
    const property1 = propertyFactory.build({
      valuations: [val1],
      noi: [noi2]
    });
    const property2 = propertyFactory.build({
      valuations: [val2],
      noi: property1.noi,
      msa: property1.msa,
      address: property1.address
    });
    const property3 = propertyFactory.build({
      valuations: [val3],
      noi: property1.noi,
      msa: property1.msa,
      address: property1.address
    });
    const property4 = propertyFactory.build({
      valuations: null,
      noi: [noi1],
      msa: property1.msa,
      address: property1.address
    });

    const properties = [property1, property2, property3, property4];

    expect(sortProperties(properties)).toEqual([
      property2,
      property1,
      property3,
      property4
    ]);
  });

  it("sorts properties by NOI after valuation", () => {
    const val1 = valuationFactory.build({ valuation: 100 });
    const val2 = valuationFactory.build({ valuation: 200 });
    const val3 = valuationFactory.build({ valuation: 50 });
    const noi1 = noiFactory.build({ noi: 500 });
    const noi2 = noiFactory.build({ noi: 250 });
    const property1 = propertyFactory.build({
      valuations: [val1],
      noi: [noi2]
    });
    const property2 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1]
    });
    const property3 = propertyFactory.build({
      valuations: [val1],
      noi: [noi1]
    });
    const property4 = propertyFactory.build({
      valuations: [val1],
      noi: null
    });
    const property5 = propertyFactory.build({
      valuations: [val3],
      noi: [noi2]
    });

    const properties = [property1, property2, property3, property4, property5];

    expect(sortProperties(properties)).toEqual([
      property2,
      property3,
      property1,
      property4,
      property5
    ]);
  });

  it("sorts properties by MSA after valuation and NOI", () => {
    const val1 = valuationFactory.build({ valuation: 100 });
    const val2 = valuationFactory.build({ valuation: 200 });
    const noi1 = noiFactory.build({ noi: 500 });
    const noi2 = noiFactory.build({ noi: 250 });
    const property1 = propertyFactory.build({
      valuations: [val1],
      noi: [noi2]
    });
    const property2 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: "Beta"
    });
    const property3 = propertyFactory.build({
      valuations: [val1],
      noi: [noi1]
    });
    const property5 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: null
    });
    const property4 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: "Alpha"
    });

    const properties = [property1, property2, property3, property4, property5];

    expect(sortProperties(properties)).toEqual([
      property4,
      property2,
      property5,
      property3,
      property1
    ]);
  });

  it("sorts properties by address after MSA after valuation and NOI", () => {
    const val1 = valuationFactory.build({ valuation: 100 });
    const val2 = valuationFactory.build({ valuation: 200 });
    const noi1 = noiFactory.build({ noi: 500 });
    const noi2 = noiFactory.build({ noi: 250 });
    const property1 = propertyFactory.build({
      valuations: [val1],
      noi: [noi2]
    });
    const property2 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: "Beta",
      address: "Alpha Address"
    });
    const property3 = propertyFactory.build({
      valuations: [val1],
      noi: [noi1]
    });
    const property4 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: "Alpha",
      address: "Beta Address"
    });
    const property5 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: "Alpha",
      address: "Charlie Address"
    });
    const property6 = propertyFactory.build({
      valuations: [val2],
      noi: [noi1],
      msa: "Alpha",
      address: null
    });

    const properties = [
      property1,
      property2,
      property3,
      property4,
      property5,
      property6
    ];

    expect(sortProperties(properties)).toEqual([
      property4,
      property5,
      property6,
      property2,
      property3,
      property1
    ]);
  });
});

describe("largestTenantNames", () => {
  it("removes not current leases", () => {
    const lease1 = leaseFactory.build({
      transactionSize: 5000,
      tenantName: "tenant1",
      leaseEndDate: moment(new Date())
        .add(-2, "days")
        .toDate()
    });
    const lease2 = leaseFactory.build({
      transactionSize: 4000,
      tenantName: "tenant2"
    });
    const sorted = largestTenantNames([lease1, lease2]);
    expect(sorted).toHaveLength(1);
    expect(sorted[0]).toEqual("tenant2");
  });

  it("returns list of 5 tenants in order", () => {
    const lease1 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: 500
    });
    const lease2 = leaseFactory.build({
      tenantName: "tenant2",
      transactionSize: 700
    });
    const lease3 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: 400
    });
    const lease4 = leaseFactory.build({
      tenantName: "tenant3",
      transactionSize: 600
    });
    const lease5 = leaseFactory.build({
      tenantName: "tenant4",
      transactionSize: 100
    });
    const lease6 = leaseFactory.build({
      tenantName: "tenant5",
      transactionSize: 200
    });
    const lease7 = leaseFactory.build({
      tenantName: "tenant6",
      transactionSize: 300
    });

    const leases = [lease1, lease2, lease3, lease4, lease5, lease6, lease7];
    expect(largestTenantNames(leases)).toEqual([
      "tenant1",
      "tenant2",
      "tenant3",
      "tenant6",
      "tenant5"
    ]);
  });
});

describe("totalSqftForTenant", () => {
  it("returns the sqft size of the largest sqft for a lease", () => {
    const lease1 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: 500
    });
    const lease2 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: 700
    });
    const lease3 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: 600
    });

    expect(totalSqftForTenant([lease1, lease2, lease3])).toEqual(1800);
  });

  it("works when a transaction size is null or undefined", () => {
    const lease1 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: null
    });
    const lease2 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: 700
    });
    const lease3 = leaseFactory.build({
      tenantName: "tenant1",
      transactionSize: undefined
    });

    expect(totalSqftForTenant([lease1, lease2, lease3])).toEqual(700);
  });

  it("returns 0 when the only transaction size is null", () => {
    const lease1 = leaseFactory.build({
      transactionSize: null
    });
    expect(totalSqftForTenant([lease1])).toEqual(0);
  });

  it("returns 0 when the only transaction size is undefined", () => {
    const lease1 = leaseFactory.build({
      transactionSize: undefined
    });
    expect(totalSqftForTenant([lease1])).toEqual(0);
  });
});

describe("topTrancheCusipIsins", () => {
  describe("given more than 10 tranches", () => {
    const tranches = [
      trancheFactory.build({ cusipIsin: "cusipIsin1" }),
      trancheFactory.build({ cusipIsin: "cusipIsin2" }),
      trancheFactory.build({ cusipIsin: "cusipIsin3" }),
      trancheFactory.build({ cusipIsin: "cusipIsin4" }),
      trancheFactory.build({ cusipIsin: "cusipIsin5" }),
      trancheFactory.build({ cusipIsin: "cusipIsin6" }),
      trancheFactory.build({ cusipIsin: "cusipIsin7" }),
      trancheFactory.build({ cusipIsin: "cusipIsin8" }),
      trancheFactory.build({ cusipIsin: "cusipIsin9" }),
      trancheFactory.build({ cusipIsin: "cusipIsin10" }),
      trancheFactory.build({ cusipIsin: "cusipIsin11" }),
      trancheFactory.build({ cusipIsin: "cusipIsin12" })
    ];
    it("returns the first 10 cusipIsins", () => {
      expect(topTrancheCusipIsins(tranches)).toEqual([
        "cusipIsin1",
        "cusipIsin2",
        "cusipIsin3",
        "cusipIsin4",
        "cusipIsin5",
        "cusipIsin6",
        "cusipIsin7",
        "cusipIsin8",
        "cusipIsin9",
        "cusipIsin10"
      ]);
    });
  });

  describe("given less than 10 tranches", () => {
    describe("given more than 0 tranches", () => {
      const tranches = [
        trancheFactory.build({ cusipIsin: "cusipIsin1" }),
        trancheFactory.build({ cusipIsin: "cusipIsin2" })
      ];
      it("returns all the cusipIsins", () => {
        expect(topTrancheCusipIsins(tranches)).toEqual([
          "cusipIsin1",
          "cusipIsin2"
        ]);
      });
    });

    describe("given 0 tranches", () => {
      const tranches = [];

      it("returns and empty list", () => {
        expect(topTrancheCusipIsins(tranches)).toEqual([]);
      });
    });
  });
});

describe("topLoanNames", () => {
  describe("given one or more loans", () => {
    const loans = [
      loanFactory.build({ loanName: "loanName1" }),
      loanFactory.build({ loanName: "loanName2" }),
      loanFactory.build({ loanName: "loanName3" }),
      loanFactory.build({ loanName: "loanName4" })
    ];
    it("returns a list of the loan names", () => {
      expect(topLoanNames(loans)).toEqual([
        "loanName1",
        "loanName2",
        "loanName3",
        "loanName4"
      ]);
    });
  });

  describe("given an empty list", () => {
    it("returns an empty list", () => {
      expect(topLoanNames([])).toEqual([]);
    });
  });
});
