import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { db } from "./mongodb";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  trustedOrigins: [baseURL],

  user: {
    // The Express server reads this collection, so the name must be "users"
    modelName: "users",
    additionalFields: {
      // input: false means nobody can set these through sign-up or profile update.
      // This is what keeps public registration from creating admins.
      role: { type: "string", required: false, defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      phone: { type: "string", required: false, input: true },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  ...(googleEnabled
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        },
      }
    : {}),

  // Server-side password rule (the form checks it too, but the server is the real gate)
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = String(ctx.body?.password ?? "");
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain at least one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        // Must match AUTH_ISSUER on the Express server
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "1h",
        // Keep the token small. Express looks up role and blocked state in the database.
        definePayload: ({ user }) => ({ id: user.id }),
      },
    }),
  ],
});