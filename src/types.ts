export type ScreenType = 
  | 'home'
  | 'all-collections'
  | 'product-detail'
  | 'cart'
  | 'founder-portal'
  | 'marketing-kit'
  | 'gift-registry'
  | 'wheels-and-motion'
  | 'rocking-and-balance'
  | 'climbing-and-play-gyms'
  | 'learning-and-montessori'
  | 'play-furniture'
  | 'brand-philosophy';

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: 'wheels' | 'rocking' | 'climbing' | 'learning' | 'pretend' | 'furniture';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  cogs?: number;
  marginPct?: number;
  age: string;
  ageGroup: 'infant' | 'toddler' | 'preschool' | 'all';
  timber: string;
  timberCode: 'beech' | 'birch' | 'lacquer' | 'ash';
  image: string;
  additionalImages?: string[];
  description: string;
  highlights?: string[];
  specifications?: {
    length?: string;
    width?: string;
    seatHeight?: string;
    handlebarHeight?: string;
    weight?: string;
    testedCapacity?: string;
  };
  badge?: string;
  status?: string;
  rating?: number;
  reviewCount?: number;
  colorways?: { name: string; hex: string; secondaryHex?: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColorway?: string;
  monogram?: string;
  includeLeatherTag?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
  type?: 'success' | 'info';
}
