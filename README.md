# redis-visitor-cache
An express server communicating with redis-client that returns the last 20 visits to an API

### API
---

Have 2 routes
> api/people/:id
1) Check if the user has a cache entry in redis. If so, render the result from that cache entry
2) If not, query the data module for the person and fail the request if they are not found, or send JSON and cache the result if they are found.

> api/people/history

This route will respond with an array of the last 20 users in the cache from the recently viewed list. You can have duplicate users in your 20 user list.
