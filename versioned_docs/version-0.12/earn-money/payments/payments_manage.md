# Manage Payments

Once your app and products have been approved, you're ready to use Reddit's production payments system. Real payments will be triggered automatically when invoked from approved app versions. No code changes are required.

## Check orders

Reddit keeps track of historical purchases and lets you query orders.

In Devvit Web, use **server-side** `payments.getOrders()` from `@devvit/web/server`. Orders are returned in reverse chronological order and can be filtered by user, product, success state, or other attributes. Expose the data to your client via your own API (e.g. `/api/orders`) if the client needs it.

**Example (server):** expose orders for the current user so the client can show "Purchased!" or a purchase button.

```tsx title="server/index.ts"
import { payments } from "@devvit/web/server";

app.get("/api/orders", async (c) => {
  const orders = await payments.getOrders({ sku: "cosmic_sword" });
  return c.json(orders);
});
```

**Client:** call your `/api/orders` endpoint; if the user has already bought the product, show "Purchased!"; otherwise show a button that calls `purchase("cosmic_sword")` from `@devvit/web/client`.

## Update products

Once your app is in production, existing installations will need to be manually updated via the admin tool if you release a new version. Contact the Developer Platform team if you need to update your app installation versions.

Automatic updates will be supported in a future release.

## Issue a refund

Reddit may reverse transactions under certain circumstances, such as card disputes, policy violations, or technical issues. If there's a problem with a digital good, a user can submit a request for a refund via [Reddit Help](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=29770197409428).

When a transaction is reversed for any reason, you may optionally revoke product functionality from the user by implementing the **refund** endpoint (configured in `devvit.json` under `payments.endpoints.refundOrder`).

**Example (Devvit Web):** in your server's refund endpoint, revoke the entitlement (e.g. decrement lives in Redis).

```tsx title="server/index.ts"
import type { PaymentHandlerResponse, Order } from "@devvit/web/server";
import { redis } from "@devvit/web/server";

const GOD_MODE_SKU = "god_mode";

app.post("/internal/payments/refund", async (c) => {
  const order = await c.req.json<Order>();
  if (order.products.some((p) => p.sku === GOD_MODE_SKU)) {
    const livesKey = `${order.userId}:lives`;
    await redis.incrBy(livesKey, -1);
  }
  return c.json<PaymentHandlerResponse>({ success: true });
});
```

## Payments help

When you enable payments, a **Get Payments Help** menu item is automatically added to the three dot menu in your app. This connects the user to [Reddit Help](https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=29770197409428) for assistance.
