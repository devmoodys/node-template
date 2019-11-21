import { addUserToIndividualSubWaitlist } from "services/individualSubscription.js";

export async function addUserToIndivSubWaitlist(req, res) {
  const { email } = req.body;
  if (typeof email !== "string" || email === "") {
    return res.status(409).send({ error: "email cannot be blank!" });
  }
  await addUserToIndividualSubWaitlist(email);
  res.sendStatus(200);
}
