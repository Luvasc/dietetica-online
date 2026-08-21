import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { PRODUCTS, Product, ProductOption } from './product';

export interface CartItem {
  product: Product;
  option: ProductOption;
  quantity: number;
}

interface StoredCartItem {
  productId: number;
  optionLabel: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'almacen-cart';

  private readonly cartItems = signal<CartItem[]>([]);
  private readonly cartOpen = signal(false);

  readonly items = this.cartItems.asReadonly();
  readonly isOpen = this.cartOpen.asReadonly();

  readonly totalQuantity = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  readonly totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) =>
        total + item.option.price * item.quantity,
      0
    )
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cartItems.set(this.restoreCart());

    effect(() => {
      const storedItems: StoredCartItem[] = this.cartItems().map(item => ({
        productId: item.product.id,
        optionLabel: item.option.label,
        quantity: item.quantity
      }));

      try {
        localStorage.setItem(this.storageKey, JSON.stringify(storedItems));
      } catch {
        // The cart remains usable when storage is unavailable.
      }
    });
  }

  addProduct(product: Product, option: ProductOption): void {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(
        item =>
          item.product.id === product.id &&
          item.option.label === option.label
      );

      if (existingIndex === -1) {
        return [
          ...items,
          {
            product,
            option,
            quantity: 1
          }
        ];
      }

      return items.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );
    });

    this.openCart();
  }

  increaseQuantity(item: CartItem): void {
    this.cartItems.update(items =>
      items.map(current =>
        this.isSameItem(current, item)
          ? {
              ...current,
              quantity: current.quantity + 1
            }
          : current
      )
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }

    this.cartItems.update(items =>
      items.map(current =>
        this.isSameItem(current, item)
          ? {
              ...current,
              quantity: current.quantity - 1
            }
          : current
      )
    );
  }

  removeItem(item: CartItem): void {
    this.cartItems.update(items =>
      items.filter(
        current => !this.isSameItem(current, item)
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  openCart(): void {
    this.cartOpen.set(true);
  }

  closeCart(): void {
    this.cartOpen.set(false);
  }

  toggleCart(): void {
    this.cartOpen.update(open => !open);
  }

  buildWhatsAppMessage(): string {
    const detail = this.cartItems().map(item => {
      const subtotal =
        item.option.price * item.quantity;

      return [
        `• ${item.product.name}`,
        `  Presentación: ${item.option.label}`,
        `  Cantidad: ${item.quantity}`,
        `  Subtotal: $${subtotal.toLocaleString('es-AR')}`
      ].join('\n');
    });

    return [
      'Hola, quiero realizar el siguiente pedido:',
      '',
      ...detail,
      '',
      `Total: $${this.totalPrice().toLocaleString('es-AR')}`,
      '',
      '¿Me confirman disponibilidad?'
    ].join('\n');
  }

  private restoreCart(): CartItem[] {
    try {
      const savedCart = localStorage.getItem(this.storageKey);

      if (!savedCart) {
        return [];
      }

      const parsedCart: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart.flatMap(value => {
        const storedItem = this.readStoredItem(value);

        if (!storedItem) {
          return [];
        }

        const product = PRODUCTS.find(
          current => current.id === storedItem.productId
        );
        const option = product?.options.find(
          current => current.label === storedItem.optionLabel
        );

        if (!product || !option) {
          return [];
        }

        return [{ product, option, quantity: storedItem.quantity }];
      });
    } catch {
      return [];
    }
  }

  private readStoredItem(value: unknown): StoredCartItem | null {
    if (!this.isRecord(value)) {
      return null;
    }

    const productId = value['productId'] ??
      (this.isRecord(value['product']) ? value['product']['id'] : undefined);
    const optionLabel = value['optionLabel'] ??
      (this.isRecord(value['option']) ? value['option']['label'] : undefined);
    const quantity = value['quantity'];

    if (
      typeof productId !== 'number' ||
      typeof optionLabel !== 'string' ||
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return null;
    }

    return { productId, optionLabel, quantity };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isSameItem(
    first: CartItem,
    second: CartItem
  ): boolean {
    return (
      first.product.id === second.product.id &&
      first.option.label === second.option.label
    );
  }
}
