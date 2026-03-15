# Support this app

You can ask users to contribute to your app’s development by adding the “support this app” feature. This allows users to support your app with Reddit Gold in exchange for some kind of award or recognition.

## Requirements

1. You must give something in return to users who support your app. This could be unique custom user flair, an honorable mention in a thank you post, or another creative way to show your appreciation.
2. The “Support this App” purchase button must meet the Developer Platform’s [design guidelines](./payments_add.mdx#design-guidelines).

## How to integrate app support

### Create the product

Use the Devvit CLI to generate the [product configuration](./payments_add.mdx#register-products).

```tsx
devvit products add support-app
```

### Add a payment handler

In Devvit Web, the [payment handler](./payments_add.mdx#complete-the-payment-flow) is your server’s **fulfill** endpoint. That’s where you award the promised incentive (e.g. custom user flair). Implement it in your server and reference it in `devvit.json` under `payments.endpoints.fulfillOrder`.

Example: award custom user flair when a user completes a support purchase:

```tsx title="server/index.ts"
import type { PaymentHandlerResponse, Order } from "@devvit/web/server";
import { reddit } from "@devvit/web/server";

app.post("/internal/payments/fulfill", async (c) => {
  const order = await c.req.json<Order>();
  const username = order.userId; // or the username field on the order
  if (!username) {
    return c.json<PaymentHandlerResponse>({ success: false, reason: "User not found" });
  }

  const subredditName = order.subredditName ?? order.subredditId;

  await reddit.setUserFlair({
    text: "Super Duper User",
    subredditName,
    username,
    backgroundColor: "#ffbea6",
    textColor: "dark",
  });

  return c.json<PaymentHandlerResponse>({ success: true });
});
```

### Initiate purchases

Provide a way for users to support your app from your client:

- **Devvit Web:** Add a button or link that calls `purchase("support-app")` from `@devvit/web/client`. Handle the result (e.g. show a toast on success). Optionally fetch product info from your `/api/products` endpoint to display the support option.
- Follow the [design guidelines](./payments_add.mdx#design-guidelines) when [initiating purchases](./payments_add.mdx#initiate-orders).

![Support App Example](../../assets/support_this_app.png)

Example client code:

```tsx title="client/index.ts"
import { purchase, OrderResultStatus } from "@devvit/web/client";

<<<<<<< HEAD
// addCustomPostType() is deprecated and will be unsupported. It will not work after June 30. View the announcement below this example.
Devvit.addCustomPostType({
  render: (context) => {
    const { products } = useProducts(context);
    const payments = usePayments((result: OnPurchaseResult) => {
      if (result.status === OrderResultStatus.Success) {
        context.ui.showToast({
          appearance: 'success',
          text: 'Thanks for your support!',
        });
      } else {
        context.ui.showToast(
          `Purchase failed! Please try again.`
        );
      }
    });
   const supportProduct = products.find(products.find((p) => p.sku === 'support-app');
   return (
     <ProductButton
       product={supportProduct}
       onPress={(p) => payments.purchase(p.sku)}
     />
   );
})
=======
async function handleSupportApp() {
  const result = await purchase("support-app");
  if (result.status === OrderResultStatus.STATUS_SUCCESS) {
    // show success, e.g. toast: "Thanks for your support!"
  } else {
    // show error or retry (result.errorMessage may be set)
  }
}
>>>>>>> 64da331 (DR-370 update payments docs referencing Ddevvit singleton)
```
[View `addCustomPostType` deprecation announcement.](https://www.reddit.com/r/Devvit/comments/1r3xcm2/devvit_web_and_the_future_of_devvit/)

## Example

At [r/BirbGame](https://www.reddit.com/r/BirbGame/), they created the Birb Club. Members can join the club and get exclusive flair to support the app.

![Birb gif](../../assets/support_birbclub.gif)

![Birb flair](../../assets/support_birbclub_flair.png)
