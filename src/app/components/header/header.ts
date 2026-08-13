import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly cartService: CartService = inject(CartService);

  toggleCart(): void {
    this.cartService.toggleCart();
  }
}