export enum ErrorType {
  InvalidToken = 1,
  Unauthorized,
  Duplicate,
  InvalidCredentials,
  UnauthorizedGoogle,
  ManagerExist,
  Permission,
  NotFound,
  InvalidData,
}

export class AppError extends Error {
  constructor(public type: ErrorType, message: string) {
    super(message);
  }

  static invalidCredentials(): AppError {
    return new AppError(ErrorType.InvalidCredentials, 'Invalid email or password');
  }

  static unauthorized(): AppError {
    return new AppError(
      ErrorType.Unauthorized,
      'You do not have permission to access this endpoint.',
    );
  }
  static invalid(message: string): AppError {
    return new AppError(ErrorType.InvalidData, message);
  }
  static permission(): AppError {
    return new AppError(ErrorType.Permission, 'Permission denied.');
  }
  static notFound(message: string): AppError {
    return new AppError(ErrorType.NotFound, message);
  }
}

// export class InvalidTokenError extends Error {
//   constructor() {
//     super('Invalid or expired token');
//   }
// }

// export class DuplicateError extends Error {
//   constructor(pre?: string) {
//     super(pre + ' already exists');
//   }
// }

// export class InvalidCredentialsError extends Error {
//   constructor(message?: string) {
//     super(message || 'Invalid email or password');
//   }
// }

// export class UnauthorizedGoogleError extends Error {
//   constructor() {
//     super('Failed to authenticate with Google.');
//   }
// }

// export class ManagerExistError extends Error {
//   constructor() {
//     super('Manager already exists');
//   }
// }

// export class UnauthorizedError extends Error {
//   constructor() {
//     super('You do not have permission to access this endpoint.');
//   }
// }

// export class PermissionError extends Error {
//   constructor() {
//     super('The authenticated user does not have permission to perform this action.');
//   }
// }

// export class NotFoundError extends Error {
//   constructor(pre?: string) {
//     super(`${pre} Not Found!`);
//   }
// }

// export class InvalidDataError extends Error {
//   constructor(message?: string) {
//     super(message || 'Invalid Data!');
//   }
// }
