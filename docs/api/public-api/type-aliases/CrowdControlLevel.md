[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Type Alias: CrowdControlLevel

> **CrowdControlLevel** = `"OFF"` \| `"LENIENT"` \| `"MEDIUM"` \| `"STRICT"`

Crowd Control threshold for comments on a post. Determines which comments
should be collapsed by default.

OFF: Do not collapse or filter comments through Crowd Control.
LENIENT: Collapse or filter comments from accounts with negative community
         karma.
MEDIUM: LENIENT but also applies to new accounts.
STRICT: MEDIUM but applies to accounts that have not joined the community.
