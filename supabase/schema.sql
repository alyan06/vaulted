-- Vaulted — entries table
-- Run this in your Supabase SQL editor before starting the app

CREATE TABLE IF NOT EXISTS entries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  category    text,
  subcategory text,
  location    jsonb,
  date        date,
  rating      integer     CHECK (rating BETWEEN 1 AND 10),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth — single-user personal app)
CREATE POLICY "allow_all" ON entries
  FOR ALL USING (true) WITH CHECK (true);

-- Seed sample data (optional — remove if you want a clean start)
INSERT INTO entries (title, category, subcategory, location, date, rating, notes, created_at) VALUES
  (
    'Café Barbera',
    'Food', 'Restaurant',
    '{"city":"Lahore","country":"Pakistan"}',
    '2024-03-15', 9,
    'Incredible Italian-inspired ambiance with the most perfectly brewed espresso. The tiramisu was divine — light, creamy, and not overly sweet. The dimly lit space with exposed brick walls made for a perfect evening.',
    '2024-03-15T10:30:00Z'
  ),
  (
    'Black Raspberry Ripple Soft Serve',
    'Food', 'Ice Cream',
    '{"city":"London","country":"United Kingdom"}',
    '2023-08-20', 8,
    'Found at a tiny artisan parlour near Borough Market. The colour was a stunning deep purple, almost black. Intensely fruity, with a slight tartness. Topped with crushed roasted pistachios.',
    '2023-08-20T14:00:00Z'
  ),
  (
    'Oppenheimer',
    'Entertainment', 'Movie',
    '{"city":"Lahore","country":"Pakistan"}',
    '2023-07-22', 10,
    'Cillian Murphy is breathtaking. Watched in IMAX — the Trinity test felt physically overwhelming. Three hours felt like thirty minutes. The score by Ludwig Göransson is haunting long after the credits.',
    '2023-07-22T19:00:00Z'
  ),
  (
    'Clifton Beach at Sunset',
    'Places', 'Beach',
    '{"city":"Karachi","country":"Pakistan"}',
    '2023-12-10', 7,
    'Golden hour light hits different here — the Arabian Sea stretching to the horizon. Chaotic and electric with street food vendors. Not the cleanest beach but the energy is raw and uniquely Karachi.',
    '2023-12-10T17:30:00Z'
  ),
  (
    'Lindt Excellence 90% Dark',
    'Food', 'Chocolate',
    '{"city":"Geneva","country":"Switzerland"}',
    '2024-01-05', 9,
    'Picked up at duty-free in Geneva. Intensely dark — almost no sweetness, just deep cocoa with a faint floral note. Has permanently raised my bar for dark chocolate.',
    '2024-01-05T12:00:00Z'
  ),
  (
    'Istanbul Old City',
    'Places', 'City',
    '{"city":"Istanbul","country":"Turkey"}',
    '2024-05-18', 10,
    'Between Hagia Sophia and the Grand Bazaar lies this impossibly layered city. Simit sellers, the call to prayer echoing across the Bosphorus, saffron light at dusk. No city has moved me like this.',
    '2024-05-18T09:00:00Z'
  )
ON CONFLICT DO NOTHING;
