import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
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
export class Cart implements AfterViewChecked {
  readonly cartService = inject(CartService);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly hostElement: ElementRef<HTMLElement> = inject(ElementRef);
  private previouslyFocusedElement: HTMLElement | null = null;
  private wasOpen = false;

  ngAfterViewChecked(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const isOpen = this.cartService.isOpen();

    if (isOpen && !this.wasOpen) {
      this.previouslyFocusedElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      this.wasOpen = true;
      this.getFocusableElements()[0]?.focus();
    } else if (!isOpen && this.wasOpen) {
      this.wasOpen = false;
      this.previouslyFocusedElement?.focus();
      this.previouslyFocusedElement = null;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.cartService.isOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeCart();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = this.getFocusableElements();

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    } else if (!focusableElements.includes(activeElement as HTMLElement)) {
      event.preventDefault();
      firstElement.focus();
    }
  }

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

  private getFocusableElements(): HTMLElement[] {
    const panel = this.hostElement.nativeElement.querySelector('.cart-panel');

    if (!panel) {
      return [];
    }

    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }
}
