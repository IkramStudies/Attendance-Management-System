import { google } from "googleapis";
import { writeFileSync } from "fs";

const { client_id, client_secret, redirect_uris } = {
  /* Paste from credentials.json */
};
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Visit this URL to authorize:", authUrl);
// Paste the 'code' from callback URL here
const readline = require("readline").createInterface({ input: process.stdin });
readline.question("Enter the code from callback: ", async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log("Refresh Token:", tokens.refresh_token);
  writeFileSync("tokens.json", JSON.stringify(tokens));
  readline.close();
});
