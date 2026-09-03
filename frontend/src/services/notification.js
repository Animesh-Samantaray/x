export const getNotificationPermission = () => {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return "unsupported";
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (error) {
    console.warn("Notification permission request error:", error);
    return Notification.permission;
  }
};

export const sendDesktopNotification = ({ title, body, icon, tag, onClick }) => {
  if (!("Notification" in window)) return null;
  if (Notification.permission !== "granted") return null;

  try {
    const notif = new Notification(title, {
      body: body || "",
      icon: icon || "/favicon.ico",
      tag: tag || "chat_notification",
      renotify: true,
    });

    notif.onclick = (e) => {
      e.preventDefault();
      try {
        window.focus();
      } catch (err) {
        // ignore
      }
      if (typeof onClick === "function") {
        onClick();
      }
      notif.close();
    };

    return notif;
  } catch (error) {
    console.warn("Error creating desktop notification:", error);
    return null;
  }
};

export default {
  getNotificationPermission,
  requestNotificationPermission,
  sendDesktopNotification,
};
