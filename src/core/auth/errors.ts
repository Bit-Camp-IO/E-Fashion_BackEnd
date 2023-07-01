export class InvalidTokenError extends Error {
  constructor() {
    super('Invalid or expired token');
  }
}

export class DuplicateUserError extends Error {
  constructor() {
    super('User already exists');
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
  }
}

export class UnauthorizedGoogleError extends Error {
  constructor() {
    super('Failed to authenticate with Google.');
  }
}
