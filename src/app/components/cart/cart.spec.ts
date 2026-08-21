import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cart } from './cart';
import { CartService } from '../../services/cart';
import { PRODUCTS } from '../../services/product';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('almacen-cart');
    document.querySelectorAll('[data-test-cart-opener]').forEach(element =>
      element.remove()
    );
  });

  function openCart(): HTMLElement {
    const opener = document.createElement('button');
    opener.dataset['testCartOpener'] = '';
    document.body.appendChild(opener);
    opener.focus();
    cartService.openCart();
    fixture.detectChanges();
    return opener;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the cart normally', () => {
    openCart();

    expect(cartService.isOpen()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.cart-panel')).not.toBeNull();
  });

  it('should move focus inside the cart when opened', () => {
    openCart();

    const closeButton = fixture.nativeElement.querySelector('.close-button');
    expect(document.activeElement).toBe(closeButton);
  });

  it('should close the cart with Escape', () => {
    openCart();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(cartService.isOpen()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.cart-panel')).toBeNull();
  });

  it('should wrap focus to the first element when tabbing from the last', () => {
    openCart();
    const buttons = fixture.nativeElement.querySelectorAll('.cart-panel button');
    const firstButton = buttons[0] as HTMLButtonElement;
    const lastButton = buttons[buttons.length - 1] as HTMLButtonElement;
    lastButton.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      cancelable: true
    });
    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(firstButton);
  });

  it('should wrap focus to the last element with Shift + Tab from the first', () => {
    openCart();
    const buttons = fixture.nativeElement.querySelectorAll('.cart-panel button');
    const firstButton = buttons[0] as HTMLButtonElement;
    const lastButton = buttons[buttons.length - 1] as HTMLButtonElement;

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      cancelable: true
    });
    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(lastButton);
    expect(document.activeElement).not.toBe(firstButton);
  });

  it('should restore focus to the element that opened the cart', () => {
    const opener = openCart();

    component.closeCart();
    fixture.detectChanges();

    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it('should expose the cart as a labelled modal dialog', () => {
    openCart();
    const panel = fixture.nativeElement.querySelector('.cart-panel');
    const backdrop = fixture.nativeElement.querySelector('.cart-backdrop');

    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-labelledby')).toBe('cart-title');
    expect(panel.querySelector('#cart-title')).not.toBeNull();
    expect(backdrop.hasAttribute('role')).toBeFalse();
    expect(backdrop.hasAttribute('tabindex')).toBeFalse();
  });

  it('should keep quantity and removal operations working', () => {
    const product = PRODUCTS[0];
    cartService.addProduct(product, product.options[0]);
    fixture.detectChanges();
    const item = cartService.items()[0];

    component.increase(item);
    expect(cartService.items()[0].quantity).toBe(2);

    component.decrease(cartService.items()[0]);
    expect(cartService.items()[0].quantity).toBe(1);

    component.remove(cartService.items()[0]);
    expect(cartService.items()).toEqual([]);
  });
});
