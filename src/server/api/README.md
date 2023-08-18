# API Documentation
### `/api`

1. **`/user` routes**:
    - `GET /me`
    - `POST /profile-image`
    - `POST /favorites`
    - `DELETE /favorites`
    - `GET /favorites`
    - `POST /cart`
    - `DELETE /cart`
    - `GET /cart`
    - `PATCH /cart`
    - `GET /address`
    - `POST /address`
    - `DELETE /address/:id`

2. **`product` routes**
   - `GET /list`
   - `GET /:id`
   - `GET /list/info`
   - `GET /:id/rate`
   - `POST /:id/rate`
   - `DELET /rate`

3. **`/order` routes**
   - `POST /cash-order`
   - `GET /`
   - `GET /:id`
   - `GET /:id/items`
   - `POST /create-payment-intent`

4. **`category` routes**
   - `GET /list`
   - `GET /:id`

5. **`/brand` routes**
   - `GET /list`

6. **`/auth` routes**
   - `POST /login`
   - `POST /register`
   - `GET /refresh`
   - `GET /google`
   - `GET /google/redirect`