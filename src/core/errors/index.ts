export class InvalidTokenError extends Error {
  constructor() {
    super('Invalid or expired token');
  }
}

export class DuplicateError extends Error {
  constructor(pre?: string) {
    super(pre + ' already exists');
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

// ----------------------------------------------------------------------

export class ManagerExistError extends Error {
  constructor() {
    super('Manager aleady exists');
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('You do not have permission to access this endpoint.');
  }
}

export class PermissionError extends Error {
  constructor() {
    super('The authenticated user does not have permission to perform this action.');
  }
}

export class NotFoundError extends Error {
  constructor(pre?: string) {
    super(`${pre} Not Found!`);
  }
}
