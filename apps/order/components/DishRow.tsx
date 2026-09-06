'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { addToCart, getCart, priceTier, BEST_PRICE_AT } from '@/lib/cart';
import { useCartCount } from '@/lib/useCartCount';
import { imageUrl, type Dish } from '@/lib/types';
import { euro } from '@/lib/format';

export default function DishRow({ dish }: { dish: Dish }) {
  const [qty, setQty] = useState(0);
  const totalCount = useCartCount();

  useEffect(() => {
    setQty(getCart()[dish.id] || 0);
  }, [dish.id]);

  function bump(delta: number) {
    const cart = addToCart(dish.id, delta);
    setQty(cart[dish.id] || 0);
  }

  const tier = priceTier(totalCount);
  const price = Number(dish[tier]);
  const bestPrice = Number(dish.price_at_4);
  const atBestPrice = tier === 'price_at_4';

  return (
    <div className="dish">
      <div className="dish-info">
        <h4>{dish.name}</h4>
        <p className="desc">{dish.description}</p>
        <div className="dish-foot">
          {/* This used to read "€16.00 / at 4+ dishes", which looks like €16
              IS the 4+ price. Show both numbers so the discount is obvious. */}
          <div className="price">
            {euro(price)}
            {!atBestPrice && <small>{euro(bestPrice)} at {BEST_PRICE_AT}+</small>}
          </div>
          {qty > 0 ? (
            <div className="qty">
              <button onClick={() => bump(-1)} aria-label="Remove one">−</button>
              <span className="n">{qty}</span>
              <button onClick={() => bump(1)} aria-label="Add one">+</button>
            </div>
          ) : (
            <button className="add" onClick={() => bump(1)}>Add</button>
          )}
        </div>
      </div>
      <div className="dish-media">
        <div className="ph">
          {imageUrl(dish.image_path) && (
            <Image src={imageUrl(dish.image_path)!} alt="" width={108} height={108} />
          )}
        </div>
      </div>
    </div>
  );
}
