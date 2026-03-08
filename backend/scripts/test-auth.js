import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

// Load .env from backend/ (since cwd = backend/ when running from there)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_REDIRECT_URI,
} = process.env;

console.log("Testing OAuth2...");
console.log("Client ID loaded:", GOOGLE_CLIENT_ID ? "Yes" : "No");
console.log("Refresh token loaded:", GOOGLE_REFRESH_TOKEN ? "Yes" : "No");

if (!GOOGLE_REFRESH_TOKEN) {
  console.error("❌ Missing refresh token");
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

oAuth2Client
  .getAccessToken()
  .then((response) => {
    console.log("✅ Success! Access token fetched:");
    console.log(
      "Token:",
      response.token ? "Valid (not printing for security)" : "Invalid"
    );
    console.log(
      "Expires in:",
      response.expiry_date
        ? new Date(response.expiry_date).toISOString()
        : "N/A"
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed to fetch access token:");
    console.error("Error:", error.message);
    if (error.code === "ENOTFOUND") {
      console.error("Network issue—check internet connection.");
    } else if (error.code === 400) {
      console.error(
        "Likely invalid/revoked token or mismatched client/redirect URI."
      );
    } else if (error.code === 401) {
      console.error("Unauthorized—check client secret or scopes.");
    }
    process.exit(1);
  });
