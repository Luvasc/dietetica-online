export interface Category {
  name: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    name: 'Frutos secos',
    image: '/images/frutosecos.jpg'
  },
  {
    name: 'Semillas',
    image: '/images/semillas.jpg'
  },
  {
    name: 'Cereales y legumbres',
    image: '/images/cerealesylegumbres.png'
  },
  {
    name: 'Mieles',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924'
  },
  {
    name: 'Especias',
    image: '/images/especias.jpg'  },
  {
    name: 'Panificados',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff'
  }
];