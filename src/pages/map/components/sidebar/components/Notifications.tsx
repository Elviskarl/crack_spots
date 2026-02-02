import { useEffect, type Dispatch } from "react";
import type { ErrorMessage } from "../../../types";
interface Params {
  message: ErrorMessage;
  func: Dispatch<React.SetStateAction<ErrorMessage | null>>;
}

export function Notifications({ message, func }: Params) {
  useEffect(() => {
    const timer = setTimeout(() => {
      func(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [func]);
  return (
    <div className="notifications">
      <p className="notification-type">{message.type}</p>
      <span className="notification-message">{message.message}</span>
    </div>
  );
}
