import { showFlash } from "./flash";
import { apiFetch } from "ui/store/actions/apiClient";

export function createUserinIndividualSubWaitlist(email) {
  return async function(dispatch) {
    let fetchOptions = {
      method: "post",
      body: JSON.stringify({ email })
    };

    try {
      const response = await apiFetch(
        `/api/individ_subscription_interest/new`,
        fetchOptions
      );

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.error);
      }

      dispatch(
        showFlash({
          type: "success",
          message: `Thank you for providing your email: ${email}!`
        })
      );
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
