import { externalApiFetch } from "ui/store/actions/apiClient";
import { parse } from "query-string";

export async function usernameTokenLogin(queryString) {
  const queryObject = parse(queryString);
  const { userNameRequesting, token } = queryObject;
  const decodedToken = decodeURIComponent(token);
  try {
    const response = await externalApiFetch(
      `/usernameTokenLogin`,
      {
        method: "post",
        body: JSON.stringify({ username: userNameRequesting, queryString })
      },
      decodedToken
    );
    if (response.ok) {
      window.location.href = `/${queryString}`;
    }
    return true;
  } catch (e) {
    return false;
  }
}
