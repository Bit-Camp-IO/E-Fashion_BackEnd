1. **Manager Routes**:
   - `POST /admin/create-manager`
   - `POST /admin/create-super`

2. **Authentication Route**:
   - `POST /admin/auth/login`

3. **Admin Routes**:
   - `POST /admin/create` (Super Admin)
   - `DELETE /admin/remove` (Super Admin)
   - `GET /admin/list`  (Super Admin)
   - `GET /admin/user/list`
   - `GET /admin/user/:id`
   - `POST /admin/user/:id/ban`
   - `POST /admin/user/:id/unban`

4. **Product Routes**:
   - `POST /admin/product/create`
   - `PUT /admin/product/:id/edit`
   - `DELETE /admin/product/:id/remove`

5. **Category Routes**:
   - `POST /admin/category/create`
   - `POST /admin/category/:id/add-sub`
   - `PUT /admin/category/:id/edit`
   - `DELETE /admin/category/:id/remove`
   - `POST /admin/category/:id/add-products`
   - `DELETE /admin/category/:id/remove-products`

6. **Brand Routes**:
   - `POST /admin/brand/create`
   - `PUT /admin/brand/:id/edit`
   - `DELETE /admin/brand/:id/remove`
   - `POST /admin/brand/:id/add-products`
   - `DELETE /admin/brand/:id/remove-products`
