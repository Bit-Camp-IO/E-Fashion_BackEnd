export interface PorductCart {
  id: string;
  quantity: number;
  size: string;
  color: string;
}


export interface CartResult {
  "items": [
    {
      "product_id": "123",
      "name": "Product A",
      "price": 19.99,
      "quantity": 2,
      "size": "M",
      "color": "blue"
    }
  ],
  "subtotal": 39.98,
  "tax": 3.20,
  "total": 43.18
}

interface CartServices {
  add(product: PorductCart): ;
}

class Cart {}
