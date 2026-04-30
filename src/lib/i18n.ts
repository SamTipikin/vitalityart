/**
 * UI string dictionary — chrome only.
 *
 * Painting titles, descriptions, exhibition names, locations, and other
 * Sanity-stored content stay in their original language and are NOT
 * translated through this dictionary. This file translates only the
 * navigation, section labels, form labels, status messages, etc.
 */

export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

type Dict = Record<string, Record<Locale, string>>;

export const dict: Dict = {
  // Nav
  "nav.home":         { en: "Home",        es: "Inicio" },
  "nav.origins":      { en: "Origins",     es: "Orígenes" },
  "nav.works":        { en: "Works",       es: "Obra" },
  "nav.gallery":      { en: "Gallery",     es: "Galería" },
  "nav.exhibitions":  { en: "Exhibitions", es: "Exposiciones" },
  "nav.contact":      { en: "Contact",     es: "Contacto" },

  // Hero
  "hero.eyebrow":     { en: "Painter · Spain · est. 2018", es: "Pintor · España · est. 2018" },
  "hero.quote.l1":    { en: "After the coma,",    es: "Después del coma," },
  "hero.quote.l2":    { en: "the only thing left", es: "lo único que quedó" },
  "hero.quote.l3":    { en: "was color.",          es: "fue el color." },

  // Origins section
  "origins.label":    { en: "A 01 — Origins",       es: "A 01 — Orígenes" },
  "origins.title.l1": { en: "From the",              es: "De los" },
  "origins.title.l2": { en: "Urals to oil",          es: "Urales al óleo" },
  "origins.title.l3": { en: "on canvas",             es: "sobre lienzo" },
  "origins.bio": {
    en: "Born in the Urals, working today from Spain. After a coma in 2018, Vitaly returned to the canvas with a single conviction — that paint, large and unflinching, was the only honest record of being alive. The work since has been shown in Taipei, Dubai, Bordeaux, Lausanne, and Tokyo.",
    es: "Nacido en los Urales, trabaja hoy desde España. Tras un coma en 2018, Vitaly volvió al lienzo con una sola convicción: que la pintura, grande y sin titubeos, era el único registro honesto de estar vivo. Desde entonces, su obra se ha expuesto en Taipéi, Dubái, Burdeos, Lausana y Tokio.",
  },

  // Featured works
  "works.label":      { en: "A 02 — Featured Works", es: "A 02 — Obras destacadas" },
  "works.title.l1":   { en: "Recent",                es: "Pinturas" },
  "works.title.l2":   { en: "paintings",             es: "recientes" },
  "works.see_all":    { en: "See all",               es: "Ver todas" },          // followed by " {n} →"
  "works.see_all_works": { en: "See all {n} works",  es: "Ver las {n} obras" },

  // Where shown / Tabs
  "shown.label":      { en: "A 03 — Where shown",   es: "A 03 — Dónde expuesto" },
  "shown.title":      { en: "Where shown",          es: "Dónde expuesto" },
  "shown.tab.events":      { en: "Events",          es: "Eventos" },
  "shown.tab.exhibitions": { en: "Exhibitions",     es: "Exposiciones" },

  // Contact
  "contact.label":    { en: "A 04 — Contact",       es: "A 04 — Contacto" },
  "contact.title.l1": { en: "Acquire",              es: "Adquirir" },
  "contact.title.l2": { en: "or commission",        es: "o comisionar" },
  "contact.intro": {
    en: "Vitaly accepts a small number of commissions each year and works directly with galleries and private collectors. Write below — every message is read and replied to.",
    es: "Vitaly acepta un número limitado de encargos cada año y trabaja directamente con galerías y coleccionistas privados. Escribe a continuación — cada mensaje se lee y responde personalmente.",
  },
  "form.name":        { en: "Name",          es: "Nombre" },
  "form.email":       { en: "Email",         es: "Email" },
  "form.message":     { en: "Message",       es: "Mensaje" },
  "form.send":        { en: "Send message",  es: "Enviar mensaje" },
  "form.sending":     { en: "Sending…",      es: "Enviando…" },
  "form.sent":        { en: "Sent ✓",        es: "Enviado ✓" },
  "form.success":     { en: "Thanks — Vitaly will reply within a few days.", es: "Gracias — Vitaly responderá en unos días." },
  "form.error_fallback": { en: "Something went wrong. Try again or email viacatalana@gmail.com.", es: "Algo salió mal. Inténtalo de nuevo o escribe a viacatalana@gmail.com." },
  "form.network_error": { en: "Network error. Try again or email viacatalana@gmail.com.", es: "Error de red. Inténtalo de nuevo o escribe a viacatalana@gmail.com." },
  "form.painting_ctx": { en: "Inquiring about:", es: "Consulta sobre:" },

  // Gallery
  "gallery.label":    { en: "Catalogue",       es: "Catálogo" }, // followed by counts
  "gallery.title.l1": { en: "The full",        es: "El catálogo" },
  "gallery.title.l2": { en: "catalogue.",      es: "completo." },
  "gallery.series_label":     { en: "Series",  es: "Series" },
  "gallery.filter":           { en: "Filter",  es: "Filtro" },
  "gallery.available_only":   { en: "Available only", es: "Solo disponibles" },
  "gallery.section_prefix":   { en: "Series",  es: "Serie" },     // "Series 01 / 06"
  "gallery.works_count":      { en: "works",   es: "obras" },

  // Painting
  "painting.year":            { en: "Year",        es: "Año" },
  "painting.medium":          { en: "Medium",      es: "Medio" },
  "painting.dimensions":      { en: "Dimensions",  es: "Dimensiones" },
  "painting.price":           { en: "Price",       es: "Precio" },
  "painting.acquire":         { en: "Acquire",     es: "Adquirir" },
  "painting.inquire":         { en: "Inquire",     es: "Consultar" },
  "painting.commission":      { en: "Commission similar", es: "Encargar similar" },
  "painting.sold":            { en: "Sold",        es: "Vendido" },
  "painting.contact_for_price": { en: "Contact for price", es: "Precio a consultar" },
  "painting.zoom_hint":       { en: "Hover to zoom", es: "Pasa el cursor para ampliar" },
  "painting.related.l1":      { en: "More from",     es: "Más de" },
  "painting.related.l2":      { en: "this series",   es: "esta serie" },
  "painting.related.label":   { en: "Related",       es: "Relacionados" },
  "painting.see_all":         { en: "See all →",     es: "Ver todas →" },

  // Misc
  "back_to_home":     { en: "← Back to home",  es: "← Volver al inicio" },
  "lang.en":          { en: "EN", es: "EN" },
  "lang.es":          { en: "ES", es: "ES" },
};

/** Translation lookup. Falls back to English if a key is missing in the target locale. */
export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
  const entry = dict[key];
  let str = (entry && (entry[locale] ?? entry[DEFAULT_LOCALE])) ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

/** Detect locale from a pathname. Anything starting with /es/ is Spanish. */
export function getLocale(pathname: string): Locale {
  return pathname.startsWith("/es") ? "es" : "en";
}

/** Compute the equivalent path in the target locale.
 *  /            ↔ /es/
 *  /gallery     ↔ /es/gallery
 *  /gallery/x   ↔ /es/gallery/x
 */
export function pathFor(pathname: string, target: Locale): string {
  // Strip any trailing index path quirks
  const isEsPath = pathname.startsWith("/es");
  const stripped = isEsPath ? pathname.replace(/^\/es\/?/, "/") : pathname;
  const clean = stripped === "" ? "/" : stripped;
  if (target === "en") return clean;
  // Spanish: prepend /es. Avoid /es// when clean is "/".
  return clean === "/" ? "/es/" : `/es${clean}`;
}
