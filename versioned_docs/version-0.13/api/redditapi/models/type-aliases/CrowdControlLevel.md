[**@devvit/public-api v0.13.9-dev**](../../README.md)

***

# Type Alias: CrowdControlLevel

> **CrowdControlLevel** = `"OFF"` \| `"LENIENT"` \| `"MEDIUM"` \| `"STRICT"`

Crowd control level for posts. Determines which comments should be collapsed due to crowd control.
OFF: Anyone with a Reddit account can comment freely.
LENIENT: Collapse comments from people who have negative karma in your community.
MEDIUM: Collapse comments from new Reddit users and people with negative karma in your community.
STRICT: Collapse comments from people who haven’t joined your community, new Reddit users, and people with negative karma in your community
