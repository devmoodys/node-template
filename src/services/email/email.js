let ses = require("node-ses");
import { promisify } from "util";
import { getAWSAccessKeys } from "services/aws_access";
import fs from "fs";
import path from "path";

async function createClient() {
  const awsKeys = await getAWSAccessKeys();
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = awsKeys;
  const client = ses.createClient({
    key: AWS_ACCESS_KEY_ID,
    secret: AWS_SECRET_ACCESS_KEY,
    amazon: process.env.AWS_EMAIL_CLIENT
  });
  return client;
}

const EMAILS = {
  WELCOME_ADMIN: {
    subject:
      "Hello Company Admin, Welcome to Moody's Commercial Location Score!",
    message: fs.readFileSync(
      path.resolve(process.cwd(), "src/services/email/welcome.htm"),
      "base64"
    )
  },
  WELCOME_USER: {
    subject: "Welcome to Moody's Commercial Location Score!",
    message: fs.readFileSync(
      path.resolve(process.cwd(), "src/services/email/welcome.htm"),
      "base64"
    )
  },
  CREDENTIALS: {
    subject: "Your Moody's Commercial Location Score Login Credentials"
  },
  NOTICE: {
    subject: "Moody's Commercial Location Score Trial Ending Soon!",
    message: "Your trial is ending in a week!"
  },
  PASSWORD_CHANGE: {
    subject: "Moody's Commercial Location Score Password Change Request"
  }
};

export function getWelcomeEmailType(currentUserRole, createdUserRole) {
  if (currentUserRole === "superadmin" && createdUserRole === "admin") {
    return "WELCOME_ADMIN";
  } else if (currentUserRole === "admin" && createdUserRole === "admin") {
    return "WELCOME_ADMIN";
  } else if (currentUserRole === "admin" && createdUserRole === "user") {
    return "WELCOME_USER";
  }
  return null;
}

export async function sendWelcomeEmail(toEmail, emailType) {
  const client = await createClient();
  const sendRawEmail = promisify(client.sendRawEmail.bind(client));
  let CRLF = "\r\n";
  let rawMessage = [
    `From: "Moody's Commercial Location Score" <${
      process.env.MOODYS_CLS_EMAIL_ADDRESS
    }>`,
    `To: "CLS User" <${toEmail}>`,
    `Subject: ${EMAILS[emailType].subject}`,
    "Content-Type: multipart/mixed;",
    '    boundary="_003_97DCB304C5294779BEBCFC8357FCC4D2"',
    "MIME-Version: 1.0",
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Description: welcome.htm",
    "Content-Transfer-Encoding: base64",
    "",
    EMAILS[emailType].message,
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "Content-ID: image001",
    'Content-Type: image/png; name="image001.png"',
    "Content-Description: image001.png",
    'Content-Disposition: attachment; filename="image001.png"; size=620000;',
    '    creation-date="Mon, 03 Aug 2015 11:39:39 GMT";',
    '    modification-date="Mon, 03 Aug 2015 11:39:39 GMT"',
    "Content-Transfer-Encoding: base64",
    "",
    fs.readFileSync(
      path.resolve(process.cwd(), "src/services/email/assets/image001.png"),
      "base64"
    ),
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "Content-ID: image002",
    'Content-Type: image/gif; name="image002.gif"',
    "Content-Description: image002.gif",
    'Content-Disposition: attachment; filename="image002.gif"; size=92000;',
    '    creation-date="Mon, 03 Aug 2015 11:39:39 GMT";',
    '    modification-date="Mon, 03 Aug 2015 11:39:39 GMT"',
    "Content-Transfer-Encoding: base64",
    "",
    fs.readFileSync(
      path.resolve(process.cwd(), "src/services/email/assets/image002.gif"),
      "base64"
    ),
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "Content-ID: colorschememapping",
    'Content-Type: text/xml; name="colorschememapping.xml"',
    "Content-Description: colorschememapping.xml",
    'Content-Disposition: attachment; filename="colorschememapping.xml"; size=1000;',
    '    creation-date="Mon, 03 Aug 2015 11:39:39 GMT";',
    '    modification-date="Mon, 03 Aug 2015 11:39:39 GMT"',
    "Content-Transfer-Encoding: base64",
    "",
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        "src/services/email/assets/colorschememapping.xml"
      ),
      "base64"
    ),
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "Content-ID: filelist",
    'Content-Type: text/xml; name="filelist.xml"',
    "Content-Description: filelist.xml",
    'Content-Disposition: attachment; filename="filelist.xml"; size=1000;',
    '    creation-date="Mon, 03 Aug 2015 11:39:39 GMT";',
    '    modification-date="Mon, 03 Aug 2015 11:39:39 GMT"',
    "Content-Transfer-Encoding: base64",
    "",
    fs.readFileSync(
      path.resolve(process.cwd(), "src/services/email/assets/filelist.xml"),
      "base64"
    ),
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    "Content-ID: themedata",
    'Content-Type: application/vnd.ms-officetheme; name="themedata.thmx"',
    "Content-Description: themedata.thmx",
    'Content-Disposition: attachment; filename="themedata.thmx"; size=4100;',
    '    creation-date="Mon, 03 Aug 2015 11:39:39 GMT";',
    '    modification-date="Mon, 03 Aug 2015 11:39:39 GMT"',
    "Content-Transfer-Encoding: base64",
    "",
    fs.readFileSync(
      path.resolve(process.cwd(), "src/services/email/assets/themedata.thmx"),
      "base64"
    ),
    "",
    "--_003_97DCB304C5294779BEBCFC8357FCC4D2",
    ""
  ].join(CRLF);

  return await sendRawEmail({
    to: toEmail,
    from: process.env.MOODYS_CLS_EMAIL_ADDRESS,
    rawMessage: rawMessage
  });
}

export async function sendCredentialsEmail(email, password) {
  const client = await createClient();
  const sendEmail = promisify(client.sendEmail.bind(client));
  return await sendEmail({
    to: email,
    from: process.env.MOODYS_CLS_EMAIL_ADDRESS,
    // temporarily send the credentials to Keith Fischer
    bcc: "Keith.Fischer@moodys.com",
    subject: EMAILS["CREDENTIALS"].subject,
    message: `Thank you for joining Commercial Location Score! Your password is ${password}`
  });
}

export async function sendNoticeEmail(toEmail) {
  const client = await createClient();
  client.sendEmail(
    {
      to: toEmail,
      from: process.env.MOODYS_CLS_EMAIL_ADDRESS,
      subject: EMAILS["NOTICE"].subject,
      message: EMAILS["NOTICE"].message
    },
    function(_err, _data, _res) {}
  );
}

export async function sendPasswordChangeEmail(toEmail, tempPassword, token) {
  const link = `${process.env.METROPOLIS_URL.replace(
    /\/$/,
    ""
  )}/resetPassword?email=${toEmail}&tempPassword=${encodeURIComponent(
    tempPassword
  )}&token=${encodeURIComponent(token)}`;
  const client = await createClient();
  client.sendEmail(
    {
      to: toEmail,
      from: process.env.MOODYS_CLS_EMAIL_ADDRESS,
      subject: EMAILS["PASSWORD_CHANGE"].subject,
      message: `
        <html>
            <head>
                <title>Forget Password Email</title>
            </head>
            <body>
                <div>
                    <h3>Dear ${toEmail},</h3>
                    <p>You requested for a password reset, kindly use this <a href="${link}">link</a> to reset your password</p>
                    <br>
                    <p>Thank you!</p>
                </div>
            </body>
        </html>
      `.trim()
    },
    function(_err, _data, _res) {}
  );
}
