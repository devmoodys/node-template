export function initializeSearchWidget(window, document) {
  const script = document.createElement("script");
  script.src = `${process.env.METROPOLIS_URL}dist/widgetLoader.js`;
  script.id = "metropolis-search-widget-script";
  script.setAttribute("data-app", "cls");
  script.setAttribute("data-trigger-class", "metropolis-search-widget-trigger");
  script.setAttribute("data-top-style", "57px");
  script.async = true;
  document.body.appendChild(script);
  window.Metropolis = {
    token: undefined,
    userNameRequesting: undefined,
    partner: undefined
  };
}
