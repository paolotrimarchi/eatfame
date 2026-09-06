-- Drop the "Momo" tag from Momo Tibet: it repeats the restaurant name, so on
-- the card it reads "Momo Tibet ... Tibetan Momo Noodles".

update restaurants
set tags = array['Tibetan','Noodles']
where slug = 'momo-tibet';
