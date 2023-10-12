export class CustomError extends Error {
  statusCode;

  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
