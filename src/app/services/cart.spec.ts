import { TestBed } from '@angular/core/testing';

import { CartItem, CartService } from './cart';
import { Product } from './product';

describe('CartService', () => {
  const storageKey = 'almacen-cart';
  const product: Product = {
    id: 1,
    name: 'Almendras',
    description: 'Almendras naturales',
    image: '/images/almendras.jpg',
    featured: true,
    options: [
      { label: '250 g', price: 4500 },
      { label: '500 g', price: 8500 }
    ]
  };
  const firstOption = product.options[0];
  const secondOption = product.options[1];

  let service: CartService;

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product and calculate quantity and price', () => {
    service.addProduct(product, firstOption);

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(1);
    expect(service.totalQuantity()).toBe(1);
    expect(service.totalPrice()).toBe(4500);
    expect(service.isOpen()).toBeTrue();
  });

  it('should combine equal products and keep different options separate', () => {
    service.addProduct(product, firstOption);
    service.addProduct(product, firstOption);
    service.addProduct(product, secondOption);

    expect(service.items().length).toBe(2);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.items()[1].quantity).toBe(1);
    expect(service.totalQuantity()).toBe(3);
    expect(service.totalPrice()).toBe(17_500);
  });

  it('should increase and decrease an item quantity', () => {
    service.addProduct(product, firstOption);
    const item = service.items()[0];

    service.increaseQuantity(item);
    expect(service.items()[0].quantity).toBe(2);

    service.decreaseQuantity(service.items()[0]);
    expect(service.items()[0].quantity).toBe(1);
  });

  it('should remove an item when decreasing its last unit', () => {
    service.addProduct(product, firstOption);

    service.decreaseQuantity(service.items()[0]);

    expect(service.items()).toEqual([]);
    expect(service.totalPrice()).toBe(0);
  });

  it('should remove one item and clear the complete cart', () => {
    service.addProduct(product, firstOption);
    service.addProduct(product, secondOption);

    service.removeItem(service.items()[0]);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].option).toEqual(secondOption);

    service.clearCart();
    expect(service.items()).toEqual([]);
    expect(service.totalQuantity()).toBe(0);
  });

  it('should restore a saved cart from localStorage', () => {
    const savedItem: CartItem = {
      product,
      option: firstOption,
      quantity: 2
    };

    TestBed.resetTestingModule();
    localStorage.setItem(storageKey, JSON.stringify([savedItem]));
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);

    expect(service.items()).toEqual([savedItem]);
    expect(service.totalQuantity()).toBe(2);
    expect(service.totalPrice()).toBe(9000);
  });

  it('should build a WhatsApp message with item details and total', () => {
    service.addProduct(product, firstOption);
    service.increaseQuantity(service.items()[0]);

    const message = service.buildWhatsAppMessage();

    expect(message).toContain('Almendras');
    expect(message).toContain('Presentación: 250 g');
    expect(message).toContain('Cantidad: 2');
    expect(message).toContain('Subtotal: $9.000');
    expect(message).toContain('Total: $9.000');
  });
});
