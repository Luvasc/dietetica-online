import {
  Component,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { CartItem, CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  readonly cartService = inject(CartService);

  private readonly platformId = inject(PLATFORM_ID);

  closeCart(): void {
    this.cartService.closeCart();
  }

  increase(item: CartItem): void {
    this.cartService.increaseQuantity(item);
  }

  decrease(item: CartItem): void {
    this.cartService.decreaseQuantity(item);
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR');
  }

  sendWhatsAppOrder(): void {
    if (this.cartService.items().length === 0) {
      return;
    }

    const phoneNumber = '3826446895';
    const message = this.cartService.buildWhatsAppMessage();

    const url =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}