/**
 * Single source of truth for customer-facing contact details and links used in
 * outgoing email. These were previously hardcoded in each template, which is how
 * a placeholder number survived in production email for so long. Change here.
 */

const rawSiteUrl = process.env.SITE_URL || "https://www.urbandetox.in";

/** No trailing slash, so `${SITE_URL}/path` is always well formed. */
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

/** Digits only, in the form wa.me expects. */
export const SUPPORT_WHATSAPP_NUMBER =
  process.env.SUPPORT_WHATSAPP_NUMBER || "919886639393";

export const SUPPORT_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`;

/** Human-readable form for display in email bodies. */
export const SUPPORT_PHONE_DISPLAY =
  process.env.SUPPORT_PHONE_DISPLAY || "+91 98866 39393";

export const SUPPORT_EMAIL = process.env.FROM_EMAIL || "hello@urbandetox.in";
