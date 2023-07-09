# Core Documentation

## Auth Module

### class

- <b>JWTAuthService</b>
  Static Methods:

  - register:
    Create new user in database.
  - login:
    Check if user in database and create token.
  - verifyAccessToken
    Verify Token.
  - refreshToken
    Create new access token from refresh token.

- <b>OAuthAuthService</b>
  Static Methods:

  - loginGooglePageUrl:
    Send Google Auth page to user.
  - handleGoogleCode:
    Get the code form login page and Auth user form database then create token.

### Interface

- AuthResponse
- UserLogin
- UserRegistrationData
- GooglePayload

### Functions

- createToken
  Create new JWT Token
- verifyToken
  Verify JWT Token

## Admin Module

### Class

- <b>Admin</b>
  Methods:

- <b>SuperAdmin</b> extends Admin
  Methods:
  - createAdmin
    create new Admin in database
  - removeAdmin
    remove admin
  - getAdminsList
    return list of all admins
- <b>Manager</b> extends SuperAdmin
  Static Method:

  - managerExist
    Check if the manager exist

  Methods:

  - createSuperAdmin
    Create new SuperAdmin

### Interface

- AdminLogin
- TokenResult
- AdminService
- SuperAdminService

### Function

- login
  Auth Admin and create token
- getAdminServices
  check admin in database and return admin object [Admin, SuperAdmin, Manager]
- createManager
  Create one Manager for the project

### enum

- AdminRole
- AdminResult
- AdminData

## Errors Module

#### InvalidTokenError

#### DuplicateUserError

#### InvalidCredentialsError

#### UnauthorizedGoogleError

#### ManagerExistError

#### UnauthorizedError

#### PermissionError
