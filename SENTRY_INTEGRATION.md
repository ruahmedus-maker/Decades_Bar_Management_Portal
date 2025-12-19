# 🩺 Sentry Integration Guide

Adding Sentry to the Decades Bar Portal provides real-time error tracking and performance monitoring.

## 1. Install Dependencies
```bash
npm install @sentry/nextjs
```

## 2. Initialize Sentry
Run the Sentry wizard to automatically configure your `next.config.js` and create necessary config files:
```bash
npx @sentry/wizard@latest -i nextjs
```

## 3. Manual Configuration (Fallback)
If you prefer manual setup, create these three files in your project root:

### `sentry.client.config.js`
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
});
```

### `sentry.server.config.js`
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
});
```

### `sentry.edge.config.js`
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
});
```

---

## 🚀 Benefits for Decades Bar
- **Capture Conflicting Progress Updates**: Catch 409 errors or DB timeouts in real-time.
- **WebSocket Monitoring**: Monitor when staff devices lose connection to the maintenance update stream.
- **Performance**: Track if heavy sections (like the Drink Recipe search) are slowing down for staff on older phones.
