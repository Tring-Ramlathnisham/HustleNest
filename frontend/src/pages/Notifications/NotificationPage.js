import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../context/notificationSlice";
import NotificationCard from "../../components/NotificationCard";
import styles from "../../styles/Dashboard.module.css";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  useEffect(() => {
    dispatch(addNotification({ id: 1, message: "Your proposal was accepted!", createdAt: new Date() }));
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationPage;
