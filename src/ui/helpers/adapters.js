export function sortAdapters(adapters) {
  let partnerAdapters = {
    cmbs: [],
    cmm: [],
    compstak: [],
    val: [],
    reis: []
  };

  adapters.forEach(adapter => {
    partnerAdapters[adapter.adapter_json.partner].push(adapter);
  });

  return partnerAdapters;
}

export function selectAdapterById(adapters, id) {
  let result;
  adapters.forEach(adapter => {
    if (adapter.id === parseInt(id)) {
      result = adapter;
    }
  });
  return result;
}

export function returnAdapterRows(config, partner) {
  const { mappings } = config;
  let rows = [];

  for (let key in mappings) {
    const arr = [AdapterHeader(key), ...getMappings(mappings[key], partner)];
    rows = [...rows, ...arr];
  }

  return rows;
}

function getMappings(mappingsKey, partner) {
  let mappingsArr = [];
  for (let src in mappingsKey) {
    if (mappingsKey[src].hasOwnProperty("value")) {
      mappingsArr.push(returnValueRow(src, mappingsKey[src].value, partner));
    } else if (mappingsKey[src].hasOwnProperty("func")) {
      mappingsArr.push(
        returnFuncRow(
          src,
          mappingsKey[src].func,
          partner,
          mappingsKey[src].desc
        )
      );
    } else if (mappingsKey[src].hasOwnProperty("path")) {
      mappingsArr.push(returnPathRow(src, mappingsKey[src].path, partner));
    }
  }

  return mappingsArr;
}

function valueToString(val) {
  const type = typeof val;
  switch (type) {
    case "object":
    case "undefined":
      return type;
    case "boolean":
      return val ? "true" : "false";
    case "string":
      return val;
    default:
      return "";
  }
}

const AdapterHeader = name => ({
  type: "header",
  name
});

const returnValueRow = (key, value, partner) => {
  const stringValue = valueToString(value);
  return {
    key,
    value: stringValue,
    type: "value",
    partner
  };
};

const returnFuncRow = (key, value, partner, desc) => ({
  key,
  value,
  type: "func",
  desc,
  partner
});

const returnPathRow = (key, value, partner) => {
  const joined = value.join(" → ");
  return { key, value: joined, type: "path", partner };
};
