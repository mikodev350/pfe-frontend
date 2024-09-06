// Vérifier la permission des notifications :
export function checkNotificationPermission() {
  if (Notification.permission === "granted") {
    return true; // L'utilisateur a autorisé les notifications
  } else if (Notification.permission === "denied") {
    console.log("Notifications sont bloquées par l'utilisateur.");
    return false; // L'utilisateur a bloqué les notifications
  } else {
    // Demande la permission à l'utilisateur
    return Notification.requestPermission().then((permission) => {
      return permission === "granted";
    });
  }
}

async function triggerNotification(endpoint, message, url) {
  try {
    await fetch("http://localhost:1337/api/subscribe/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint, message, url }), // Envoie l'endpoint au backend pour déclencher la notification
    });
  } catch (error) {
    console.error("Failed to trigger notification:", error);
  }
}

// Cette fonction vérifie si l'utilisateur est déjà abonné aux notifications push.
// Elle attend que le service worker soit prêt, puis utilise le PushManager pour obtenir l'abonnement actuel.
// Si l'utilisateur est abonné, elle retourne l'endpoint unique de cet abonnement (une URL).
// Si l'utilisateur n'est pas abonné, elle retourne null.

export async function getUserSubscription() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return subscription ? subscription.endpoint : null;
}

// ici pour notifier utiisateur ancec le pop Up
export async function notifyUser(message, url) {
  // Vérifiez si les notifications sont autorisées
  const isAllowed = await checkNotificationPermission();

  if (isAllowed) {
    // Récupérez l'abonnement de l'utilisateur
    const endpoint = await getUserSubscription();

    if (endpoint) {
      // Déclenchez la notification

      const messagePush = message;
      await triggerNotification(endpoint, messagePush, url);
    } else {
      console.log("L'utilisateur n'est pas abonné aux notifications.");
    }
  } else {
    console.log("Les notifications ne sont pas autorisées.");
  }
}
