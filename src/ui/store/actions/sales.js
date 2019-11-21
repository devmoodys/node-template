import { showFlash } from "./flash";
import { externalApiFetch, apiFetch } from "./apiClient";
import { isURIComponentPresent } from "helpers/presence";

export function emailSalesToSetupCLSUser(username, token) {
  return async function(dispatch) {
    let fetchOptions = {
      method: "post",
      body: JSON.stringify({ username: username })
    };

    try {
      let response;
      if (isURIComponentPresent(token)) {
        response = await externalApiFetch(
          "api/v1/sales",
          fetchOptions,
          decodeURIComponent(token)
        );
      } else {
        response = await apiFetch("api/sales", fetchOptions);
      }

      if (response.ok) {
        dispatch(
          showFlash({
            type: "success",
            message: "Email was sent to your sales representative"
          })
        );
      } else {
        dispatch(
          showFlash({
            type: "error",
            message:
              "Email could not be sent to your sales representative. Please try again later"
          })
        );
      }
    } catch (e) {
      dispatch(
        showFlash({
          type: "error",
          message: `${e}`
        })
      );
    }
  };
}
