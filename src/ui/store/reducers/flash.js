import { FLASH_SHOW, FLASH_CLEAR } from "ui/store/actions/flash";

export default function flash(state = {}, action) {
  switch (action.type) {
    case FLASH_SHOW: {
      const { flash } = action;
      return flash;
    }
    case FLASH_CLEAR:
      return {};
    default:
      return state;
  }
}
