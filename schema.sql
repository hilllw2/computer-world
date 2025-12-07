---------------------------------------------------------------
-- EXTENSIONS & ENUM TYPES
---------------------------------------------------------------
create extension if not exists "pgcrypto";

create type user_role as enum ('customer','admin','support');
create type order_status as enum ('pending','processing','confirmed','shipped','delivered','cancelled','returned');
create type payment_method as enum ('cod','bank_transfer');
create type payment_status as enum ('pending','initiated','paid','failed','refunded');
create type ticket_status as enum ('open','in_progress','resolved','closed');
create type build_status as enum ('draft','submitted','built','shipped','cancelled');

---------------------------------------------------------------
-- USERS / PROFILES
---------------------------------------------------------------
create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  phone text,
  role user_role default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

---------------------------------------------------------------
-- ADDRESSES
---------------------------------------------------------------
create table addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  label text,
  full_name text,
  phone text,
  line1 text not null,
  line2 text,
  city text not null,
  province text,
  postal_code text,
  country text default 'Pakistan',
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on addresses(profile_id);

---------------------------------------------------------------
-- CATEGORIES
---------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  parent_id uuid references categories(id),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

---------------------------------------------------------------
-- BRANDS
---------------------------------------------------------------
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_storage_path text, -- stored in S3/Supabase Storage
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

---------------------------------------------------------------
-- PRODUCTS
---------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  title text not null,
  slug text unique not null,
  short_description text,
  description text,
  category_id uuid references categories(id),
  brand_id uuid references brands(id),
  base_price numeric(12,2) not null check (base_price >= 0),
  active boolean default true,
  is_configurable boolean default false,
  tags text[],
  search_vector tsvector,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Search trigger
create function products_search_trigger() returns trigger as $$
begin
  new.search_vector :=
    to_tsvector('english', coalesce(new.title,'') || ' ' ||
                           coalesce(new.short_description,'') || ' ' ||
                           coalesce(new.description,''));
  return new;
end;
$$ language plpgsql;

create trigger products_tsvector_update
before insert or update on products
for each row execute function products_search_trigger();

---------------------------------------------------------------
-- PRODUCT VARIANTS
---------------------------------------------------------------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  sku text unique,
  title text,
  price numeric(12,2) not null check (price >= 0),
  stock int default 0 check (stock >= 0),
  attributes jsonb, -- {"ram":"16GB","ssd":"1TB NVMe", etc.}
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on product_variants(product_id);
create index on product_variants using gin (attributes jsonb_path_ops);

---------------------------------------------------------------
-- PRODUCT IMAGES (S3 STORAGE PATH)
---------------------------------------------------------------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  variant_id uuid references product_variants(id),
  storage_path text not null, -- e.g. s3://bucket/products/xyz.jpg
  alt_text text,
  position int default 0,
  created_at timestamptz default now()
);

create index on product_images(product_id);

---------------------------------------------------------------
-- PRODUCT SPECIFICATIONS TABLE
---------------------------------------------------------------
create table product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  key text not null,
  value text not null
);

create index on product_specs(product_id);

---------------------------------------------------------------
-- CARTS
---------------------------------------------------------------
create table carts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on carts(profile_id);

---------------------------------------------------------------
-- CART ITEMS
---------------------------------------------------------------
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  variant_id uuid references product_variants(id),
  quantity int not null check (quantity > 0),
  price_snapshot numeric(12,2) not null,
  created_at timestamptz default now()
);

create index on cart_items(cart_id);

---------------------------------------------------------------
-- WISHLISTS
---------------------------------------------------------------
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name text default 'Default',
  created_at timestamptz default now()
);

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid references wishlists(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- ORDERS
---------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  profile_id uuid references profiles(id),
  shipping_address_id uuid references addresses(id),
  billing_address_id uuid references addresses(id),
  status order_status default 'pending',
  payment_method payment_method default 'cod',
  payment_status payment_status default 'pending',
  total_amount numeric(12,2) not null,
  shipping_cost numeric(12,2) default 0,
  discount_amount numeric(12,2) default 0,
  tax_amount numeric(12,2) default 0,
  estimated_delivery_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on orders(profile_id);
create index on orders(order_number);

---------------------------------------------------------------
-- ORDER ITEMS
---------------------------------------------------------------
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity int not null check (quantity > 0),
  price numeric(12,2) not null,
  line_total numeric(12,2) not null,
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- PAYMENTS
---------------------------------------------------------------
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  method payment_method not null,
  status payment_status default 'pending',
  amount numeric(12,2) not null,
  txn_reference text,
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- SHIPMENTS
---------------------------------------------------------------
create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  courier text,
  tracking_number text,
  shipped_at timestamptz,
  expected_delivery_date date,
  status text,
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- COUPONS
---------------------------------------------------------------
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text check (discount_type in ('fixed','percent')),
  discount_value numeric(12,2) not null,
  active boolean default true,
  usage_limit int,
  per_user_limit int,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- CUSTOM PC BUILDER
---------------------------------------------------------------
create table custom_builds (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  title text,
  notes text,
  status build_status default 'draft',
  total_price numeric(12,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table custom_build_components (
  id uuid primary key default gen_random_uuid(),
  build_id uuid references custom_builds(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  qty int default 1,
  price_snapshot numeric(12,2) not null,
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- SUPPORT TICKETS
---------------------------------------------------------------
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,
  profile_id uuid references profiles(id),
  order_id uuid references orders(id),
  email text,
  subject text,
  status ticket_status default 'open',
  priority text default 'normal',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references support_tickets(id) on delete cascade,
  sender_role user_role not null,
  sender_profile_id uuid references profiles(id),
  message text not null,
  attachments jsonb, -- S3 storage paths
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- REPAIR REQUESTS
---------------------------------------------------------------
create table repair_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  device_type text,
  brand text,
  model text,
  description text,
  preferred_visit_date date,
  status text default 'received',
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- REVIEW SYSTEM
---------------------------------------------------------------
create table product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  profile_id uuid references profiles(id),
  rating int check (rating >= 1 and rating <= 5),
  title text,
  body text,
  approved boolean default false,
  created_at timestamptz default now()
);

---------------------------------------------------------------
-- ADMIN LOGS
---------------------------------------------------------------
create table admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_profile_id uuid references profiles(id),
  action text,
  meta jsonb,
  created_at timestamptz default now()
);
