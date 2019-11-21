export function getClient(clientId) {
  const clientIDMapping = {
    [process.env.CATYLIST_CLIENT_ID]: "catylist",
    [process.env.REIS_CLIENT_ID]: "reis",
    [process.env.VAL_CLS_CLIENT_ID]: "val",
    [process.env.CLS_CLIENT_ID]: "cls",
    [process.env.MA_NY_RESEARCH_CLIENT_ID]: "ma-ny-research",
    [process.env.CRE_RESEARCH_TEAM_CLIENT_ID]: "cre-research"
  };
  return clientIDMapping[clientId];
}
