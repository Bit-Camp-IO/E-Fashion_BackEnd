import { AsyncSafeResult } from '@type/common';

interface FavItem {
  title: string;
  price: string;
}

interface UserServices {
  // addToCart(id: string): Promise<Error | null>;
  addToFav(): AsyncSafeResult<FavItem[]>;
}

export class User implements UserServices {
  addToFav(): AsyncSafeResult<FavItem[]> {
    return { error: new Error(), result: null };
  }
}

export function getUser(): AsyncSafeResult<User> {
  try {
    const user = new User();
    return { error: null, result: user };
  } catch (err) {
    return { error: err, result: null };
  }
}
