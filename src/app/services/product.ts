export interface ProductOption {
  label: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
   featured: boolean;
  options: ProductOption[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Almendras naturales',
    description: 'Seleccionadas, frescas y sin sal.',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80',
    featured: true,
    options: [
      { label: '250 g', price: 4500 },
      { label: '500 g', price: 8500 },
      { label: '1 kg', price: 16000 }
    ]
  },
  {
    id: 2,
    name: 'Nueces',
    description: 'Ideales para desayunos, postres y colaciones.',
    image: '/images/nueces.jpg',
    featured: true,
    options: [
      { label: '250 g', price: 5000 },
      { label: '500 g', price: 9500 },
      { label: '1 kg', price: 18000 }
    ]
  },
  {
    id: 3,
    name: 'Mix energético',
    description: 'Combinación de frutos secos y semillas.',
    image: '/images/mix-energetico.png',
    featured: true,
    options: [
      { label: '250 g', price: 4200 },
      { label: '500 g', price: 7900 }
    ]
  },
  {
    id: 4,
    name: 'Miel multiflora',
    description: 'Miel pura de sabor suave y natural.',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=80',
    featured: true,
    options: [
      { label: '500 g', price: 9000 },
      { label: '1 kg', price: 17000 }
    ]
  },
  {
    id: 5,
    name: 'Granola artesanal',
    description: 'Avena, semillas, frutos secos y miel.',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=900&q=80',
    featured: true,
    options: [
      { label: '250 g', price: 3800 },
      { label: '500 g', price: 7000 }
    ]
  },
  {
    id: 6,
    name: 'Pan de masa madre',
    description: 'Pan artesanal de fermentación lenta.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    featured: true,
    options: [
      { label: 'Unidad', price: 6500 }
    ]
  }
];