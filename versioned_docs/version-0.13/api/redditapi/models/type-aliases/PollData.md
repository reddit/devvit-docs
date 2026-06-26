[**@devvit/public-api v0.13.6-dev**](../../README.md)

***

# Type Alias: PollData

> **PollData** = `object`

Aggregated poll data for a poll post.

## Properties

<a id="options"></a>

### options

> **options**: [`PollOption`](PollOption.md)[]

Options in the poll.

***

<a id="totalvotecount"></a>

### totalVoteCount

> **totalVoteCount**: `number`

Total number of votes cast in the poll. Aggregated across all PollOption objects.

***

<a id="votingendtimestamp"></a>

### votingEndTimestamp

> **votingEndTimestamp**: `number`

Time the poll voting closes, in Unix milliseconds.
