import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import WeekPicker from '@/components/WeekPicker';
import RepeatLastOrder from '@/components/RepeatLastOrder';
import { imageUrl, type Restaurant } from '@/lib/types';
import { euro } from '@/lib/format';

export default async function HomePage() {
  const supabase = createClient();
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('sort_order') as { data: Restaurant[] | null };

  // Cheapest dish per restaurant, so the cards say something about price
  // instead of making people tap in blind to find out.
  const { data: allDishes } = await supabase
    .from('dishes')
    .select('restaurant_id, name, price_at_4');

  const dishesByRestaurant = new Map<string, { name: string; price: number }[]>();
  for (const d of allDishes ?? []) {
    const list = dishesByRestaurant.get((d as any).restaurant_id) ?? [];
    list.push({ name: (d as any).name, price: Number((d as any).price_at_4) });
    dishesByRestaurant.set((d as any).restaurant_id, list);
  }

  // Repeat-last-week only exists for people who've ordered before.
  const { data: { user } } = await supabase.auth.getUser();
  let lastOrder: { items: { dish_id: string; quantity: number; name: string }[]; total: number } | null = null;

  if (user) {
    const { data: prev } = await supabase
      .from('orders')
      .select('id, subtotal')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (prev) {
      const { data: prevItems } = await supabase
        .from('order_items')
        .select('dish_id, quantity, dishes(name)')
        .eq('order_id', (prev as any).id);

      if (prevItems && prevItems.length > 0) {
        lastOrder = {
          total: Number((prev as any).subtotal),
          items: prevItems.map((it: any) => ({
            dish_id: it.dish_id,
            quantity: it.quantity,
            name: it.dishes?.name ?? 'Dish',
          })),
        };
      }
    }
  }

  return (
    <div className="pad-bar">
      <div className="brandmark compact">
        <div className="wordmark">Fame.</div>
      </div>

      <div className="hero-copy">
        <h1>Eat like you went out. All week.</h1>
        <p>Pick real dishes from Amsterdam restaurants you already love. One delivery, ready whenever you are.</p>
      </div>

      <WeekPicker />

      {lastOrder && (
        <div className="wrap" style={{ marginBottom: 18 }}>
          <RepeatLastOrder items={lastOrder.items} total={lastOrder.total} />
        </div>
      )}

      <div className="rlist">
        {(restaurants ?? []).map((r) => {
          const dishes = dishesByRestaurant.get(r.id) ?? [];
          const from = dishes.length > 0 ? Math.min(...dishes.map((d) => d.price)) : null;
          const peek = dishes.slice(0, 3).map((d) => d.name).join(' · ');
          return (
            <Link key={r.id} href={`/restaurants/${r.slug}`} className="rcard">
              {imageUrl(r.image_path) && (
                <div className="ph">
                  <Image src={imageUrl(r.image_path)!} alt="" width={448} height={280} />
                </div>
              )}
              <div className="rcard-body">
                <div className="rcard-head">
                  <h4>{r.name}</h4>
                  {from !== null && <span className="rcard-from">from {euro(from)}</span>}
                </div>
                {peek && <p className="rcard-peek">{peek}</p>}
                <div className="chips">
                  {/* Direct partners don't have a marketplace rating, so this
                      hides rather than printing an empty star. */}
                  {r.rating !== null && (
                    <span className="meta rate">
                      <span className="star">★ {r.rating}</span>
                      {r.reviews ? ` (${r.reviews})` : ''}
                    </span>
                  )}
                  {r.tags?.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </Link>
          );
        })}

        {(!restaurants || restaurants.length === 0) && (
          <p className="muted wrap">
            No restaurants loaded yet.
          </p>
        )}
      </div>

      <footer>Fame. · Amsterdam</footer>
    </div>
  );
}
