import { useState, useEffect } from "react";

const useNotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      setPermission("denied");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      setPermission("denied");
      return;
    }
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  };

  return { permission, requestPermission };
};

export default useNotificationPermission;
