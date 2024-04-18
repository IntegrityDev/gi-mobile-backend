import * as dotEnv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
  const configFile: string = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

export const {
  PORT,
  MONGODB_URI: DB_URL,
  APP_SECRET,
  BUCKET_NAME,
  BUCKET_REGION,
  ACCESS_KEY,
  SECRET_ACCESS_KEY,
  SENDER_EMAIl,
  SENDER_EMAIL_PASSWORD,
  SENDGRID_KEY,
  ONESIGNAL_APP_ID,
  ONESIGNAL_API_KEY,
  EXPO_ACCESS_TOKEN
} = process.env;
