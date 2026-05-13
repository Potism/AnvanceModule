-- Impegno contrattuale (mesi) per moltiplicare i canoni mensili nel preventivo PDF.
alter table public.clients
  add column if not exists retainer_contract_months smallint
  check (
    retainer_contract_months is null
    or retainer_contract_months in (1, 3, 6, 12)
  );

comment on column public.clients.retainer_contract_months is
  'Mesi di impegno sui canoni mensili nel brief (1, 3, 6, 12). Usato nel PDF preventivo: Totale = canone × mesi.';
