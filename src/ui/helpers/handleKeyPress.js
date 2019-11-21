import { sendMessageToParent } from "ui/helpers/messaging";

export default function handleKeyPress(e) {
  const key = e.key || e.keyCode;

  if (key === 27 || key === "Escape" || key === "Esc") {
    sendMessageToParent("metropolis.closeWidget");
  }
}
