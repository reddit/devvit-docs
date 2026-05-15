# HTTP Fetch

Make requests to allow-listed external domains.

Your Devvit app can make network requests to access allow-listed external domains using HTTP Fetch. This enables your app to leverage webhooks, personal servers, and other third-party integrations asynchronously across the network.

## Enabling HTTP fetch calls

devvit.json

```

{
 ...
 "permissions": {
   "http": {
     "enable": true,
     "domains": ["my-site.com", "another-domain.net"]
   }
 }
}
```

### Requesting a domain to be allow-listed

Apps may request a domain to be added to the allow-list by specifying domains in the http configuration. This configuration is optional, and apps can still configure http: true as before.

Requested domains will be submitted for review when you playtest or upload your app. Admins may approve or deny domain requests.

Domain entries must be exact hostnames only, such as nytimes.com or wikipedia.org. These fetch requests are not allowed:

* Be specific. No using \*.example.com when you need api.example.com  
* No wildcards: \*.example.com  
* No protocols: https://api.example.com  
* No paths: api.example.com/webhooks

Domains that are approved for your app will be displayed in the Developer Settings section for your app at https://developers.reddit.com/apps/{your-app-slug}/developer-settings. These domains are allow-listed for **your app only** and not globally.

Apps must request each individual domain that it intends to fetch, even if the domain is already globally allowed. See the [global fetch allowlist](https://developers.reddit.com/docs/capabilities/server/http-fetch#global-fetch-allowlist) to view the list of globally allowed domains.

## Limitations

* Access is only allowed to https URIs.  
* Supported HTTP methods: GET, POST, PUT, DELETE, OPTIONS and PATCH.  
* HTTP timeout limit is 30 seconds.

## Example usage

Devvit Web applications have two different contexts for using fetch:

### Server-side fetch

Server-side fetch allows your app to make HTTP requests to allowlisted external domains from your server-side code (e.g., API routes, server actions):

server/index.ts

```

const response = await fetch('https://example.com/api/data', {
 method: 'GET',
 headers: {
   'Content-Type': 'application/json',
 },
});

const data = await response.json();
console.log('External API response:', data);
```

### Client-side fetch

Client-side fetch has different restrictions and can only make requests to your own webview domain:

**Client-side restrictions:**

* **Domain limitation**: Can only make requests to your own webview domain  
* **Endpoint requirement**: All requests must target endpoints that end with /api  
* **Authentication**: Handled automatically \- no need to manage auth tokens  
* **No external domains**: Cannot make requests to external domains from client-side code  
  client/index.ts

```

const handleFetchData = async () => {
 // Correct: fetching your own webview's API endpoint
 const response = await fetch("/api/user-data", {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
   },
 });

 const data = await response.json();
 console.log("API response:", data);
};

// Incorrect: cannot fetch external domains from client-side
// const response = await fetch('https://external-api.com/data');

// Incorrect: endpoint must end with /api
// const response = await fetch('/user-data');
```

## Troubleshooting

The following error means HTTP Fetch requests are hitting the internal timeout limits. To resolve this:

* Use a queue or kick off an async request in your back end. You can use [Scheduler](https://developers.reddit.com/docs/capabilities/server/scheduler) to monitor the result.  
* Optimize the overall HTTP request latency if you have a self-hosted server.

```

HTTP request to domain: <domain> timed out with error: context deadline exceeded.
```

## Global fetch allowlist

These domains are globally allowed and can be fetched by any app. Expand to see full list.

* api.massive.com  
* api.nasa.gov  
* api.openai.com  
* api.petfinder.com  
* api.polygon.io  
* api.scryfall.com  
* api.sportradar.com  
* api.sportradar.us  
* api.telegram.org  
* api.twitter.com  
* api.weather.gov  
* cdn.espn.com  
* chessboardjs.com  
* commentanalyzer.googleapis.com  
* discord.com  
* example.com  
* finance.yahoo.com  
* fonts.googleapis.com  
* generativelanguage.googleapis.com  
* i.giphy.com  
* language.googleapis.com  
* lichess.org  
* npr.org  
* nytimes.com  
* pbs.org  
* polygon.io  
* propublica.org  
* random.org  
* site.api.espn.com  
* slack.com  
* statsapi.mlb.com  
* wikipedia.org  
* youtube.googleapis.com

## HTTP Fetch Policy

Allow-listed domains fall into three categories:

1. **APIs that provide data or specific services** (e.g., api.openai.com, api.wikipedia.org) \- These will be approved if they have a **publicly documented and publicly accessible API** for valid use cases, and if they adhere to the Devvit rules. Please reference our AI providers and account linking policies for common invalid use cases.  
2. **Limited scope cloud providers** (e.g., username.supabase.com, my-app.firebase.com) \- May be granted with exceptions. You must:  
   * Follow user privacy guidelines and data governance requirements  
   * Use an approved provider from the list below (please include your subdomain, and request for the most granular domain possible, e.g. my-app.s3.amazonaws.com)  
     * supabase.com  
     * firebase.com  
     * spacetimedb.com  
     * s3.amazonaws.com  
     * storage.googleapis.com  
   * Demonstrate a capability that @devvit/server doesn't support  
   * Valid use cases include:  
     * Asset hosting (videos, images, music)  
     * Relational databases  
   * Note: Approval can be revoked at any time  
3. **Personal domains** (e.g., personaldomain.com) \- Will not be approved. If you have a use case that our Devvit server does not support, please submit your request with detailed justification.

### AI providers

At this time, the OpenAI and Google Gemini are the only allowed providers:

* api.openai.com  
* generativelanguage.googleapis.com

Requests to use any other AI provider will be denied.

### Documentation requirements

If your app uses fetch domains, you must add context to your app's README for the approval process:

1. Create a "Fetch Domains" section in your README  
2. List each domain you're requesting and explain why you need it  
3. Ensure your usage complies with our fetch guidelines

Example README section:

```

## Fetch Domains

The following domains are requested for this app:

- `api.wikipedia.org` - Used to fetch article summaries for the knowledge base feature
- `username.supabase.com` - Required for relational database storage of user preferences (Devvit KV store doesn't support complex queries needed for this feature)
```

### Domain requirements

Domain entries must be exact hostnames only, such as nytimes.com or wikipedia.org. In addition:

* Be specific. No using \*.example.com when you need api.example.com  
* No wildcards: \*.example.com  
* No protocols: https://api.example.com  
* No paths: api.example.com/webhooks

Domains that are approved for your app are displayed in the \[Developer Settings\](https://developers.reddit.com/apps/{your-app-slug}/developer-settings) section for your app. These domains are allow-listed for **your app only** and not globally.

Apps must request each individual domain that it intends to fetch, even if the domain is already globally allowed. See the [global fetch allowlist](https://developers.reddit.com/docs/capabilities/server/http-fetch-policy#global-fetch-allowlist) to view the list of globally allowed domains.

### Terms and conditions

Any app that uses fetch must upload Terms and Conditions and a Privacy Policy. Links to each of these documents must be saved in the app details form.
