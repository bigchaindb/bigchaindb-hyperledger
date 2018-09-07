# Bdb-Hyperledger-Oracle API Spec

## Post Oracle Query

Takes an asset id and a callback as input. Fetches th respective asset from BigchainDB. Then runs the callback with asset.data as an input.

**Endpoint:** POST `/oraclequery`

**Input Parameters:**

```json
{
    "query": "<assetId>",
    "callback": "<callback code>"
}
```

**Success Return Value:**

If the input is valid, then an `Accepted` status code is returned. The query and callback will continue execution.

```code
202 HTTP status response
```

**Error Return Value:**

If the input is **not** valid, then an `Bad Request` status code is returned.

```code
400 HTTP status response
```