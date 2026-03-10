import { useEffect, type Dispatch } from "react";
import type { NotificationType } from "../../../types";
import closeBtn from "../../../../../assets/close.svg";
import "../../../styles/notification.css";
interface Params {
  message: string;
  func: Dispatch<React.SetStateAction<NotificationType | null>>;
  type: "Error" | "Warning" | "Success" | "Info";
}

export function Notifications({ message, func, type }: Params) {
  useEffect(() => {
    const timer = setTimeout(() => {
      func(null);
    }, 7000);

    return () => clearTimeout(timer);
  }, [func]);
  return (
    <div className={`notification notification-${type}`}>
      <div className={`notification-color notification-color-${type}`}></div>
      <div className="notification-content">
        <span className={`notification-type notification-type-${type}`}>
          {type}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <div className="close-button-container" onClick={() => func(null)}>
        <img src={closeBtn} alt="close-button" className="close-btn-icon" />
      </div>
    </div>
  );
}
