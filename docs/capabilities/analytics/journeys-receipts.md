# Journeys Receipts

The Devvit Journeys API responses include a **receipt**: a small feedback object that tells you what happened to a telemetry event.

This is not end-user messaging. It's implementation feedback so you can tell whether a Journey event was recorded, skipped, rejected, rate limited, or could not be confirmed.

## Viewing receipts

Every Journey telemetry call now returns a receipt.

`startJourney()` returns:

```ts
{
  journeyId: string,
  receipt: {
    status: string,
    message: string
  }
}
```

Other Journey calls return:

```ts
{
  receipt: {
    status: string,
    message: string
  }
}
```

Covered calls:

- Start Journey
- Journey Progress
- Journey Interaction
- End Journey
- App Ready

## Receipt fields

`status` is the machine-readable outcome. Use this for branching, tests, or tooling.

`message` is the human-readable diagnostic. You can log it or display it during implementation/debugging.

Devvit Journeys is generally available, so apps do not need to request individual allowlist enrollment as part of normal setup. The server may still return a denied receipt when a server-side rollout or exclusion control applies.

## Upgrade note for existing devs

`startJourney()` changed from returning only the Journey ID information to returning the Journey ID plus a receipt. If you’re upgrading existing code, you may need to update any custom response types, mocks, or destructuring assumptions so they account for the new `receipt` field.

For example, code that only typed the response as `{ journeyId: string }` should now expect:

```ts
{
  journeyId: string,
  receipt: {
    status: string,
    message: string
  }
}
```

## Possible receipt outcomes

| Status                                   | Meaning                                                                                      | Current Message                                                  |
| :--------------------------------------- | :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `JOURNEY_RECEIPT_VALID`                  | Event was accepted and recorded.                                                             | `Success: Event was recorded.`                                   |
| `JOURNEY_RECEIPT_DENIED_NOT_ALLOWLISTED` | Event was valid, but Journey telemetry was not enabled for the app by a server-side control. | `Denied: Your app is not allowlisted for Journey telemetry yet.` |
| `JOURNEY_RECEIPT_DENIED_RATE_LIMITED`    | Event was valid, but skipped because the app sent too many events.                           | `Denied: Event was rate limited.`                                |
| `JOURNEY_RECEIPT_DENIED_DUPLICATE`       | Event was valid, but skipped because it was already recorded.                                | `Denied: Event was already recorded.`                            |
| `JOURNEY_RECEIPT_INVALID`                | Event payload was invalid and was not recorded.                                              | `Invalid: Event payload was not recorded.`                       |
| `JOURNEY_RECEIPT_UNSPECIFIED`            | Recording status could not be confirmed.                                                     | `Unknown: Telemetry recording status could not be confirmed.`    |

Example:

```javascript
{
    "journeyId": "f7ece033-0247-407c-aede-8b65c7fd645c",
    "receipt": {
        "status": "JOURNEY_RECEIPT_DENIED_NOT_ALLOWLISTED",
        "message": "Denied: Your app is not allowlisted for Journey telemetry yet."
    }
}
```

This receipt indicates that a server-side control prevented the event from being recorded. If you receive it unexpectedly, contact the Devvit team. After the control is removed, the dev sees:

```javascript
{
    "journeyId": "f7ece033-0247-407c-aede-8b65c7fd645c",
    "receipt": {
        "status": "JOURNEY_RECEIPT_VALID",
        "message": "Success: Event was recorded."
    }
}
```

## Important notes

A successful API response does not always mean the event was recorded. The receipt is the source of truth for the telemetry outcome.

Denied receipts are still useful: they tell developers the SDK call worked, but the telemetry event was intentionally not ingested.

If the client reuses an already-active Journey, it returns:

```
Already started: Reusing the active Journey; no new start event was recorded.
```

This means no new start event was sent because the client already has an active Journey session.
