export type PackOption = {
  id: string;
  name: string;
  price: number;
  unitNote: string;
  badge?: string;
};

export type DeliveryForm = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  postalCode: string;
  address: string;
  instructions: string;
};

export type PaymentMethod = "cod" | "upi";
