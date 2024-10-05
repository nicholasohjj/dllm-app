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
  vapidKeys.privateKey
);

let subscriptions = []; // Store subscriptions in memory

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or specify the origin like 'http://localhost:5173'
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
    // Handle the preflight request
    res.status(200).end();
    return;
  }
  
  if (req.method === "POST") {
    const { machineId, subscription } = req.body;

    // Add the subscription to the list
    subscriptions.push({ machineId, subscription });

    console.log(`User subscribed to machine ${machineId}`);
    return res.status(201).json({ message: "Subscribed successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
