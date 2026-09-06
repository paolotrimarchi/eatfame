export type Restaurant = {
  id: string;
  slug: string;
  name: string;
  blurb: string | null;
  rating: number | null;
  reviews: string | null;
  tags: string[];
  image_path: string | null;
  sort_order: number;
};

export type Dish = {
  id: string;
  restaurant_id: string;
  slug: string;
  name: string;
  description: string | null;
  price_at_2: number;
  price_at_3: number;
  price_at_4: number;
  image_path: string | null;
  cooking_instructions: string | null;
};

export type Order = {
  id: string;
  user_id: string;
  delivery_week_start: string;
  delivery_day: 'sun' | 'mon';
  status: 'placed' | 'confirmed' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  subtotal: number;
  created_at: string;
  delivery_full_name: string | null;
  delivery_phone: string | null;
  delivery_address_line1: string | null;
  delivery_address_line2: string | null;
  delivery_postcode: string | null;
  delivery_city: string | null;
  delivery_allergies: string[];
};

export type Profile = {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postcode: string | null;
  city: string;
  allergies: string[];
  updated_at: string;
};

// The 14 allergens the EU requires food businesses to be able to disclose
// (Regulation (EU) 1169/2011). Same list Uber Eats offers customers to
// self-report against, before any restaurant-side per-dish labelling exists.
export const EU_ALLERGENS = [
  'Celery', 'Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Lupin', 'Milk',
  'Molluscs', 'Mustard', 'Peanuts', 'Sesame', 'Soybeans', 'Sulphites', 'Tree nuts',
] as const;

// A profile counts as "ready for delivery" once we have somewhere to
// actually send the food and a way to reach the customer about it.
export function hasDeliveryAddress(p: Profile | null): boolean {
  return !!(p && p.full_name && p.address_line1 && p.postcode && p.city);
}

export type OrderItem = {
  id: string;
  order_id: string;
  dish_id: string;
  quantity: number;
  unit_price: number;
};

// Images live on the main site for now (img/restaurants/*, img/dishes/*/*),
// rather than duplicating ~6MB of photos into this app.
export function imageUrl(path: string | null) {
  return path ? `https://eatfame.com/${path}` : null;
}
