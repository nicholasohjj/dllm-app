export default async (req, res) => {
  if (req.method === "POST") {
    const subscription = req.body;

    // Remove this subscription from your database.
    // Here’s a mockup:
    await removeSubscriptionFromDatabase(subscription);

    res.status(201).json({ message: "Unsubscribed" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

// Mock function to simulate removal from a database
async function removeSubscriptionFromDatabase(subscription) {
  // In production, remove the subscription from your preferred database.
  console.log("Subscription removed from DB:", subscription);
}
