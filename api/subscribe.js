import { WebPush } from "web-push";

// Make sure you generate VAPID keys (see below)
const publicKey =
  "BHQcDrGdqk0yOnKqH-ZRalMsvO8iAcKWInaBrp27Wsr6NJ5gHoGAREwTJwdtXvbvPjSzZneZ7QPDY5OUm-q_ix8";
const privateKey = "BQvKmklEPSD64pLHlmSYnWUkR8mxolW2Oyr_00lFtLg";

WebPush.setVapidDetails("mailto:your-email@example.com", publicKey, privateKey);

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
