
export interface KeyFeatures {
  ingredients?: string[];
  allergens?: string[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  price: number | null;
  image_url: string | null;
  key_features: KeyFeatures | null;
  is_active: boolean;
}
   