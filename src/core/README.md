# Core Documentation

## Auth Module

### class

- <b>JWTAuthService</b>
  Static Methods:

  - register:
    Create new user in database.
    ```ts
    register(userData: UserRegistrationData): AsyncSafeResult<AuthResponse>
    ```
  - login:
    Check if user in database and create token.

    ```ts
    login(userData: UserLogin): AsyncSafeResult<AuthResponse>
    ```

  - verifyAccessToken
    Verify Token.

    ```ts
    verifyAccessToken(token: string): SafeResult<string>
    ```

  - refreshToken
    Create new access token from refresh token.

    ```ts
    refreshToken(token: string): AsyncSafeResult<string>
    ```

- <b>OAuthAuthService</b>
  Static Methods:

  - loginGooglePageUrl:
    Send Google Auth page to user.
    ```ts
    loginGooglePageUrl(): string
    ```
  - handleGoogleCode:
    Get the code form login page and Auth user form database then create token.
    ```ts
    handleGoogleCode(code: string): AsyncSafeResult<AuthResponse>
    ```

### Interface

- AuthResponse

  ```ts
  email: string;
  fullName: string;
  id: string;
  accessToken: string;
  refreshToken: string;
  ```

- UserLogin
  ```ts
  email: string;
  password: string;
  ```
- UserRegistrationData
  ```ts
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  ```
- GooglePayload

  ```ts
  email: string;
  name: string;
  ```

### Functions

- createToken
  Create new JWT Token
  ```ts
  createToken(payload: any, key: string, exp: string): string
  ```
- verifyToken
  Verify JWT Token
  ```ts
  verifyToken(token: string, key: string): any
  ```

## Admin Module

### Class

- <b>Admin</b>
  Methods:
  - getAllUsers
    Return list of users
    ```ts
    getAllUsers(): AsyncSafeResult<Document<UserDB>[]>
    ```
  - getOneUser
    Return one user by the id
    ```ts
    getOneUser(id: string): AsyncSafeResult<Document<UserDB>>
    ```
- <b>SuperAdmin</b> extends Admin
  Methods:
  - createAdmin
    create new Admin in database
    ```ts
    createAdmin(data: AdminData): AsyncSafeResult<AdminResult>
    ```
  - removeAdmin
    remove admin
    ```ts
    removeAdmin(id: string): Promise<Error | null>
    ```
  - getAdminsList
    return list of all admins
    ```ts
    getAdminsList(role: string): AsyncSafeResult<AdminResult[]>
    ```
- <b>Manager</b> extends SuperAdmin
  Static Method:

  - managerExist
    Check if the manager exist
    ```ts
    managerExist(): Promise<boolean>
    ```

  Methods:

  - createSuperAdmin
    Create new SuperAdmin
    ```ts
    reateSuperAdmin(adminData: AdminData): AsyncSafeResult<AdminResult>
    ```

### Interface

- AdminLogin
  ```ts
  email: string;
  password: string;
  ```
- TokenResult
  ```ts
  token: string;
  ```
- AdminService

  ```ts
  addProduct(data: ProductData): AsyncSafeResult<ProductResult>;
  deleteProduct(id: string): void;
  editProduct(id: string, data: Partial<ProductData>): AsyncSafeResult<ProductData>;

  banUser(id: string): void;
  unBanUser(id: string): void;
  ```

- SuperAdminService
  ```ts
  createAdmin(adminData: AdminData): AsyncSafeResult<AdminResult>;
  removeAdmin(id: string): void;
  getAdminsList(role: string): AsyncSafeResult<AdminResult[]>;
  ```
- AdminResult

  ```ts
  name: string;
  id: string;
  createdAt: Date;
  role: string;
  ```

- AdminData
  ```ts
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  ```

### Function

- login
  Auth Admin and create token

  ```ts
  function login(adminData: AdminLogin): AsyncSafeResult<TokenResult>;
  ```

- getAdminServices
  check admin in database and return admin object [Admin, SuperAdmin,
  Manager]

  ```ts
  getAdminServices(id: string, role: AdminRole.ADMIN): AsyncSafeResult<Admin>;
  getAdminServices(id: string, role: AdminRole.SUPER_ADMIN): AsyncSafeResult<SuperAdmin>;
  getAdminServices(id: string, role: AdminRole.MANAGER): AsyncSafeResult<Manager>;
  ```

- createManager
  Create one Manager for the project
  ```ts
  function createManager(managerData: AdminData): AsyncSafeResult<AdminResult>;
  ```

### enum

- AdminRole

```ts
enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superadmin',
  MANAGER = 'manager',
}
```

## Product Module

### Function

- createProduct
  create new Product

```ts
createProduct(data: ProductData, adminId: string): CreateProductReturn
```

- \_getProduct
  get Product from database will return product documnet

```ts
_getProduct(id: string)
```

- getProductForAdmin
  return all document to admin

```ts
getProductForAdmin(id: string): AsyncSafeResult<unknown>
```

- getProductForUser
  format documnet for user

```ts
getProductForUser(id: string): AsyncSafeResult<ProductResult>
```

- getProductsList
  return list of products

```ts
getProductsList(): AsyncSafeResult<ProductItemApi[]>
```

- removeProduct
  remove product from database

```ts
removeProduct(id: string): Promise<Error | null>
```

- \_formatProduct
  format document to response object

```ts
_formatProduct(pDoc: ProductDoc): ProductItemApi
```

### Interfaces

- ProductItemApi

```ts
  id: string;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  discount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  imagesUrl: string[];
  brand: string;
  isNew: boolean;
  rate: number;
  available: boolean;
```

- ProductData

```ts
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
```

- ProductResult

```ts
  title: string;
  description: string;
  price: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  id: string;
```

### Type

- CreateProductReturn

```ts
type CreateProductReturn = AsyncSafeResult<ProductResult>;
```

## Errors Module

#### InvalidTokenError

#### DuplicateError

#### InvalidCredentialsError

#### UnauthorizedGoogleError

#### ManagerExistError

#### UnauthorizedError

#### PermissionError
