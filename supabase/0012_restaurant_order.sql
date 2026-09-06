-- Restaurant display order. The app sorts by sort_order; the landing site
-- uses the array order in data.js. These had drifted apart after the
-- PostHog-demand re-sort, so the two showed different running orders.

update restaurants set sort_order = case slug
  when 'the-bab' then 1
  when 'pasta-pasta' then 2
  when 'pind-punjabi' then 3
  when 'otaru-sushi' then 4
  when 'wan-shun' then 5
  when 'gyros-republic' then 6
  when 'mizu-bar' then 7
  when 'dolce-verona' then 8
  when 'swagat' then 9
  when 'salsa-shop' then 10
  when 'warung-mini' then 11
  when 'american-spareribs' then 12
  when 'gnoccheria' then 13
  when 'momo-tibet' then 14
  else sort_order end;
