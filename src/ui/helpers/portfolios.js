export function shouldRenderCreatePorfolio(history) {
  return (
    history.location.pathname === "/widget/search" ||
    history.location.pathname === "/widget/portfolios/home"
  );
}

export function shouldRenderAddSearchToPortfolio(history) {
  return history.location.pathname === "/widget/";
}

export function shouldRenderAddSearches(history) {
  return history.location.pathname.match(/\/widget\/portfolio\//);
}

export function viewingCLSDataFromOtherPartner(data) {
  return data.clsData && data.locationScoreObj;
}
