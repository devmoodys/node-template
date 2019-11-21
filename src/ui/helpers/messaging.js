export function sendMessageToParent(action, payload) {
  window.parent.postMessage({ action, payload }, "*");
}

export function sendMessageToCurrentWindow(action, payload) {
  window.postMessage({ action, payload }, "*");
}
