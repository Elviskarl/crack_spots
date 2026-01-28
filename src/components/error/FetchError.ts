import { CustomError } from "./CustomError";

export class FetchError extends CustomError {
  constructor(message: string) {
    super("Fetch Error", message);
  }
}
