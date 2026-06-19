"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

const LANGUAGE_STORAGE_KEY = "anvance-lang"

type Language = "it" | "en"

interface Translations {
  [key: string]: {
    it: string
    en: string
  }
}

/* ------------------------------------------------------------------ */
/*  Translations                                                      */
/* ------------------------------------------------------------------ */

export const translations: Translations = {
  // Header
  "header.clientBrief": { it: "Brief Cliente", en: "Client Brief" },
  "header.dashboard": { it: "Dashboard", en: "Dashboard" },
  "header.logout": { it: "Esci", en: "Logout" },

  // Admin errors
  "admin.fetchError": {
    it: "Impossibile caricare i brief. Verifica la connessione a Supabase e le policy RLS (utente autenticato).",
    en: "Could not load briefs. Check your Supabase connection and RLS policies (authenticated user).",
  },
  "admin.configError": {
    it: "Supabase non configurato. Aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    en: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
  },
  "pricing.saveError": {
    it: "Errore nel salvataggio del listino.",
    en: "Failed to save pricing settings.",
  },
  "pricing.loading": { it: "Caricamento listino…", en: "Loading pricing…" },

  // Home Page
  "home.badge": { it: "Brief di analisi preliminare", en: "Preliminary Analysis Brief" },
  "home.title": {
    it: "Brand, social e crescita digitale. Raccontati come un film.",
    en: "Brand, social and digital growth. Told like a film.",
  },
  "home.subtitle": {
    it:
      "Compila questo brief in 5 minuti: il team di Anvance Production lo analizza e ti propone una strategia su misura tra produzione video, social, performance marketing e sito web.",
    en:
      "Complete this brief in 5 minutes: the Anvance Production team will review it and craft a tailored strategy across video, social, performance marketing and web.",
  },
  "home.services": { it: "Cosa facciamo", en: "What we do" },
  "home.testimonial": {
    it:
      "Anvance Production ha trasformato il modo in cui raccontiamo il nostro brand. Cinematografia di livello, social gestiti come si deve, performance marketing e un sito web fatto bene.",
    en:
      "Anvance Production transformed the way we tell our brand story. High-end cinematography, social managed the right way, performance marketing and a website built properly.",
  },
  "home.testimonialAuthor": { it: "— Direttore Marketing, Retail Brand", en: "— Marketing Director, Retail Brand" },
  "home.footer.rights": { it: "Tutti i diritti riservati.", en: "All rights reserved." },
  "home.footer.privacy": { it: "Privacy Policy", en: "Privacy Policy" },
  "home.footer.terms": { it: "Termini di Servizio", en: "Terms of Service" },

  // Services (home cards)
  "service.cinematicVideo": { it: "Video Cinematografici", en: "Cinematic Video" },
  "service.cinematicVideoDesc": { it: "Produzioni di alta gamma, story-driven", en: "High-end, story-driven production" },
  "service.reels": { it: "Reels & Short-form", en: "Reels & Short-form" },
  "service.reelsDesc": { it: "Contenuti veloci, ad alto engagement", en: "Fast, high-engagement content" },
  "service.youtube": { it: "YouTube Long-form", en: "YouTube Long-form" },
  "service.youtubeDesc": { it: "Episodi, documentari, podcast filmati", en: "Episodes, docs, filmed podcasts" },
  "service.photography": { it: "Fotografia Professionale", en: "Professional Photography" },
  "service.photographyDesc": { it: "Ritratto, prodotto, editoriale", en: "Portrait, product, editorial" },
  "service.socialMedia": { it: "Social Media Management", en: "Social Media Management" },
  "service.socialMediaDesc": {
    it: "Strategia, contenuti e crescita organica sui canali",
    en: "Strategy, content and organic growth across channels",
  },
  "service.digitalMarketing": { it: "Marketing Digitale", en: "Digital Marketing" },
  "service.digitalMarketingDesc": {
    it: "ADS, performance e funnel di conversione",
    en: "Ads, performance and conversion funnels",
  },
  "service.webDev": { it: "Siti Web Custom", en: "Custom Websites" },
  "service.webDevDesc": {
    it: "Codice scritto a mano, scalabile e veloce — niente template generici",
    en: "Hand-coded, scalable and fast — no off-the-shelf templates",
  },

  // Form Steps (new compact 6-step flow)
  "step.agent": { it: "Brief", en: "Brief" },
  "step.company": { it: "Azienda", en: "Company" },
  "step.contact": { it: "Contatto", en: "Contact" },
  "step.address": { it: "Sede", en: "Address" },
  "step.services": { it: "Servizi", en: "Services" },
  "step.summary": { it: "Brief Finale", en: "Final Brief" },

  // Form Navigation
  "form.step": { it: "Passo", en: "Step" },
  "form.of": { it: "di", en: "of" },
  "form.complete": { it: "Completato", en: "Complete" },
  "form.previous": { it: "Indietro", en: "Previous" },
  "form.next": { it: "Avanti", en: "Next" },
  "form.submit": { it: "Invia Brief", en: "Submit Brief" },
  "form.submitting": { it: "Invio in corso...", en: "Submitting..." },
  "form.optional": { it: "(facoltativo)", en: "(optional)" },
  "form.skipSection": { it: "Salta sezione", en: "Skip section" },
  "form.skipToSummary": { it: "Vai al riepilogo", en: "Jump to summary" },
  "form.sectionOptional": { it: "Sezione facoltativa — puoi saltarla", en: "Optional section — feel free to skip" },

  // Agent / brief meta
  "agent.title": { it: "Informazioni Brief", en: "Brief Information" },
  "agent.subtitle": { it: "Chi compila e quando", en: "Who fills this in and when" },
  "agent.name": { it: "Nome Agente / Account", en: "Agent / Account Name" },
  "agent.namePlaceholder": { it: "Nome del referente Anvance", en: "Anvance team member name" },
  "agent.date": { it: "Data del brief", en: "Brief date" },
  "agent.existingClient": { it: "È già cliente di Anvance Production?", en: "Already an Anvance Production client?" },
  "agent.existingClientDesc": { it: "Spuntare se è un cliente attivo o storico", en: "Tick if the company is already an active or past client" },
  "agent.since": { it: "Cliente dal", en: "Client since" },

  // Company Info
  "company.title": { it: "Informazioni Azienda", en: "Company Information" },
  "company.subtitle": { it: "Raccontaci della tua attività", en: "Tell us about your business" },
  "company.name": { it: "Ragione Sociale", en: "Company Name" },
  "company.namePlaceholder": { it: "Inserisci il nome dell'azienda", en: "Enter your company name" },
  "company.nameRequired": { it: "La ragione sociale è obbligatoria", en: "Company name is required" },
  "company.businessType": { it: "Settore / Tipo di attività", en: "Business Type" },
  "company.businessTypePlaceholder": { it: "es. Ristorante, Retail moda, Studio professionale", en: "e.g. Restaurant, Fashion retail, Professional studio" },
  "company.vatNumber": { it: "Partita IVA", en: "VAT Number" },
  "company.taxCode": { it: "Codice Fiscale", en: "Tax Code" },

  // Contact Info
  "contact.title": { it: "Informazioni di Contatto", en: "Contact Information" },
  "contact.subtitle": { it: "Come possiamo contattarti?", en: "How can we reach you?" },
  "contact.name": { it: "Nome Referente", en: "Contact Name" },
  "contact.namePlaceholder": { it: "Nome completo", en: "Full name" },
  "contact.nameRequired": { it: "Il nome referente è obbligatorio", en: "Contact name is required" },
  "contact.role": { it: "Ruolo", en: "Role" },
  "contact.rolePlaceholder": { it: "es. Marketing Manager, Titolare", en: "e.g. Marketing Manager, Owner" },
  "contact.email": { it: "Email", en: "Email" },
  "contact.emailPlaceholder": { it: "email@azienda.com", en: "email@company.com" },
  "contact.emailRequired": { it: "L'email è obbligatoria", en: "Email is required" },
  "contact.emailInvalid": { it: "Indirizzo email non valido", en: "Invalid email address" },
  "contact.phone": { it: "Telefono", en: "Phone" },
  "contact.phonePlaceholder": { it: "+39 000 000 0000", en: "+39 000 000 0000" },
  "contact.website": { it: "Sito Web Attuale", en: "Current Website" },
  "contact.websitePlaceholder": { it: "https://www.tuaazienda.com", en: "https://www.yourcompany.com" },

  // Address
  "address.title": { it: "Sede dell'attività", en: "Business Address" },
  "address.subtitle": { it: "Dove si trova la tua attività?", en: "Where is your business located?" },
  "address.street": { it: "Indirizzo (via, numero)", en: "Street Address" },
  "address.streetPlaceholder": { it: "Via Roma, 1", en: "Via Roma, 1" },
  "address.city": { it: "Città", en: "City" },
  "address.cityPlaceholder": { it: "Milano", en: "Milan" },
  "address.postalCode": { it: "CAP", en: "Postal Code" },
  "address.province": { it: "Provincia", en: "Province" },
  "address.country": { it: "Paese", en: "Country" },

  // ─────────────────────────────────────────────────────────────
  //  SERVIZI — the new direct, simplified services step
  // ─────────────────────────────────────────────────────────────
  "services.title": { it: "Servizi Richiesti", en: "Requested Services" },
  "services.subtitle": {
    it: "Cosa ti serve, in modo diretto. Spunta solo ciò che ti interessa.",
    en: "What you need, straight to the point. Tick only what you want.",
  },

  // Yes / No control
  "svc.yes": { it: "Sì", en: "Yes" },
  "svc.no": { it: "No", en: "No" },

  // Website block
  "svc.website.title": { it: "Sito Web", en: "Website" },
  "svc.website.question": { it: "Vuoi un sito web nuovo o un restyling?", en: "Do you want a new website or a redesign?" },
  "svc.website.platform": { it: "Quale piattaforma preferisci?", en: "Which platform do you prefer?" },
  "svc.website.platformHint": {
    it: "Consigliamo custom code: più scalabile, veloce e di tua proprietà.",
    en: "We recommend custom code: more scalable, faster, fully yours.",
  },
  "svc.website.purpose": { it: "Tipo di sito", en: "Website type" },
  "svc.website.currentStatus": { it: "Hai già un sito?", en: "Do you already have a website?" },
  "websitePlatform.custom_code": { it: "Custom code — più scalabile, veloce, sicuro", en: "Custom code — more scalable, faster, more secure" },
  "websitePlatform.wordpress": { it: "WordPress — più rapido, basato su template", en: "WordPress — faster setup, template-based" },
  "websitePlatform.undecided": { it: "Non so, voglio un consiglio", en: "Not sure, I'd like a recommendation" },
  "websitePurpose.vetrina": { it: "Sito vetrina", en: "Showcase site" },
  "websitePurpose.ecommerce": { it: "E-commerce", en: "E-commerce" },
  "websitePurpose.landing": { it: "Landing page", en: "Landing page" },
  "websitePurpose.booking": { it: "Booking / prenotazioni", en: "Booking" },
  "websitePurpose.portfolio": { it: "Portfolio", en: "Portfolio" },
  "websitePurpose.webapp": { it: "Web app / piattaforma", en: "Web app / platform" },
  "websiteCurrent.nessuno": { it: "Nessun sito", en: "No website" },
  "websiteCurrent.obsoleto": { it: "Sì, ma è obsoleto", en: "Yes, but it's outdated" },
  "websiteCurrent.funzionante": { it: "Sì, funzionante", en: "Yes, working fine" },

  // Logo block
  "svc.logo.title": { it: "Logo & Identità", en: "Logo & Identity" },
  "svc.logo.question": { it: "Vuoi un nuovo logo o un restyling?", en: "Do you want a new logo or a redesign?" },
  "svc.logo.style": { it: "Stile preferito", en: "Preferred style" },
  "svc.logo.palette": { it: "Palette colori desiderata", en: "Desired colour palette" },
  "svc.logo.palettePlaceholder": {
    it: "es. blu navy + oro, monocromatico nero, pastello…",
    en: "e.g. navy blue + gold, monochrome black, pastel…",
  },
  "svc.logo.references": { it: "Brand di riferimento / ispirazione", en: "Reference brands / inspiration" },
  "svc.logo.referencesPlaceholder": {
    it: "Brand, loghi o stili che ti piacciono",
    en: "Brands, logos or styles you like",
  },
  "logoStyle.minimal": { it: "Minimal", en: "Minimal" },
  "logoStyle.elegante": { it: "Elegante", en: "Elegant" },
  "logoStyle.moderno": { it: "Moderno", en: "Modern" },
  "logoStyle.classico": { it: "Classico", en: "Classic" },
  "logoStyle.audace": { it: "Audace / bold", en: "Bold" },
  "logoStyle.vintage": { it: "Vintage", en: "Vintage" },
  "logoStyle.playful": { it: "Playful", en: "Playful" },
  "logoStyle.lusso": { it: "Lusso", en: "Luxury" },

  // Social block
  "svc.social.title": { it: "Social Media", en: "Social Media" },
  "svc.social.currentChannels": { it: "Quali canali hai già attivi?", en: "Which channels are already active?" },
  "svc.social.management": { it: "Vuoi gestione social (strategia + contenuti + pubblicazione)?", en: "Do you want social management (strategy + content + posting)?" },
  "svc.social.goals": { it: "Obiettivi sui social", en: "Social goals" },
  "svc.social.goalsPlaceholder": {
    it: "es. crescita follower, lead, vendite, awareness…",
    en: "e.g. follower growth, leads, sales, awareness…",
  },
  "channel.instagram": { it: "Instagram", en: "Instagram" },
  "channel.facebook": { it: "Facebook", en: "Facebook" },
  "channel.tiktok": { it: "TikTok", en: "TikTok" },
  "channel.youtube": { it: "YouTube", en: "YouTube" },
  "channel.linkedin": { it: "LinkedIn", en: "LinkedIn" },
  "channel.x": { it: "X / Twitter", en: "X / Twitter" },
  "channel.pinterest": { it: "Pinterest", en: "Pinterest" },

  // Video & photo block
  "svc.video.title": { it: "Video & Fotografia", en: "Video & Photography" },
  "svc.video.hint": { it: "Spunta i formati che ti interessano", en: "Tick the formats you're interested in" },
  "svc.video.short": { it: "Video Reels / Short-form", en: "Reels / Short-form video" },
  "svc.video.shortDesc": { it: "TikTok, Reels, Shorts — 15-90 secondi", en: "TikTok, Reels, Shorts — 15-90s" },
  "svc.video.long": { it: "Video Long-form / YouTube", en: "Long-form / YouTube" },
  "svc.video.longDesc": { it: "Episodi, podcast filmati, documentari", en: "Episodes, filmed podcasts, docs" },
  "svc.video.cinematic": { it: "Video Professionali / Cinematic", en: "Professional / Cinematic" },
  "svc.video.cinematicDesc": { it: "Spot commerciali, brand film", en: "Commercials, brand films" },
  "svc.video.photo": { it: "Fotografia Professionale", en: "Professional Photography" },
  "svc.video.photoDesc": { it: "Prodotto, ritratto, team, editoriale", en: "Product, portrait, team, editorial" },
  "svc.video.notes": { it: "Note / idee", en: "Notes / ideas" },
  "svc.video.notesPlaceholder": {
    it: "Idee, riferimenti, location, durata desiderata…",
    en: "Ideas, references, location, target duration…",
  },

  // Graphic design block
  "svc.graphic.title": { it: "Grafica & Stampa", en: "Graphic Design & Print" },
  "svc.graphic.question": { it: "Vuoi servizi di graphic design?", en: "Do you want graphic design services?" },
  "svc.graphic.items": { it: "Quali materiali ti servono?", en: "Which materials do you need?" },
  "graphic.post_social": { it: "Post social / template", en: "Social posts / templates" },
  "graphic.biglietti_visita": { it: "Biglietti da visita", en: "Business cards" },
  "graphic.brochure": { it: "Brochure", en: "Brochure" },
  "graphic.catalogo": { it: "Catalogo prodotti", en: "Product catalogue" },
  "graphic.volantini": { it: "Volantini / flyer", en: "Flyers" },
  "graphic.locandine": { it: "Locandine / poster", en: "Posters" },
  "graphic.menu": { it: "Menu / listino", en: "Menu / pricelist" },
  "graphic.packaging": { it: "Packaging", en: "Packaging" },
  "graphic.presentazioni": { it: "Presentazioni / pitch deck", en: "Presentations / pitch deck" },

  // Ads block
  "svc.ads.title": { it: "Ads & Sponsorizzazioni", en: "Ads & Sponsorships" },
  "svc.ads.question": { it: "Vuoi gestione campagne ADS?", en: "Do you want ads management?" },
  "svc.ads.platforms": { it: "Su quali piattaforme?", en: "On which platforms?" },
  "svc.ads.budget": { it: "Budget mensile ADS", en: "Monthly ads budget" },
  "svc.ads.budgetPlaceholder": { it: "Seleziona il budget", en: "Select budget" },
  "svc.ads.previous": { it: "Hai già investito in campagne ADS in passato?", en: "Have you run ads before?" },
  "adsPlatform.google": { it: "Google Ads", en: "Google Ads" },
  "adsPlatform.meta": { it: "Meta (Facebook + Instagram)", en: "Meta (Facebook + Instagram)" },
  "adsPlatform.tiktok": { it: "TikTok Ads", en: "TikTok Ads" },
  "adsPlatform.youtube": { it: "YouTube Ads", en: "YouTube Ads" },
  "adsPlatform.linkedin": { it: "LinkedIn Ads", en: "LinkedIn Ads" },
  "adsBudget.under_300": { it: "Fino a € 300 / mese", en: "Up to € 300 / month" },
  "adsBudget.300_700": { it: "€ 300 – € 700 / mese", en: "€ 300 – € 700 / month" },
  "adsBudget.700_1500": { it: "€ 700 – € 1.500 / mese", en: "€ 700 – € 1,500 / month" },
  "adsBudget.1500_3000": { it: "€ 1.500 – € 3.000 / mese", en: "€ 1,500 – € 3,000 / month" },
  "adsBudget.over_3000": { it: "Oltre € 3.000 / mese", en: "Over € 3,000 / month" },
  "adsBudget.discuss": { it: "Da discutere", en: "To be discussed" },

  // ─────────────────────────────────────────────────────────────
  //  Final step — pain points, budget, timeline, audience, brief
  // ─────────────────────────────────────────────────────────────
  "final.title": { it: "Brief Finale", en: "Final Brief" },
  "final.subtitle": { it: "Ultimi dettagli per chiudere il brief", en: "Last details to close the brief" },

  "final.painTitle": { it: "Difficoltà attuali", en: "Current pain points" },
  "final.painSubtitle": { it: "Quali sono, ad oggi, le difficoltà principali?", en: "What are the main difficulties today?" },
  "pain.low_online_visibility": { it: "Poca visibilità online", en: "Low online visibility" },
  "pain.no_professional_content": { it: "Mancano contenuti professionali", en: "No professional content" },
  "pain.no_social_resources": { it: "Nessuno gestisce i social", en: "No one manages the socials" },
  "pain.no_marketing_strategy": { it: "Nessuna strategia di marketing", en: "No marketing strategy" },
  "pain.logo_not_memorable": { it: "Logo / immagine poco memorabili", en: "Logo / image not memorable" },
  "pain.off_brand_perception": { it: "Comunicazione incoerente con il brand", en: "Communication off-brand" },
  "pain.communication_hard": { it: "Difficile comunicare offerte e novità", en: "Hard to communicate offers / news" },
  "pain.selling_services_hard": { it: "Difficile vendere servizi aggiuntivi", en: "Hard to sell additional services" },
  "pain.low_reviews": { it: "Recensioni basse o reputazione bassa", en: "Low reviews or reputation" },
  "pain.cannot_reach_younger_audience": { it: "Non raggiungo i più giovani", en: "Cannot reach younger audience" },

  "final.audience": { it: "Target audience", en: "Target audience" },
  "final.audiencePlaceholder": {
    it: "Chi è il tuo cliente ideale? Demografia, interessi, comportamenti…",
    en: "Who is your ideal customer? Demographics, interests, behaviours…",
  },
  "final.competitors": { it: "Competitor / brand di ispirazione", en: "Competitors / reference brands" },
  "final.competitorsPlaceholder": {
    it: "Brand che ammiri o competitor diretti",
    en: "Brands you admire or direct competitors",
  },
  "final.description": { it: "Descrizione progetto / obiettivi", en: "Project description / goals" },
  "final.descriptionPlaceholder": {
    it: "Raccontaci obiettivi, visione e requisiti specifici…",
    en: "Tell us about your goals, vision and specific requirements…",
  },
  "final.budget": { it: "Budget complessivo del progetto", en: "Overall project budget" },
  "final.budgetPlaceholder": { it: "Seleziona il budget stimato", en: "Select the estimated budget" },
  "final.timeline": { it: "Tempistiche", en: "Timeline" },
  "final.timelinePlaceholder": { it: "Seleziona tempistiche", en: "Select timeline" },
  "final.contractMonths": {
    it: "Impegno sui canoni mensili (preventivo)",
    en: "Commitment for monthly fees (quote)",
  },
  "final.contractMonthsHint": {
    it: "Usato nel PDF: per ogni voce «Canone mensile» il totale = canone × mesi (es. social 900 € × 6 = 5.400 €). Sito e logo restano di solito una tantum.",
    en: "Used in the PDF: for each “Monthly fee” line, total = fee × months (e.g. social €900 × 6 = €5,400). Website and logo usually stay one-off.",
  },
  "final.contract1": { it: "1 mese", en: "1 month" },
  "final.contract3": { it: "3 mesi", en: "3 months" },
  "final.contract6": { it: "6 mesi", en: "6 months" },
  "final.contract12": { it: "12 mesi (1 anno)", en: "12 months (1 year)" },
  "final.pricingTitle": { it: "Prezzi servizi (preventivo)", en: "Service prices (quote)" },
  "final.pricingSubtitle": {
    it: "Scegli un pacchetto dal listino oppure inserisci un totale unico. Puoi escludere singoli servizi dal preventivo.",
    en: "Pick a package from the price list or enter one total. You can exclude individual services from the quote.",
  },
  "final.pricingEmpty": {
    it: "Nessun servizio selezionato. Torna al passo «Servizi» per scegliere cosa includere nel preventivo.",
    en: "No services selected. Go back to the «Services» step to choose what to include in the quote.",
  },
  "final.servicesInQuote": { it: "Servizi nel preventivo", en: "Services in quote" },
  "final.servicesInQuoteHint": {
    it: "Clicca per includere o escludere (escludi ciò che non fa parte dell’offerta).",
    en: "Click to include or exclude (turn off what is not part of the offer).",
  },
  "final.quoteMode": { it: "Modalità prezzo", en: "Pricing mode" },
  "final.modePackage": { it: "Pacchetto", en: "Package" },
  "final.modeCustom": { it: "Totale personalizzato", en: "Custom total" },
  "final.noPackages": {
    it: "Nessun pacchetto attivo nel listino. Crea almeno un pacchetto con servizi e prezzo totale, poi salva.",
    en: "No active packages in the price list. Create at least one package with services and a total price, then save.",
  },
  "final.packagesLoading": { it: "Caricamento pacchetti…", en: "Loading packages…" },
  "final.goToListino": { it: "Vai a Listino preventivi → Pacchetti", en: "Go to Quote price list → Packages" },
  "final.packageHint": {
    it: "Suggerimento: seleziona anche questi servizi nel passo Servizi",
    en: "Tip: also select these services in the Services step",
  },
  "final.packageNoPrice": {
    it: "Imposta un prezzo totale > 0 nel listino",
    en: "Set a total price > 0 in the price list",
  },
  "final.totalPrice": { it: "Totale preventivo (€)", en: "Quote total (€)" },
  "final.totalBilling": { it: "Tipo importo", en: "Amount type" },
  "final.perMonth": { it: "/mese", en: "/mo" },
  "final.packageFrozenHint": {
    it: "Il prezzo del pacchetto viene salvato su questo brief al momento dell’invio — modifiche future al listino non lo cambiano.",
    en: "Package price is saved on this brief at submit — future listino edits will not change it.",
  },

  // Packages (listino settings)
  "pkg.cardTitle": { it: "Pacchetti", en: "Packages" },
  "pkg.cardDesc": {
    it: "Raggruppa servizi con un prezzo totale. I pacchetti compaiono nel brief finale per una scelta rapida.",
    en: "Group services with one total price. Packages appear in the final brief step for quick selection.",
  },
  "pkg.empty": { it: "Nessun pacchetto. Aggiungine uno per semplificare il preventivo.", en: "No packages yet. Add one to simplify quoting." },
  "pkg.add": { it: "Aggiungi pacchetto", en: "Add package" },
  "pkg.newName": { it: "Nuovo pacchetto", en: "New package" },
  "pkg.name": { it: "Nome pacchetto", en: "Package name" },
  "pkg.total": { it: "Prezzo totale (€)", en: "Total price (€)" },
  "pkg.billing": { it: "Tipo", en: "Type" },
  "pkg.services": { it: "Servizi inclusi", en: "Included services" },
  "pkg.active": { it: "Attivo nel brief finale", en: "Active in final brief" },
  "pkg.svc.website": { it: "Sito web", en: "Website" },
  "pkg.svc.logo": { it: "Logo & identità", en: "Logo & identity" },
  "pkg.svc.social": { it: "Social management", en: "Social management" },
  "pkg.svc.reels": { it: "Reels / short-form", en: "Reels / short-form" },
  "pkg.svc.longform": { it: "YouTube / long-form", en: "YouTube / long-form" },
  "pkg.svc.cinematic": { it: "Video cinematic", en: "Cinematic video" },
  "pkg.svc.photo": { it: "Fotografia", en: "Photography" },
  "pkg.svc.graphic": { it: "Graphic design", en: "Graphic design" },
  "pkg.svc.ads": { it: "Ads & campagne", en: "Ads & campaigns" },
  "pkg.pdf.website": {
    it: "Progetto chiavi in mano: UX/UI, sviluppo responsive e messa online",
    en: "Turnkey project: UX/UI, responsive development and go-live",
  },
  "pkg.pdf.logo": {
    it: "Concept creativo, palette colori, tipografia e applicazioni base del marchio",
    en: "Creative concept, colour palette, typography and core brand applications",
  },
  "pkg.pdf.social_management": {
    it: "Piano editoriale, creazione contenuti, pubblicazione e monitoraggio canali",
    en: "Editorial plan, content creation, publishing and channel monitoring",
  },
  "pkg.pdf.video_reels": {
    it: "Script, ripresa, montaggio vertical e ottimizzazione per social e ads",
    en: "Script, filming, vertical edit and optimisation for social and ads",
  },
  "pkg.pdf.video_longform": {
    it: "Episodi e format estesi: pre-produzione, ripresa, editing e consegna",
    en: "Episodes and long-form: pre-production, filming, editing and delivery",
  },
  "pkg.pdf.video_cinematic": {
    it: "Produzione ad alta gamma, regia narrativa, color grading e sound design",
    en: "High-end production, narrative direction, colour grading and sound design",
  },
  "pkg.pdf.photography": {
    it: "Shooting prodotto, ambiente o ritratto per brand, web e campagne",
    en: "Product, lifestyle or portrait shoots for brand, web and campaigns",
  },
  "pkg.pdf.graphic_design": {
    it: "Materiali coordinati: social, print, presentazioni e supporti promozionali",
    en: "Coordinated assets: social, print, decks and promotional materials",
  },
  "pkg.pdf.ads": {
    it: "Strategia media, setup campagne, gestione budget e ottimizzazione performance",
    en: "Media strategy, campaign setup, budget management and performance optimisation",
  },

  "budget.under_500": { it: "Fino a € 500 / mese", en: "Up to € 500 / month" },
  "budget.500_1000": { it: "€ 500 – € 1.000 / mese", en: "€ 500 – € 1,000 / month" },
  "budget.1000_2500": { it: "€ 1.000 – € 2.500 / mese", en: "€ 1,000 – € 2,500 / month" },
  "budget.2500_5000": { it: "€ 2.500 – € 5.000 / mese", en: "€ 2,500 – € 5,000 / month" },
  "budget.over_5000": { it: "Oltre € 5.000 / mese", en: "Over € 5,000 / month" },
  "budget.one_off_3000_10000": { it: "Progetto una tantum € 3k – € 10k", en: "One-off project € 3k – € 10k" },
  "budget.one_off_10000_plus": { it: "Progetto una tantum € 10k+", en: "One-off project € 10k+" },
  "budget.discuss": { it: "Da discutere", en: "To be discussed" },

  "timeline.urgent": { it: "Urgente (1-2 settimane)", en: "Urgent (1-2 weeks)" },
  "timeline.standard": { it: "Standard (1-2 mesi)", en: "Standard (1-2 months)" },
  "timeline.flexible": { it: "Flessibile (3+ mesi)", en: "Flexible (3+ months)" },
  "timeline.ongoing": { it: "Continuativo / Retainer", en: "Ongoing / Retainer" },

  // Success
  "success.title": { it: "Brief inviato. Grazie!", en: "Brief submitted. Thank you!" },
  "success.message": {
    it: "Il tuo brief è stato inviato con successo. Il team di Anvance Production lo analizzerà e ti contatterà entro 24-48 ore lavorative con una proposta su misura.",
    en: "Your brief has been submitted successfully. The Anvance Production team will review it and get back to you within 24-48 business hours with a tailored proposal.",
  },
  "success.submitAnother": { it: "Invia un altro brief", en: "Submit another brief" },
  "success.downloadPdf": {
    it: "Scarica preventivo PDF (con totali)",
    en: "Download quote PDF (with totals)",
  },
  "success.toast": { it: "Brief inviato con successo!", en: "Brief submitted successfully!" },
  "error.toast": { it: "Invio fallito. Riprova.", en: "Failed to submit. Please try again." },

  // Admin Dashboard
  "admin.title": { it: "Dashboard", en: "Dashboard" },
  "admin.subtitle": { it: "Gestisci e rivedi tutti i brief dei clienti.", en: "Manage and review all client briefs." },
  "admin.clientBriefs": { it: "Inviati", en: "Sent" },
  "admin.search": { it: "Cerca clienti...", en: "Search clients..." },
  "admin.allStatus": { it: "Tutti gli stati", en: "All statuses" },
  "admin.noClients": { it: "Nessun brief cliente ancora", en: "No client briefs yet" },
  "admin.noMatch": { it: "Nessun cliente corrisponde ai filtri", en: "No clients match your filters" },
  "admin.viewDetails": { it: "Vedi dettagli", en: "View details" },
  "admin.downloadPdf": { it: "Scarica PDF", en: "Download PDF" },
  "admin.changeStatus": { it: "Cambia stato", en: "Change status" },
  "admin.delete": { it: "Elimina", en: "Delete" },
  "admin.deleteConfirm": { it: "Sei sicuro di voler eliminare questo cliente?", en: "Are you sure you want to delete this client?" },

  // Stats
  "stats.totalBriefs": { it: "Brief totali", en: "Total briefs" },
  "stats.newRequests": { it: "Nuove richieste", en: "New requests" },
  "stats.inProgress": { it: "In lavorazione", en: "In progress" },
  "stats.completed": { it: "Completati", en: "Completed" },

  // Status
  "status.new": { it: "Nuovo", en: "New" },
  "status.contacted": { it: "Contattato", en: "Contacted" },
  "status.in_progress": { it: "In lavorazione", en: "In progress" },
  "status.completed": { it: "Completato", en: "Completed" },
  "status.archived": { it: "Archiviato", en: "Archived" },

  // Project Types (kept for legacy admin badges)
  "projectType.cinematic_video": { it: "Video Cinematografico", en: "Cinematic Video" },
  "projectType.reels": { it: "Reels & Short-form", en: "Reels & Short-form" },
  "projectType.youtube": { it: "YouTube Long-form", en: "YouTube Long-form" },
  "projectType.photography": { it: "Fotografia Professionale", en: "Professional Photography" },
  "projectType.website": { it: "Sito Web Custom", en: "Custom Website" },
  "projectType.branding": { it: "Brand Identity", en: "Brand Identity" },
  "projectType.social_management": { it: "Social Media Management", en: "Social Media Management" },
  "projectType.ads": { it: "Advertising", en: "Advertising" },

  // Table Headers
  "table.company": { it: "Azienda", en: "Company" },
  "table.contact": { it: "Contatto", en: "Contact" },
  "table.services": { it: "Servizi", en: "Services" },
  "table.status": { it: "Stato", en: "Status" },
  "table.date": { it: "Data", en: "Date" },

  // Modal
  "modal.close": { it: "Chiudi", en: "Close" },
  "modal.clientDetails": { it: "Dettagli cliente", en: "Client details" },

  // Admin — pricing settings
  "pricing.title": { it: "Listino preventivi", en: "Quote price list" },
  "pricing.subtitle": {
    it: "Pacchetti con prezzo totale per il brief finale, più IVA applicata al PDF preventivo.",
    en: "Packages with total price for the final brief step, plus VAT applied on the quote PDF.",
  },
  "pricing.vatCardTitle": { it: "IVA", en: "VAT" },
  "pricing.vatCardDesc": {
    it: "Aliquota IVA (%) applicata al totale imponibile nel PDF preventivo.",
    en: "VAT rate (%) applied to the taxable total on the quote PDF.",
  },
  "pricing.cardTitle": { it: "Tariffe servizi", en: "Service rates" },
  "pricing.cardDesc": {
    it: "Tariffe in €. Per ogni voce (eccetto IVA) usa l’interruttore «Prezzo nel PDF»: se disattivo, quella tariffa non compare nel preventivo PDF. Nella seconda card scegli se social management, Reels, YouTube, video cinematic, foto, graphic, setup Ads e gestione Ads compaiono come progetto una tantum o come canone mensile; imposta anche i canoni mensili dedicati (se lasci 0, in modalità mensile si usa il prezzo progetto come base). Il cliente indica nel brief finale quanti mesi di impegno (1/3/6/12) per moltiplicare i canoni nel PDF.",
    en: "Rates in €. For each item (except VAT), use “Show price in PDF”: when off, that rate is omitted from the quote PDF. In the second card, choose whether social management, reels, YouTube, cinematic video, photo, graphic, Ads setup and Ads monthly management appear as a one-off project or as a monthly retainer; set dedicated monthly rates too (if 0, monthly mode falls back to the project price). The client picks commitment months (1/3/6/12) in the final step to multiply monthly lines in the PDF.",
  },
  "pricing.showInPdf": { it: "Prezzo nel PDF", en: "Show price in PDF" },
  "pricing.websiteCustom": { it: "Sito web — custom (progetto, €)", en: "Website — custom (project, €)" },
  "pricing.websiteWp": { it: "Sito web — WordPress (progetto, €)", en: "Website — WordPress (project, €)" },
  "pricing.logo": { it: "Logo & identità (progetto, €)", en: "Logo & identity (project, €)" },
  "pricing.socialMonthly": { it: "Social management — al mese (€)", en: "Social management — per month (€)" },
  "pricing.videoReels": { it: "Pacchetto Reels / short-form (€)", en: "Reels / short-form package (€)" },
  "pricing.videoReelsMonthly": {
    it: "Reels — canone mensile (€, 0 = come pacchetto)",
    en: "Reels — monthly retainer (€, 0 = same as package)",
  },
  "pricing.videoLong": { it: "Pacchetto long-form / YouTube (€)", en: "Long-form / YouTube package (€)" },
  "pricing.videoLongMonthly": {
    it: "Long-form — canone mensile (€, 0 = come pacchetto)",
    en: "Long-form — monthly retainer (€, 0 = same as package)",
  },
  "pricing.videoCine": { it: "Video cinematic / spot (€)", en: "Cinematic / spot video (€)" },
  "pricing.videoCineMonthly": {
    it: "Video cinematic — canone mensile (€, 0 = come progetto)",
    en: "Cinematic video — monthly retainer (€, 0 = same as project)",
  },
  "pricing.photoDay": { it: "Fotografia — giornata (€)", en: "Photography — day rate (€)" },
  "pricing.photoMonthly": {
    it: "Fotografia — canone mensile (€, 0 = come giornata)",
    en: "Photography — monthly retainer (€, 0 = same as day rate)",
  },
  "pricing.graphic": { it: "Graphic design — per voce listino (€)", en: "Graphic design — per line item (€)" },
  "pricing.graphicMonthly": {
    it: "Graphic — canone mensile retainer (€, 0 = come listino/voce)",
    en: "Graphic — monthly retainer (€, 0 = same as per-item rate)",
  },
  "pricing.adsSetup": { it: "Ads — setup una tantum (€)", en: "Ads — one-off setup (€)" },
  "pricing.adsSetupMonthly": {
    it: "Ads — strategia/setup canone mensile (€, 0 = come una tantum)",
    en: "Ads — strategy/setup monthly (€, 0 = same as one-off)",
  },
  "pricing.billingCardTitle": { it: "Modalità nel PDF", en: "How lines appear in the PDF" },
  "pricing.billingCardDesc": {
    it: "«Mensile» = colonna Tipo «Canone mensile» e totale = canone × mesi scelti dal cliente. «Una tantum» = progetto/pacchetto singolo.",
    en: "“Monthly” = PDF type “Monthly fee” and total = fee × months chosen by the client. “One-off” = single project/package.",
  },
  "pricing.billingOnce": { it: "Una tantum (progetto / pacchetto)", en: "One-off (project / package)" },
  "pricing.billingMonthly": { it: "Canone mensile (retainer)", en: "Monthly retainer" },
  "pricing.billSocial": { it: "Social media management", en: "Social media management" },
  "pricing.billReels": { it: "Reels / short-form", en: "Reels / short-form" },
  "pricing.billLong": { it: "YouTube / long-form", en: "YouTube / long-form" },
  "pricing.billCine": { it: "Video cinematic / spot", en: "Cinematic / spot video" },
  "pricing.billPhoto": { it: "Fotografia", en: "Photography" },
  "pricing.billGraphic": { it: "Graphic design", en: "Graphic design" },
  "pricing.billAdsSetup": { it: "Ads — strategia & setup", en: "Ads — strategy & setup" },
  "pricing.billAdsManagement": { it: "Ads — gestione al mese", en: "Ads — monthly management" },
  "pricing.adsMonthly": {
    it: "Ads — gestione al mese (€, 0 = non in preventivo)",
    en: "Ads — monthly management (€, 0 = omit from quote)",
  },
  "pricing.vat": { it: "IVA % sul totale", en: "VAT % on subtotal" },
  "pricing.save": { it: "Salva listino", en: "Save price list" },
  "pricing.saved": { it: "Listino salvato.", en: "Price list saved." },
  "pricing.reset": { it: "Ripristinati i valori predefiniti.", en: "Defaults restored." },
  "pricing.resetDefaults": { it: "Ripristina predefiniti", en: "Reset to defaults" },
  "pricing.backAdmin": { it: "Torna alla dashboard", en: "Back to dashboard" },

  "admin.settingsLink": { it: "Listino preventivi", en: "Quote price list" },
  "admin.editBrief": { it: "Modifica brief", en: "Edit brief" },
  "admin.saveChanges": { it: "Salva modifiche", en: "Save changes" },
  "admin.discardEdits": { it: "Annulla", en: "Discard" },
  "admin.saved": { it: "Brief aggiornato.", en: "Brief updated." },
  "admin.saveError": { it: "Salvataggio non riuscito.", en: "Save failed." },
  "admin.downloadBriefPdf": { it: "PDF analisi", en: "PDF brief" },
  "admin.downloadProposalPdf": { it: "PDF preventivo", en: "PDF quote" },
  "admin.servicesFromBrief": { it: "Servizi dal brief", en: "Services from brief" },
  "admin.notesInternal": { it: "Note interne", en: "Internal notes" },
  "admin.notesPlaceholder": {
    it: "Promemoria commerciali, follow-up, varianti preventivo…",
    en: "Commercial notes, follow-up, quote variants…",
  },

  "project.title": { it: "Richiesta", en: "Request" },
  "project.services": { it: "Macro servizi (legacy)", en: "Macro services (legacy)" },
  "project.budget": { it: "Budget indicativo", en: "Indicative budget" },
  "project.timeline": { it: "Tempistiche", en: "Timeline" },
  "project.description": { it: "Descrizione progetto", en: "Project description" },
  "videoPhoto.title": { it: "Video & foto (legacy)", en: "Video & photo (legacy)" },
  "videoPhoto.style": { it: "Stile video", en: "Video style" },
  "videoPhoto.duration": { it: "Durata", en: "Duration" },
  "videoPhoto.location": { it: "Location", en: "Location" },
  "videoPhoto.talent": { it: "Talent", en: "Talent" },
  "videoPhoto.equipment": { it: "Attrezzatura", en: "Equipment" },
  "website.title": { it: "Sito web (legacy)", en: "Website (legacy)" },
  "website.type": { it: "Tipo sito", en: "Site type" },
  "website.domain": { it: "Dominio", en: "Domain" },
  "website.hosting": { it: "Hosting", en: "Hosting" },
  "website.features": { it: "Funzionalità", en: "Features" },
  "brand.title": { it: "Brand & audience", en: "Brand & audience" },
  "brand.colors": { it: "Colori brand (legacy)", en: "Brand colours (legacy)" },
  "brand.fonts": { it: "Font (legacy)", en: "Fonts (legacy)" },
  "brand.guidelines": { it: "Linee guida URL", en: "Guidelines URL" },
  "brand.audience": { it: "Target audience", en: "Target audience" },
  "brand.competitors": { it: "Competitor / ispirazioni", en: "Competitors / references" },

  "websiteType.e-commerce": { it: "E-Commerce", en: "E-Commerce" },
  "websiteType.portfolio": { it: "Portfolio", en: "Portfolio" },
  "websiteType.corporate": { it: "Corporate", en: "Corporate" },
  "websiteType.landing": { it: "Landing", en: "Landing" },
  "websiteType.webapp": { it: "Web app", en: "Web app" },
  "websiteType.booking": { it: "Booking", en: "Booking" },
  "videoStyle.cinematic": { it: "Cinematic", en: "Cinematic" },
  "videoStyle.documentary": { it: "Documentario", en: "Documentary" },
  "videoStyle.commercial": { it: "Commerciale", en: "Commercial" },
  "videoStyle.corporate": { it: "Corporate", en: "Corporate" },
  "videoStyle.social": { it: "Social", en: "Social" },
  "videoStyle.event": { it: "Eventi", en: "Events" },
  "videoStyle.reels": { it: "Reels", en: "Reels" },
  "videoStyle.youtube": { it: "YouTube", en: "YouTube" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("it")

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === "it" || stored === "en") setLanguageState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
