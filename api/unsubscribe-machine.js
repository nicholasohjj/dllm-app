import { VercelRequest, VercelResponse } from "@vercel/node";
import webPush from "web-push";

const vapidKeys = {
  publicKey:
    "BM6VW3YncLm4CzZ1zt3OT_PXH87VSN7q6WT8-eiBzHiuxMwY5F3HLJvjvBQMf_cVPdnZ7axmuE8Nd4VCl3wCj-M",
  privateKey: "RIApaixhWCRYx0J2AA6lldyxVUaq_DX0zEEmqD0F5sc",
};

webPush.setVapidDetails(
  "mailto:your-email@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

// Store subscriptions in memory (use a database in production)
let subscriptions = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { machineId, subscription } = req.body;

    // Remove the subscription from the list
    subscriptions = subscriptions.filter(
      (sub) =>
        sub.machineId !== machineId ||
        sub.subscription.endpoint !== subscription.endpoint,
    );

    console.log(`User unsubscribed from machine ${machineId}`);
    return res.status(200).json({ message: "Unsubscribed successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
