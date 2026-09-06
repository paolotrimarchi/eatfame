import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import DishRow from '@/components/DishRow';
import CartBar from '@/components/CartBar';
import TierBar from '@/components/TierBar';
import BackButton from '@/components/BackButton';
import { imageUrl, type Dish, type Restaurant } from '@/lib/types';

export default async function RestaurantPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', params.slug)
    .single() as { data: Restaurant | null };

  if (!restaurant) {
    return <p className="muted wrap">Restaurant not found.</p>;
  }

  const { data: dishes } = await supabase
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('name') as { data: Dish[] | null };

  return (
    <div className="pad-bar">
      <BackButton fallback="/" />

      <div className="rhead">
        <div className="ph">
          {imageUrl(restaurant.image_path) && (
            <Image src={imageUrl(restaurant.image_path)!} alt="" width={448} height={224} priority />
          )}
        </div>
        <div className="rhead-body">
          <div className="rhead-title">
            <h1>{restaurant.name}</h1>
            <div className="chips">
              {restaurant.tags?.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
          <div className="meta">
            {restaurant.rating !== null && (
              <>
                <span className="star">★ {restaurant.rating}</span>
                {restaurant.reviews ? ` (${restaurant.reviews})` : ''} ·{' '}
              </>
            )}
            {restaurant.blurb}
          </div>
        </div>
      </div>

      <TierBar />

      <div className="dishes">
        {(dishes ?? []).map((d) => <DishRow key={d.id} dish={d} />)}
      </div>

      <CartBar />
    </div>
  );
}
