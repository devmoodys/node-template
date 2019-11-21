export const FLASH_SHOW = "FLASH_SHOW";
export const FLASH_CLEAR = "FLASH_CLEAR";

export function showFlash(flash) {
  return function(dispatch) {
    dispatch({ flash, type: FLASH_SHOW });

    if (flash.type === "success") {
      setTimeout(function() {
        dispatch(clearFlash());
      }, 8000);
    }
  };
}

export function clearFlash() {
  return { type: FLASH_CLEAR };
}
