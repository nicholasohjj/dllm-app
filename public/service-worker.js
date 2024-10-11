importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');


// Initialize Firebase in the service worker (provide actual values, do not use import.meta.env here)
firebase.initializeApp({
  apiKey: "AIzaSyBG4Cjv4IgMMj_WPVn6tcDn8hlutqjOaqs",
  authDomain: "dllm-nus.firebaseapp.com",
  projectId: "dllm-nus",
  storageBucket: "dllm-nus.appspot.com",
  messagingSenderId: "886820700793",
  appId: "1:886820700793:web:b35a0f55edf35983528aa8",
  measurementId: "G-M7F7XJ2ER4"
});


const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
