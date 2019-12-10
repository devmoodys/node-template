import {
  changePassword,
  checkTemporaryPassword,
  findUserByEmail
} from "services/users";

export async function resetPassword(req, res) {
  const { email, tempPassword, newPassword } = req.body;
  const user = await findUserByEmail(email);
  if (!newPassword.match(/^[a-zA-Z0-9]{8,}$/)) {
    return res.status(409).send({
      error:
        "password must only contain alphanumeric characters and be longer than 8 characters"
    });
  }
  if (!user) {
    return res.status(409).send({ error: "error occurred!" });
  }
  const authorized = await checkTemporaryPassword(user, tempPassword);
  if (!authorized) {
    return res
      .status(409)
      .send({ error: "password reset link is invalid or has expired" });
  }
  await changePassword(user, newPassword);
  res.sendStatus(200);
}
