import { acceptTermsOfService } from "services/users";

export async function acceptTerms(request, response) {
  await acceptTermsOfService(request.user);
  response.sendStatus(200);
}
