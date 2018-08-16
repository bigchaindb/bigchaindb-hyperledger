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

```code
200 HTTP status response
```

**Error Return Value:**

```code
400 HTTP status response
```