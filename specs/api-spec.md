# Bdb-Hyperledger-Oracle API Spec

### 1. Post Oracle Querry

Creates a company asset in the platform and returns assetId of company transaction. Asset is owned by publicKey sent in with other data on company creation.

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