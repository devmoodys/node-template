import {
  contains,
  curry,
  intersection,
  keys,
  map,
  values,
  mergeAll
} from "ramda";

export const PROPERTY = "property";
export const COUNTER_PARTY = "counterParty";
export const INSTRUMENT = "instrument";

const dataTagLabels = {
  [PROPERTY]: {
    addressInformation: "Address Information",
    assetManager: "Asset Manager",
    cfAnalysis: "CF Analysis",
    landlordBroker: "Landlord Broker",
    leaseInformation: "Lease Information",
    lender: "Lender",
    msaRegion: "MSA/Region",
    noi: "NOI",
    propertyDetails: "Property Details",
    propertyImage: "Property Image",
    propertyName: "Property Name",
    propertyType: "Property Type",
    valuation: "Valuation",
    rentPsf: "Rent Per Square Foot",
    rentChange: "Percent Rent Change",
    taxInfo: "Tax Info",
    vacancyInfo: "Vacancy Info"
  },
  [COUNTER_PARTY]: {
    propertyLandlord: "Property Landlord",
    propertyManager: "Property Manager",
    tenantName: "Tenant Name"
  },
  [INSTRUMENT]: {
    loanId: "Loan ID",
    loanName: "Loan Name",
    originationDate: "Origination Date",
    maturityDate: "Maturity Date",
    loanBalance: "Loan Balance",
    couponInformation: "Coupon Information",
    paymentType: "Payment Type",
    amortizationTerm: "Amortization Term",
    dealId: "Deal ID",
    dealName: "Deal Name"
  }
};

const dataTagMeta = curry(function(selectedTags, type, tag) {
  const label = dataTagLabels[type][tag];
  const selected = contains(tag, selectedTags);
  return { tag, label, type, selected };
});

export function dataTagsMeta(tags, type, selectedTags = []) {
  const recognizedTags = intersection(keys(dataTagLabels[type]), tags);
  return map(dataTagMeta(selectedTags, type), recognizedTags);
}

export function convertTagToReadable(tag) {
  return mergeAll(values(dataTagLabels))[tag];
}

export function returnAllTags(category) {
  let tags = [];

  const obj = dataTagLabels[category];

  for (let tag in obj) {
    tags.push(tag);
  }

  return tags;
}
