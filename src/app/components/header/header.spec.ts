import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { CartService } from '../../services/cart';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('almacen-cart');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the cart and expose its expanded state', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.cart-button');

    expect(button.getAttribute('aria-controls')).toBe('cart-dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(cartService.isOpen()).toBeTrue();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });
});
