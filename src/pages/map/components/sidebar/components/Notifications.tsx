import type { ErrorMessage } from "../../../types";
interface Params {
  message: ErrorMessage;
}

export function Notifications({ message }: Params) {
  return (
    <div>
      <p>Message Type: {message.type}</p>
      <span>{message.message}</span>
    </div>
  );
}
