import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { CategoryList } from './components/category-list/category-list';
import { ProductCard } from './components/product-card/product-card';
import { Cart } from './components/cart/cart';
import { Product, PRODUCTS } from './services/product';
import { HowToBuy } from './components/how-to-buy/how-to-buy';
import { ContactCta } from './components/contact-cta/contact-cta';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Cart,
    Hero,
    CategoryList,
    ProductCard,
    HowToBuy,
    ContactCta,
    Footer
    

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  featuredProducts: Product[] = PRODUCTS.filter(
    product => product.featured
  );
}