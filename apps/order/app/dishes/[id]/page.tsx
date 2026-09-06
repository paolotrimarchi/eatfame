import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import BackButton from '@/components/BackButton';
import { imageUrl, type Dish } from '@/lib/types';

export default async function DishPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: dish } = await supabase
    .from('dishes')
    .select('*')
    .eq('id', params.id)
    .single() as { data: Dish | null };

  if (!dish) return <p className="muted wrap">Dish not found.</p>;

  return (
    <div className="wrap pad-bar" style={{ paddingTop: 16 }}>
      {/* Falls back to /orders rather than /cart: people almost always land
          here from their order history, where the basket is empty. */}
      <BackButton fallback="/orders" />

      {imageUrl(dish.image_path) && (
        <div className="ph" style={{ height: 220, borderRadius: 18, marginBottom: 12 }}>
          <Image src={imageUrl(dish.image_path)!} alt="" width={448} height={280} />
        </div>
      )}

      <h1 className="page-h" style={{ marginTop: 0 }}>{dish.name}</h1>
      <p className="muted" style={{ marginBottom: 20 }}>{dish.description}</p>

      <div className="card">
        <h3 style={{ marginTop: 0, fontSize: 16, fontFamily: 'var(--display)', fontStyle: 'normal', fontWeight: 600 }}>How to heat it</h3>
        {dish.cooking_instructions ? (
          <p style={{ margin: 0 }}>{dish.cooking_instructions}</p>
        ) : (
          // NOTE for Paolo: this is what a customer sees when the
          // cooking_instructions column is empty, which it currently is for
          // every dish. Fill those in before real orders go out.
          <p className="muted" style={{ margin: 0 }}>
            Heating instructions for this dish are on their way — we&apos;ll include them
            with your delivery.
          </p>
        )}
      </div>
    </div>
  );
}
