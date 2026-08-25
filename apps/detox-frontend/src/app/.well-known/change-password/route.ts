import { redirect } from "next/navigation";

/**
 * W3C well-known URL for changing passwords.
 *
 * Chrome and Safari password managers look here when they offer to change a
 * compromised password, so without it that offer either does nothing or dumps
 * the user on the homepage to hunt for the right screen. It is a redirect by
 * spec, not a document.
 *
 * Points at /reset-password, which is where the recovery flow already lives.
 *
 * Deliberately not paired with a resource-hints file or any AI-policy file
 * here: only real standards belong under .well-known, and inventing entries
 * that nothing consumes is noise.
 */
export function GET() {
  redirect("/reset-password");
}
