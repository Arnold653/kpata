-- ============================================================
-- KPATA — Notification automatique de changement de statut
-- ============================================================

create or replace function notify_order_status_change()
returns trigger as $$
declare
  status_label text;
begin
  status_label := case new.status
    when 'confirmee' then 'Votre commande a été confirmée.'
    when 'en_preparation' then 'Votre commande est en cours de préparation.'
    when 'prete' then 'Votre commande est prête.'
    when 'expediee' then 'Votre commande a été expédiée.'
    when 'en_livraison' then 'Votre commande est en cours de livraison.'
    when 'livree' then 'Votre commande a été livrée. Merci pour votre confiance !'
    when 'annulee' then 'Votre commande a été annulée.'
    else null
  end;

  if status_label is not null then
    insert into notifications (user_id, title, body, type, related_order_id)
    values (new.user_id, new.order_number, status_label, 'order_status', new.id);
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_status_notify on orders;

create trigger on_order_status_notify
  after insert or update of status on orders
  for each row execute procedure notify_order_status_change();
