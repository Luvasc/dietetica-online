import { PRODUCTS } from './product';

describe('PRODUCTS', () => {
  it('should contain products with unique ids and at least one option', () => {
    const ids = PRODUCTS.map(product => product.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(PRODUCTS.length).toBeGreaterThan(0);
    expect(PRODUCTS.every(product => product.options.length > 0)).toBeTrue();
  });

  it('should contain valid positive prices', () => {
    const prices = PRODUCTS.flatMap(product =>
      product.options.map(option => option.price)
    );

    expect(prices.every(price => Number.isFinite(price) && price > 0)).toBeTrue();
  });
});
