import { acceptTermsOfService } from "services/users";

export async function acceptTerms(request, response) {
  const { id: userId } = request.user;
  await acceptTermsOfService(userId);
  response.sendStatus(200);
}
