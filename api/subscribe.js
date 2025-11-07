import { WebPush } from "web-push";

// VAPID keys should be stored in environment variables
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || "mailto:your-email@example.com";

if (!publicKey || !privateKey) {
  throw new Error(
    "VAPID keys are not configured. Please set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables."
  );
}

WebPush.setVapidDetails(subject, publicKey, privateKey);

export default async (req, res) => {
  if (req.method === "POST") {
    const subscription = req.body;

    // Store this subscription in your database, e.g., Firestore, DynamoDB, etc.
    // Here’s a mockup:
    await saveSubscriptionToDatabase(subscription);

    res.status(201).json({ message: "Subscription saved" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

// Mock function to simulate saving to a database
async function saveSubscriptionToDatabase(subscription) {
  // In production, use your preferred database to save the subscription.
  console.log("Subscription saved to DB:", subscription);
}
