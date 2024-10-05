import { VercelRequest, VercelResponse } from '@vercel/node';
import webPush from 'web-push';

const vapidKeys = {
  publicKey:
    'BM6VW3YncLm4CzZ1zt3OT_PXH87VSN7q6WT8-eiBzHiuxMwY5F3HLJvjvBQMf_cVPdnZ7axmuE8Nd4VCl3wCj-M',
  privateKey: 'RIApaixhWCRYx0J2AA6lldyxVUaq_DX0zEEmqD0F5sc',
};

webPush.setVapidDetails('mailto:your-email@example.com', vapidKeys.publicKey, vapidKeys.privateKey);

let subscriptions = []; // Store subscriptions in memory

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { machineId, status } = req.body;

    console.log(`Machine ${machineId} status: ${status}`);

    if (status === 'complete') {
      const subscribedUsers = subscriptions.filter((sub) => sub.machineId === machineId);

      const payload = JSON.stringify({
        title: 'Laundry Done!',
        body: `Your laundry on machine ${machineId} is complete.`,
      });

      // Send push notification to all subscribed users
      subscribedUsers.forEach((user) => {
        webPush
          .sendNotification(user.subscription, payload)
          .then(() => console.log('Notification sent'))
          .catch((error) => console.error('Error sending notification', error));
      });
    }

    res.sendStatus(200);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
