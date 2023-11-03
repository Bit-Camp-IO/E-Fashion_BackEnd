export interface AddressData {
  isPrimary?: boolean;
  id?: string;
  location: {
    longitude: number;
    latitude: number;
  };
}

export interface AddAddressData {
  isPrimary?: boolean;
  id?: string;
  latitude: string;
  longitude: string;
}

export interface AddressResult extends AddressData {
  id: string;
}
