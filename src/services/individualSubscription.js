import connection from "systems/db";

export async function addUserToIndividualSubWaitlist(email) {
  const individ = await connection
    .insert({
      email: email
    })
    .into("individ_subscription_interest")
    .returning("*");
  return individ[0];
}
