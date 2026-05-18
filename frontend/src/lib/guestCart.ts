const KEY = "zawadi_guest_cart";

export type GuestCartItem = {
  productId: number;
  variantId?: number;
  quantity: number;
  productName: string;
  productSubtitle: string;
  image: string | null;
  unitPrice: number;
  currency: string;
};

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as GuestCartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: GuestCartItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToGuestCart(item: GuestCartItem): void {
  const cart = getGuestCart();
  const idx = cart.findIndex(
    (i) => i.productId === item.productId && i.variantId === item.variantId
  );
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function updateGuestCartQty(
  productId: number,
  variantId: number | undefined,
  quantity: number
): void {
  const cart = getGuestCart();
  const idx = cart.findIndex(
    (i) => i.productId === productId && i.variantId === variantId
  );
  if (idx < 0) return;
  if (quantity <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromGuestCart(
  productId: number,
  variantId?: number
): void {
  saveCart(
    getGuestCart().filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    )
  );
}

export function clearGuestCart(): void {
  localStorage.removeItem(KEY);
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, i) => sum + i.quantity, 0);
}
