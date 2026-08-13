import {
  Component,
  Input,
  OnInit,
  inject
} from '@angular/core';

import {
  Product,
  ProductOption
} from '../../services/product';

import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard implements OnInit {
  @Input({ required: true }) product!: Product;

  private readonly cartService: CartService =
    inject(CartService);

  selectedOption!: ProductOption;

  ngOnInit(): void {
    this.selectedOption = this.product.options[0];
  }

  selectOption(option: ProductOption): void {
    this.selectedOption = option;
  }

  addToCart(): void {
    this.cartService.addProduct(
      this.product,
      this.selectedOption
    );
  }
}