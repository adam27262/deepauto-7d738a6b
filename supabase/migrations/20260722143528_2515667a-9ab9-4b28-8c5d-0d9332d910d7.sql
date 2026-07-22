
-- 1) Move has_role into a private schema not exposed by the API
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- Recreate policies to use private.has_role and drop the public version
DROP POLICY "admin delete bookings" ON public.bookings;
DROP POLICY "admin read bookings" ON public.bookings;
DROP POLICY "admin update bookings" ON public.bookings;
DROP POLICY "admin read messages" ON public.contact_messages;
DROP POLICY "admin update messages" ON public.contact_messages;
DROP POLICY "admin read orders" ON public.orders;
DROP POLICY "admin update orders" ON public.orders;
DROP POLICY "admin manage products delete" ON public.products;
DROP POLICY "admin manage products insert" ON public.products;
DROP POLICY "admin manage products update" ON public.products;
DROP POLICY "anyone read active products" ON public.products;
DROP POLICY "admin delete rentals" ON public.rentals;
DROP POLICY "admin read rentals" ON public.rentals;
DROP POLICY "admin update rentals" ON public.rentals;

CREATE POLICY "admin delete bookings" ON public.bookings FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin read bookings" ON public.bookings FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update bookings" ON public.bookings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin read orders" ON public.orders FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update orders" ON public.orders FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage products delete" ON public.products FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage products insert" ON public.products FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage products update" ON public.products FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "anyone read active products" ON public.products FOR SELECT TO anon, authenticated USING (active = true OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete rentals" ON public.rentals FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin read rentals" ON public.rentals FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update rentals" ON public.rentals FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 2) Replace WITH CHECK (true) INSERT policies with validating checks
DROP POLICY "anyone insert booking" ON public.bookings;
CREATE POLICY "anyone insert booking" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(customer_name) BETWEEN 2 AND 80
    AND char_length(customer_email) BETWEEN 3 AND 200
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(customer_phone) BETWEEN 7 AND 30
    AND char_length(service) BETWEEN 1 AND 100
    AND (vehicle IS NULL OR char_length(vehicle) <= 120)
    AND (notes IS NULL OR char_length(notes) <= 1000)
    AND char_length(booking_time) BETWEEN 1 AND 20
    AND booking_date >= CURRENT_DATE - INTERVAL '1 day'
    AND status = 'pending'
  );

DROP POLICY "anyone insert rental" ON public.rentals;
CREATE POLICY "anyone insert rental" ON public.rentals
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(customer_name) BETWEEN 2 AND 80
    AND char_length(customer_email) BETWEEN 3 AND 200
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(customer_phone) BETWEEN 7 AND 30
    AND char_length(vehicle) BETWEEN 1 AND 120
    AND (notes IS NULL OR char_length(notes) <= 1000)
    AND end_date >= start_date
    AND start_date >= CURRENT_DATE - INTERVAL '1 day'
    AND status = 'pending'
  );

DROP POLICY "anyone insert order" ON public.orders;
CREATE POLICY "anyone insert order" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(customer_name) BETWEEN 2 AND 80
    AND char_length(customer_email) BETWEEN 3 AND 200
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (customer_phone IS NULL OR char_length(customer_phone) BETWEEN 7 AND 30)
    AND (shipping_address IS NULL OR char_length(shipping_address) <= 500)
    AND jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) BETWEEN 1 AND 100
    AND total >= 0 AND total <= 1000000
    AND status = 'pending'
  );

DROP POLICY "anyone insert message" ON public.contact_messages;
CREATE POLICY "anyone insert message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 80
    AND char_length(email) BETWEEN 3 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (phone IS NULL OR char_length(phone) BETWEEN 7 AND 30)
    AND char_length(message) BETWEEN 1 AND 2000
    AND status = 'new'
  );
