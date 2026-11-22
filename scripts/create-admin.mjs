import { MongoClient } from "mongodb";

// Node 24 can read the env file directly
try {
  process.loadEnvFile(".env.local");
} catch {
  /* the variables may already be set in the shell */
}

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
const name = (process.env.ADMIN_NAME || "Salon Admin").trim();
const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD, for example:");
  console.error("ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='Strong123' node scripts/create-admin.mjs");
  process.exit(1);
}
if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
  console.error("Password needs 6+ characters with one uppercase and one lowercase letter");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  const users = client.db(process.env.DB_NAME || "salonbook").collection("users");

  const existing = await users.findOne({ email });

  if (existing) {
    console.log("User already exists. Promoting it to admin. Its password is NOT changed.");
  } else {
    // The Next.js dev server must be running so Better Auth creates the user
    const res = await fetch(`${appUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: appUrl },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      console.error("Sign-up failed:", res.status, await res.text());
      console.error("Is the client running at", appUrl, "?");
      process.exit(1);
    }
  }

  const result = await users.updateOne(
    { email },
    { $set: { role: "admin", isBlocked: false, emailVerified: true, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    console.error("Could not find the user after sign-up");
    process.exit(1);
  }
  console.log(`Admin ready: ${email}`);
} catch (err) {
  console.error("Failed:", err.message);
  process.exit(1);
} finally {
  await client.close();
}