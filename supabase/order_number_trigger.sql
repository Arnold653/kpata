-- ============================================================
-- KPATA — Génération automatique du numéro de commande
-- Format : KP-2026-001245
-- ============================================================

create sequence if not exists order_number_seq start 1;

create or replace function generate_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'KP-' || extract(year from now()) || '-' ||
      lpad(nextval('order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on orders;

create trigger set_order_number
  before insert on orders
  for each row execute procedure generate_order_number();

-- Historique de statut automatique à chaque insertion/mise à jour
create or replace function log_order_status_change()
returns trigger as $$
begin
  insert into order_status_history (order_id, status)
  values (new.id, new.status);
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_order_status_change on orders;

create trigger on_order_status_change
  after insert or update of status on orders
  for each row execute procedure log_order_status_change();

-- Le client doit pouvoir insérer les lignes de sa propre commande
create policy "Client crée les lignes de sa commande" on order_items
  for insert with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );
