import { HttpStatus } from './status';

class RequestError extends Error {
  public code: HttpStatus = HttpStatus.InternalServerError;
  constructor(message: string, code?: number) {
    super(message);
    if (code) this.code = code;
  }
  static _500() {
    return new RequestError(
      'We encountered an unexpected error while processing your request.',
      HttpStatus.InternalServerError,
    );
  }
}

export default RequestError;
