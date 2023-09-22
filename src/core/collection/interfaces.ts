export interface CollectionInput {
  title: string;
  description?: string;
  price: number;
  discount: number;
  image: string;
  items: { title: string; description: string; image: string }[];
}

export interface CollectionResult extends CollectionInput {
  id: string;
}

export type EditCollectionInput = Partial<CollectionInput>;

export type CollectionListResult = Omit<CollectionResult, 'items'>[];
