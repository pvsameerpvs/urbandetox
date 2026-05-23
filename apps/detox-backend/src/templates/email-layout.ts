export const BRAND_COLOR = "#C6F06B";
export const BRAND_DARK = "#1c1917";
export const BRAND_MUTED = "#78716c";
export const BRAND_BG = "#fafaf9";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailContent {
  html: string;
  text: string;
}

export function baseTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background:${BRAND_BG}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 640px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
    .header { background: ${BRAND_DARK}; padding: 40px 32px 32px; text-align: center; }
    .header h1 { color: ${BRAND_COLOR}; font-size: 22px; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.3px; }
    .header p { color: rgba(255,255,255,0.65); font-size: 14px; margin: 0; }
    .body { padding: 32px; color: ${BRAND_DARK}; font-size: 15px; line-height: 1.7; }
    .body h2 { font-size: 18px; font-weight: 700; margin: 0 0 12px; color: ${BRAND_DARK}; }
    .body p { margin: 0 0 16px; color: #44403c; }
    .badge { display: inline-block; background: ${BRAND_COLOR}; color: ${BRAND_DARK}; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
    .details { background: #f5f5f4; border-radius: 16px; padding: 20px; margin: 20px 0; }
    .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e7e5e4; flex-wrap: wrap; gap: 4px; }
    .details-row:last-child { border-bottom: none; }
    .details-label { font-size: 13px; color: ${BRAND_MUTED}; font-weight: 500; flex-shrink: 0; }
    .details-value { font-size: 14px; color: ${BRAND_DARK}; font-weight: 600; text-align: right; word-break: break-word; max-width: 60%; }
    .footer { background: #f5f5f4; padding: 24px 32px; text-align: center; font-size: 13px; color: ${BRAND_MUTED}; }
    .footer a { color: ${BRAND_MUTED}; text-decoration: underline; }
    .cta { display: inline-block; margin-top: 8px; background: ${BRAND_COLOR}; color: ${BRAND_DARK}; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; }
    .divider { height: 1px; background: #e7e5e4; margin: 24px 0; }
    @media (max-width: 480px) {
      .wrapper { padding: 20px 12px; }
      .header { padding: 32px 20px 24px; }
      .body { padding: 24px 20px; }
      .footer { padding: 20px; }
      .details-value { max-width: 100%; text-align: left; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>Urban Detox</h1>
        <p>Disconnect from routine. Step into your next detox.</p>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p style="margin:0 0 6px;"><strong>Urban Detox</strong> &mdash; Bangalore, India</p>
        <p style="margin:0 0 6px;">hello@urbandetox.in &middot; +91-98765-43210</p>
        <p style="margin:0;"><a href="https://urbandetox.in">urbandetox.in</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
