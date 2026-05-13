"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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

  // Home Page
  "home.badge": { it: "Brief di analisi preliminare", en: "Preliminary Analysis Brief" },
  "home.title": {
    it: "Brand, social e crescita digitale. Raccontati come un film.",
    en: "Brand, social and digital growth. Told like a film.",
  },
  "home.subtitle": {
    it:
      "Compila questo brief: il team di Anvance Production analizzerà il tuo brand, i tuoi canali social e la tua comunicazione, e ti proporrà una strategia su misura tra produzione cinematografica, content, social media management e marketing digitale.",
    en:
      "Complete this brief: the Anvance Production team will analyse your brand, social channels and communication, and craft a tailored strategy across cinematic production, content, social media management and digital marketing.",
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

  // Form Steps
  "step.agent": { it: "Agente", en: "Agent" },
  "step.company": { it: "Azienda", en: "Company" },
  "step.contact": { it: "Contatto", en: "Contact" },
  "step.address": { it: "Sede", en: "Address" },
  "step.store": { it: "Punto Vendita", en: "Store" },
  "step.identity": { it: "Identità", en: "Identity" },
  "step.digital": { it: "Presenza Digitale", en: "Digital Presence" },
  "step.marketing": { it: "Marketing", en: "Marketing" },
  "step.services": { it: "Servizi", en: "Services" },
  "step.video": { it: "Video/Foto", en: "Video/Photo" },
  "step.website": { it: "Sito Web", en: "Website" },
  "step.brand": { it: "Brand", en: "Brand" },
  "step.summary": { it: "Sommario", en: "Summary" },

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

  // Store profile
  "store.title": { it: "Punto Vendita", en: "Point of Sale" },
  "store.subtitle": { it: "Numeri e flusso clienti del negozio o sede operativa", en: "Numbers and customer flow of your store or operational HQ" },
  "store.employees": { it: "Numero dipendenti", en: "Number of employees" },
  "store.employeesPlaceholder": { it: "es. 5", en: "e.g. 5" },
  "store.location": { it: "Posizione", en: "Location" },
  "store.surface": { it: "Superficie (mq)", en: "Surface (sqm)" },
  "store.surfacePlaceholder": { it: "es. 120", en: "e.g. 120" },
  "store.revenue": { it: "Fatturato annuo indicativo", en: "Approx. annual revenue" },
  "store.revenuePlaceholder": { it: "es. € 250.000", en: "e.g. € 250,000" },
  "store.flow": { it: "Flusso clienti — come descriveresti la tua clientela?", en: "Customer flow — how would you describe your customer base?" },
  "store.flagship": { it: "Prodotto o servizio di punta", en: "Flagship product or service" },
  "store.flagshipPlaceholder": { it: "Cosa ti rende riconoscibile?", en: "What makes you recognisable?" },
  "store.competitors": { it: "Negozi / competitor della zona", en: "Local competitors" },
  "store.competitorsPlaceholder": { it: "Elenca i principali competitor locali", en: "List the main local competitors" },

  "storeLocation.centro": { it: "Centro città", en: "City centre" },
  "storeLocation.periferia": { it: "Periferia", en: "Suburbs" },
  "storeLocation.online_only": { it: "Solo online", en: "Online only" },
  "storeLocation.mixed": { it: "Mista (fisico + online)", en: "Mixed (physical + online)" },

  "customerFlow.molto_traffico": { it: "Passa molta gente in negozio", en: "High foot traffic" },
  "customerFlow.poco_traffico": { it: "Passa poca gente", en: "Low foot traffic" },
  "customerFlow.clientela_fidelizzata": { it: "Clientela fidelizzata", en: "Loyal customer base" },
  "customerFlow.traffico_poche_vendite": { it: "Molto traffico ma poche vendite", en: "High traffic, low conversion" },
  "customerFlow.traffico_comunicazione_scarsa": { it: "Buon traffico ma comunicazione scarsa", en: "Good traffic, weak communication" },
  "customerFlow.clientela_discontinua": { it: "Clientela discontinua", en: "Inconsistent customer base" },

  // Identità di brand
  "identity.title": { it: "Identità & Punto Vendita", en: "Identity & Point of Sale" },
  "identity.subtitle": { it: "Logo, colori, materiali e coerenza visiva", en: "Logo, colours, materials and visual consistency" },
  "identity.hasLogo": { it: "Il negozio ha un logo?", en: "Does the business have a logo?" },
  "identity.logoYear": { it: "Anno di creazione del logo", en: "Year the logo was created" },
  "identity.brandColors": { it: "Colori del brand", en: "Brand colours" },
  "identity.brandColorsPlaceholder": { it: "es. Blu navy, Oro, Bianco", en: "e.g. Navy Blue, Gold, White" },
  "identity.brandFonts": { it: "Font del brand", en: "Brand fonts" },
  "identity.brandFontsPlaceholder": { it: "es. Helvetica, Playfair Display", en: "e.g. Helvetica, Playfair Display" },
  "identity.guidelines": { it: "Brand guidelines (URL)", en: "Brand guidelines (URL)" },
  "identity.guidelinesPlaceholder": { it: "Link alle linee guida o agli asset", en: "Link to your brand guidelines or assets" },
  "identity.materials": { it: "Materiali promozionali presenti (esclusi quelli inviati dai brand)", en: "Promotional materials present (excluding brand-supplied)" },
  "identity.materialsCoordinated": { it: "Biglietti da visita, brochure e materiali sono coordinati al logo?", en: "Are business cards, brochures and materials coordinated with the logo?" },
  "identity.signageCoordinated": { it: "Insegna e arredamento sono coordinati con logo e materiali?", en: "Are signage and store design coordinated with logo and materials?" },

  "promo.biglietti_visita": { it: "Biglietti da visita", en: "Business cards" },
  "promo.brochure": { it: "Brochure sui servizi", en: "Service brochures" },
  "promo.catalogo": { it: "Catalogo prodotti", en: "Product catalogue" },
  "promo.volantini": { it: "Volantini / promozioni", en: "Flyers / promos" },
  "promo.segnaletica": { it: "Segnaletica, espositori, ecc.", en: "Signage, displays, etc." },

  // Digital presence — Website
  "digital.title": { it: "Stato Attuale della Comunicazione", en: "Current Communication Status" },
  "digital.subtitle": { it: "Sito web, social, Google Business", en: "Website, social, Google Business" },
  "web.section": { it: "Sito Web", en: "Website" },
  "web.hasWebsite": { it: "È presente un sito web?", en: "Is there a website?" },
  "web.link": { it: "Link del sito", en: "Website link" },
  "web.year": { it: "Anno di creazione", en: "Year of creation" },
  "web.updated": { it: "Il sito è aggiornato con costanza?", en: "Is the site regularly updated?" },
  "web.seo": { it: "Il sito è ottimizzato in ottica SEO?", en: "Is the site SEO-optimised?" },
  "web.pages": { it: "Quante pagine sono presenti?", en: "How many pages are there?" },
  "web.pagesPlaceholder": { it: "es. 8", en: "e.g. 8" },
  "web.sections": { it: "Quali sezioni / contenuti sono presenti?", en: "Which sections / content are present?" },
  "web.vendor": { it: "Fornitore attuale", en: "Current vendor" },

  "section.homepage": { it: "Homepage", en: "Homepage" },
  "section.chi_siamo": { it: "Chi siamo", en: "About us" },
  "section.servizi": { it: "Servizi", en: "Services" },
  "section.contatti": { it: "Contatti", en: "Contact" },
  "section.assistenza": { it: "Assistenza", en: "Support" },
  "section.recensioni": { it: "Recensioni", en: "Reviews" },
  "section.catalogo": { it: "Catalogo", en: "Catalogue" },
  "section.shop": { it: "Shop / E-commerce", en: "Shop / E-commerce" },
  "section.blog": { it: "Blog / News", en: "Blog / News" },

  // Social
  "social.section": { it: "Social Media", en: "Social Media" },
  "social.active": { it: "Sono presenti profili social attivi?", en: "Are there active social profiles?" },
  "social.channels": { it: "Quali canali", en: "Which channels" },
  "social.frequency": { it: "Frequenza di pubblicazione", en: "Posting frequency" },
  "social.managedBy": { it: "C'è qualcuno che se ne occupa?", en: "Is there someone managing them?" },
  "social.vendor": { it: "Fornitore / agenzia attuale", en: "Current vendor / agency" },
  "social.tone": { it: "Tono di voce", en: "Tone of voice" },

  "channel.facebook": { it: "Facebook", en: "Facebook" },
  "channel.instagram": { it: "Instagram", en: "Instagram" },
  "channel.linkedin": { it: "LinkedIn", en: "LinkedIn" },
  "channel.tiktok": { it: "TikTok", en: "TikTok" },
  "channel.youtube": { it: "YouTube", en: "YouTube" },
  "channel.x": { it: "X / Twitter", en: "X / Twitter" },
  "channel.pinterest": { it: "Pinterest", en: "Pinterest" },

  "tone.professionale": { it: "Professionale", en: "Professional" },
  "tone.amichevole": { it: "Amichevole", en: "Friendly" },
  "tone.tecnico": { it: "Tecnico", en: "Technical" },
  "tone.indefinito": { it: "Indefinito", en: "Undefined" },

  "freq.3_5_settimana": { it: "3-5 volte a settimana", en: "3-5 times / week" },
  "freq.1_settimana": { it: "1 volta a settimana", en: "Once / week" },
  "freq.1_mese": { it: "1 volta al mese", en: "Once / month" },
  "freq.3_5_anno": { it: "3-5 volte all'anno", en: "3-5 times / year" },
  "freq.mai": { it: "Mai / non programmato", en: "Never / not scheduled" },

  // Google Business
  "gmb.section": { it: "Profilo Google Business", en: "Google Business Profile" },
  "gmb.active": { it: "È attivo il profilo Google My Business?", en: "Is the Google My Business profile active?" },
  "gmb.updated": { it: "Logo, immagini, orari sono aggiornati?", en: "Are logo, images and hours up to date?" },
  "gmb.reviews": { it: "Sono presenti recensioni?", en: "Are reviews present?" },

  // Marketing / sponsorizzazioni
  "marketing.title": { it: "Marketing & Sponsorizzazioni", en: "Marketing & Sponsorships" },
  "marketing.subtitle": { it: "Newsletter, WhatsApp, campagne online e tradizionali", en: "Newsletter, WhatsApp, online and traditional campaigns" },
  "marketing.newsletterActive": { it: "Vengono inviate comunicazioni via newsletter?", en: "Are newsletter communications being sent?" },
  "marketing.newsletterFrequency": { it: "Frequenza di invio newsletter", en: "Newsletter frequency" },
  "marketing.newsletterPlatform": { it: "Programma usato", en: "Platform used" },
  "marketing.newsletterPlatformPlaceholder": { it: "es. Mailchimp, Brevo, Klaviyo, custom...", en: "e.g. Mailchimp, Brevo, Klaviyo, custom..." },
  "marketing.newsletterVendor": { it: "Fornitore / chi se ne occupa", en: "Vendor / responsible" },
  "marketing.whatsappActive": { it: "Vengono inviate comunicazioni via WhatsApp?", en: "Are WhatsApp communications being sent?" },
  "marketing.whatsappFrequency": { it: "Frequenza di invio WhatsApp", en: "WhatsApp frequency" },
  "marketing.onlineAds": { it: "Ha mai investito in campagne pubblicitarie online?", en: "Have you ever invested in online ad campaigns?" },
  "marketing.onlineAdsChannels": { it: "Su quali canali", en: "On which channels" },
  "marketing.onlineAdsVendor": { it: "Fornitore campagne online", en: "Online ads vendor" },
  "marketing.offlineAds": { it: "E nelle campagne pubblicitarie tradizionali?", en: "And in traditional ad campaigns?" },
  "marketing.offlineAdsChannels": { it: "Quali canali offline", en: "Which offline channels" },
  "marketing.offlineAdsVendor": { it: "Fornitore campagne offline", en: "Offline ads vendor" },

  "adChannel.google": { it: "Google Ads", en: "Google Ads" },
  "adChannel.facebook": { it: "Facebook Ads", en: "Facebook Ads" },
  "adChannel.instagram": { it: "Instagram Ads", en: "Instagram Ads" },
  "adChannel.linkedin": { it: "LinkedIn Ads", en: "LinkedIn Ads" },
  "adChannel.tiktok": { it: "TikTok Ads", en: "TikTok Ads" },
  "adChannel.youtube": { it: "YouTube Ads", en: "YouTube Ads" },
  "adChannel.altro": { it: "Altro", en: "Other" },
  "adChannel.stampa": { it: "Stampa", en: "Print" },
  "adChannel.tv_radio": { it: "TV / Radio", en: "TV / Radio" },
  "adChannel.cartelloni": { it: "Cartelloni / Affissioni", en: "Billboards / OOH" },
  "adChannel.eventi": { it: "Eventi", en: "Events" },
  "adChannel.volantini": { it: "Volantini", en: "Flyers" },

  // Yes/No/Don't know/In arrivo selects
  "yn.si": { it: "Sì", en: "Yes" },
  "yn.no": { it: "No", en: "No" },
  "yn.non_so": { it: "Non so", en: "Don't know" },
  "yn.in_arrivo": { it: "In arrivo", en: "Coming soon" },

  // Services Required (richiesta)
  "services.title": { it: "Servizi Richiesti", en: "Requested Services" },
  "services.subtitle": {
    it: "A quali servizi sei interessato per migliorare la tua immagine e promuovere il tuo brand?",
    en: "Which services are you interested in to improve your image and promote your brand?",
  },
  "services.macroCategories": { it: "Macro-categorie", en: "Macro categories" },

  "services.brand.title": { it: "1. Brand Identity & styling", en: "1. Brand Identity & styling" },
  "services.social.title": { it: "2. Social: strategy, management, creation", en: "2. Social: strategy, management, creation" },
  "services.ads.title": { it: "3. Ads & consulenza", en: "3. Ads & consulting" },
  "services.web.title": { it: "4. Sito web & email marketing", en: "4. Website & email marketing" },

  "svcBrand.brand_analysis": { it: "Analisi dell'identità del brand", en: "Brand identity analysis" },
  "svcBrand.logo_from_scratch": { it: "Creazione di un logo da zero", en: "Logo design from scratch" },
  "svcBrand.logo_digitisation": { it: "Digitalizzazione e sistemazione del logo", en: "Logo digitisation & refinement" },
  "svcBrand.coordinated_image": { it: "Immagine coordinata (biglietti, brochure, catalogo, volantini, segnaletica)", en: "Coordinated image system (cards, brochures, catalogue, flyers, signage)" },
  "svcBrand.print_management": { it: "Gestione stampe", en: "Print management" },
  "svcBrand.store_restyling": { it: "Restyling del punto vendita con fornitori d'arredo", en: "Store restyling with furnishing partners" },
  "svcBrand.merchandising": { it: "Gadget e merchandising", en: "Merchandising & gadgets" },
  "svcBrand.team_photoshoot": { it: "Shooting fotografico professionale del negozio e del team", en: "Professional photoshoot of store & team" },

  "svcSocial.social_strategy": { it: "Elaborazione strategia social", en: "Social strategy development" },
  "svcSocial.editorial_plan": { it: "Elaborazione piani editoriali", en: "Editorial planning" },
  "svcSocial.content_from_client": { it: "Creazione contenuti dal cliente (UGC)", en: "Content captured at client site (UGC)" },
  "svcSocial.studio_content": { it: "Creazione contenuti in studio di posa", en: "Studio content production" },
  "svcSocial.corporate_video": { it: "Creazione video corporate", en: "Corporate video production" },
  "svcSocial.fb_ig_management": { it: "Gestione Facebook + Instagram", en: "Facebook + Instagram management" },
  "svcSocial.tiktok_management": { it: "Gestione TikTok", en: "TikTok management" },
  "svcSocial.linkedin_management": { it: "Gestione LinkedIn", en: "LinkedIn management" },
  "svcSocial.gmb_management": { it: "Gestione profilo Google My Business", en: "Google My Business management" },
  "svcSocial.monthly_reporting": { it: "Monitoraggio e report mensili", en: "Monthly monitoring & reporting" },
  "svcSocial.media_plan": { it: "Media Business Plan + supporto Meta Business Suite", en: "Media Business Plan + Meta Business Suite support" },

  "svcAds.ads_strategy": { it: "Strategia di campagne", en: "Campaign strategy" },
  "svcAds.google_ads": { it: "Campagne Google Ads", en: "Google Ads campaigns" },
  "svcAds.meta_ads": { it: "Campagne Meta (Facebook + Instagram)", en: "Meta (Facebook + Instagram) campaigns" },
  "svcAds.linkedin_ads": { it: "Campagne LinkedIn Ads", en: "LinkedIn Ads campaigns" },
  "svcAds.tiktok_ads": { it: "Campagne TikTok Ads", en: "TikTok Ads campaigns" },
  "svcAds.ads_reporting": { it: "Monitoraggio e report mensili", en: "Monthly monitoring & reporting" },
  "svcAds.training": { it: "Formazione del team interno", en: "Team training" },
  "svcAds.in_store_problem_solving": { it: "Problem solving sul punto vendita", en: "In-store problem solving" },

  "svcWeb.custom_coded_website": {
    it: "Sviluppo sito web custom — codice scritto a mano, scalabile e veloce (no template WordPress generici)",
    en: "Custom-coded website — hand-written code, scalable and fast (no off-the-shelf WordPress templates)",
  },
  "svcWeb.ecommerce": { it: "Sviluppo E-commerce", en: "E-commerce development" },
  "svcWeb.newsletter_setup": { it: "Creazione e gestione Newsletter", en: "Newsletter set-up & management" },
  "svcWeb.site_maintenance": { it: "Aggiornamento e manutenzione sito", en: "Website updates & maintenance" },
  "svcWeb.accessibility": { it: "Ottimizzazione Accessibilità (EAA / WCAG)", en: "Accessibility optimisation (EAA / WCAG)" },
  "svcWeb.seo": { it: "Ottimizzazione SEO", en: "SEO optimisation" },
  "svcWeb.landing_page": { it: "Landing page prodotto o servizio", en: "Product/service landing page" },
  "svcWeb.web_app": { it: "Web application / piattaforma custom", en: "Web application / custom platform" },

  // Pain points
  "pain.title": { it: "Difficoltà riscontrate", en: "Difficulties encountered" },
  "pain.subtitle": { it: "Quali sono, ad oggi, le principali difficoltà?", en: "What are the main difficulties today?" },
  "pain.logo_not_memorable": { it: "Logo e immagine poco riconoscibili e memorabili", en: "Logo and image not recognisable enough" },
  "pain.off_brand_perception": { it: "Negozio datato o non coerente con l'immagine che si vuole dare", en: "Outdated store or inconsistent with desired image" },
  "pain.no_social_resources": { it: "Nessuno si riesce a occupare dei social", en: "No one can take care of social media" },
  "pain.low_online_visibility": { it: "Nessuna o poca visibilità online", en: "No or low online visibility" },
  "pain.no_professional_content": { it: "Assenza di contenuti professionali o ben fatti", en: "No professional or well-made content" },
  "pain.outdated_gmb": { it: "Profilo Google My Business non aggiornato", en: "Google My Business profile not updated" },
  "pain.no_marketing_strategy": { it: "Nessuna strategia di marketing", en: "No marketing strategy" },
  "pain.communication_hard": { it: "Difficoltà a comunicare offerte / novità", en: "Hard to communicate offers / news" },
  "pain.selling_services_hard": { it: "Difficoltà a vendere servizi (assistenza, attivazioni, passaggi operatore, accessori)", en: "Hard to sell services (support, activations, operator changes, accessories)" },
  "pain.low_reviews": { it: "Reputazione compromessa o recensioni basse", en: "Damaged reputation or low reviews" },
  "pain.no_time_to_reply": { it: "Assenza di tempo per rispondere a messaggi e commenti online", en: "No time to reply to online messages and comments" },
  "pain.cannot_reach_younger_audience": { it: "Non riesco a raggiungere le generazioni più giovani", en: "Cannot reach younger generations" },

  // Project Requirements (legacy keys still referenced in some places)
  "project.title": { it: "Servizi Richiesti", en: "Requested Services" },
  "project.subtitle": { it: "Di quali servizi hai bisogno?", en: "Which services do you need?" },
  "project.services": { it: "Servizi", en: "Services" },
  "project.budget": { it: "Budget", en: "Budget" },
  "project.budgetPlaceholder": { it: "Seleziona il budget mensile stimato", en: "Select the estimated monthly budget" },
  "project.timeline": { it: "Tempistiche", en: "Timeline" },
  "project.timelinePlaceholder": { it: "Seleziona tempistiche", en: "Select timeline" },
  "project.description": { it: "Descrizione progetto / obiettivi", en: "Project description / goals" },
  "project.descriptionPlaceholder": { it: "Raccontaci obiettivi, visione e requisiti specifici...", en: "Tell us about your goals, vision, and any specific requirements..." },
  "project.notes": { it: "Note finali (facoltative)", en: "Final notes (optional)" },
  "project.notesPlaceholder": { it: "Qualsiasi altra cosa che dovremmo sapere", en: "Anything else we should know" },

  // Video/Photo
  "videoPhoto.title": { it: "Dettagli Video & Fotografia", en: "Video & Photography Details" },
  "videoPhoto.subtitle": { it: "Specifica i requisiti di produzione", en: "Specify your production requirements" },
  "videoPhoto.style": { it: "Stile principale", en: "Main style" },
  "videoPhoto.stylePlaceholder": { it: "Seleziona stile", en: "Select style" },
  "videoPhoto.duration": { it: "Durata prevista", en: "Expected duration" },
  "videoPhoto.durationPlaceholder": { it: "es. 30 sec, 2 min, 10 min", en: "e.g. 30 sec, 2 min, 10 min" },
  "videoPhoto.location": { it: "Location di ripresa", en: "Shooting location" },
  "videoPhoto.locationPlaceholder": { it: "es. Studio, In sede, Esterni", en: "e.g. Studio, On-site, Outdoor" },
  "videoPhoto.talent": { it: "Talent / modelli necessari", en: "Talent / models needed" },
  "videoPhoto.talentDesc": { it: "Vuoi che ci occupiamo noi del casting?", en: "Do you need us to source talent?" },
  "videoPhoto.equipment": { it: "Note tecniche / attrezzatura", en: "Equipment / technical notes" },
  "videoPhoto.equipmentPlaceholder": { it: "Requisiti tecnici, preferenze di ripresa, attrezzatura...", en: "Specific equipment, camera preferences, or technical considerations..." },

  // Website
  "website.title": { it: "Sviluppo Sito Web Custom", en: "Custom Website Development" },
  "website.subtitle": {
    it: "Tutti i siti Anvance sono custom-coded: scalabili, veloci e di proprietà del cliente.",
    en: "All Anvance sites are custom-coded: scalable, fast, fully owned by the client.",
  },
  "website.type": { it: "Tipo di sito", en: "Website type" },
  "website.typePlaceholder": { it: "Seleziona tipologia", en: "Select type" },
  "website.domain": { it: "Nome dominio", en: "Domain name" },
  "website.domainPlaceholder": { it: "www.tuodominio.com", en: "www.yourdomain.com" },
  "website.features": { it: "Funzionalità richieste", en: "Features required" },
  "website.hosting": { it: "Hosting / infrastruttura", en: "Hosting / infrastructure" },
  "website.hostingPlaceholder": { it: "es. Vercel, AWS, infrastruttura dedicata", en: "e.g. Vercel, AWS, dedicated infrastructure" },

  // Brand Info (audience)
  "brand.title": { it: "Brand & Audience", en: "Brand & Audience" },
  "brand.subtitle": { it: "Aiutaci a comprendere la tua identità e il tuo cliente ideale", en: "Help us understand your identity and ideal customer" },
  "brand.audience": { it: "Target audience", en: "Target audience" },
  "brand.audiencePlaceholder": { it: "Descrivi il tuo cliente ideale: demografica, interessi, comportamenti...", en: "Describe your ideal customer: demographics, interests, behaviours..." },
  "brand.competitors": { it: "Brand di riferimento / competitor che ammiri", en: "Reference brands / competitors you admire" },
  "brand.competitorsPlaceholder": { it: "Elenca brand o competitor che ti ispirano", en: "List brands or competitors that inspire you" },

  // Success
  "success.title": { it: "Brief inviato. Grazie!", en: "Brief submitted. Thank you!" },
  "success.message": {
    it: "Il tuo brief è stato inviato con successo. Il team di Anvance Production lo analizzerà e ti contatterà entro 24-48 ore lavorative con una proposta su misura.",
    en: "Your brief has been submitted successfully. The Anvance Production team will review it and get back to you within 24-48 business hours with a tailored proposal.",
  },
  "success.submitAnother": { it: "Invia un altro brief", en: "Submit another brief" },
  "success.downloadPdf": { it: "Scarica una copia PDF", en: "Download a PDF copy" },
  "success.toast": { it: "Brief inviato con successo!", en: "Brief submitted successfully!" },
  "error.toast": { it: "Invio fallito. Riprova.", en: "Failed to submit. Please try again." },

  // Admin Dashboard
  "admin.title": { it: "Dashboard", en: "Dashboard" },
  "admin.subtitle": { it: "Gestisci e rivedi tutti i brief dei clienti.", en: "Manage and review all client briefs." },
  "admin.clientBriefs": { it: "Brief Clienti", en: "Client Briefs" },
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

  // Project Types
  "projectType.cinematic_video": { it: "Produzione Video Cinematografico", en: "Cinematic Video Production" },
  "projectType.reels": { it: "Reels & Short-form", en: "Reels & Short-form" },
  "projectType.youtube": { it: "YouTube Long-form", en: "YouTube Long-form" },
  "projectType.photography": { it: "Fotografia Professionale", en: "Professional Photography" },
  "projectType.website": { it: "Sito Web Custom", en: "Custom Website" },
  "projectType.branding": { it: "Brand Identity", en: "Brand Identity" },
  "projectType.social_management": { it: "Social Media Management", en: "Social Media Management" },
  "projectType.ads": { it: "Advertising", en: "Advertising" },

  // Website Types
  "websiteType.e-commerce": { it: "E-Commerce", en: "E-Commerce" },
  "websiteType.portfolio": { it: "Portfolio / Showcase", en: "Portfolio / Showcase" },
  "websiteType.corporate": { it: "Corporate", en: "Corporate" },
  "websiteType.landing": { it: "Landing Page", en: "Landing Page" },
  "websiteType.webapp": { it: "Web Application", en: "Web Application" },
  "websiteType.booking": { it: "Booking / Prenotazioni", en: "Booking" },

  // Website Features
  "websiteFeature.cms": { it: "CMS personalizzato", en: "Custom CMS" },
  "websiteFeature.booking": { it: "Prenotazioni / Scheduling", en: "Booking / Scheduling" },
  "websiteFeature.payments": { it: "Pagamenti online", en: "Payment processing" },
  "websiteFeature.analytics": { it: "Dashboard analytics", en: "Analytics dashboard" },
  "websiteFeature.seo": { it: "Ottimizzazione SEO", en: "SEO optimisation" },
  "websiteFeature.multilingual": { it: "Multilingua", en: "Multi-language" },
  "websiteFeature.api": { it: "Integrazione API", en: "API integration" },
  "websiteFeature.auth": { it: "Autenticazione utenti", en: "User authentication" },
  "websiteFeature.accessibility": { it: "Accessibilità EAA", en: "EAA accessibility" },
  "websiteFeature.performance": { it: "Performance & Core Web Vitals", en: "Performance & Core Web Vitals" },

  // Video Styles
  "videoStyle.cinematic": { it: "Cinematografico / Film", en: "Cinematic / Film-like" },
  "videoStyle.documentary": { it: "Documentario", en: "Documentary" },
  "videoStyle.commercial": { it: "Commerciale / Pubblicitario", en: "Commercial / Advertising" },
  "videoStyle.corporate": { it: "Corporate / Business", en: "Corporate / Business" },
  "videoStyle.social": { it: "Ottimizzato Social", en: "Social Media Optimised" },
  "videoStyle.event": { it: "Copertura Eventi", en: "Event Coverage" },
  "videoStyle.reels": { it: "Reels / Short-form", en: "Reels / Short-form" },
  "videoStyle.youtube": { it: "YouTube Long-form", en: "YouTube Long-form" },

  // Budget Ranges
  "budget.under_500": { it: "Fino a € 500 / mese", en: "Up to € 500 / month" },
  "budget.500_1000": { it: "€ 500 – € 1.000 / mese", en: "€ 500 – € 1,000 / month" },
  "budget.1000_2500": { it: "€ 1.000 – € 2.500 / mese", en: "€ 1,000 – € 2,500 / month" },
  "budget.2500_5000": { it: "€ 2.500 – € 5.000 / mese", en: "€ 2,500 – € 5,000 / month" },
  "budget.over_5000": { it: "Oltre € 5.000 / mese", en: "Over € 5,000 / month" },
  "budget.one_off_3000_10000": { it: "Progetto una tantum € 3k – € 10k", en: "One-off project € 3k – € 10k" },
  "budget.one_off_10000_plus": { it: "Progetto una tantum € 10k+", en: "One-off project € 10k+" },
  "budget.discuss": { it: "Da discutere", en: "To be discussed" },

  // Timelines
  "timeline.urgent": { it: "Urgente (1-2 settimane)", en: "Urgent (1-2 weeks)" },
  "timeline.standard": { it: "Standard (1-2 mesi)", en: "Standard (1-2 months)" },
  "timeline.flexible": { it: "Flessibile (3+ mesi)", en: "Flexible (3+ months)" },
  "timeline.ongoing": { it: "Continuativo / Retainer", en: "Ongoing / Retainer" },

  // Table Headers
  "table.company": { it: "Azienda", en: "Company" },
  "table.contact": { it: "Contatto", en: "Contact" },
  "table.services": { it: "Servizi", en: "Services" },
  "table.status": { it: "Stato", en: "Status" },
  "table.date": { it: "Data", en: "Date" },

  // Modal
  "modal.close": { it: "Chiudi", en: "Close" },
  "modal.clientDetails": { it: "Dettagli cliente", en: "Client details" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("it")

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
