# ARASAAC API quick summary

This folder contains scripts related to ARASAAC data retrieval.

## Developers API overview (focused)

ARASAAC provides a public HTTP API for pictograms and related resources.

- Base API used here: `https://api.arasaac.org/v1`
- Endpoint used by this project: `GET /pictograms/all/fr`
- Full URL: `https://api.arasaac.org/v1/pictograms/all/fr`

This endpoint returns pictogram data with French labels/metadata in JSON.
The fetch script in this folder writes the response body as-is (raw) into `picto_fr.json`.

## Usage

Run from repository root:

```bash
node scripts/arasaac/fetch-pictograms-fr.mjs
```

Output file:

- `scripts/arasaac/picto_fr.json`

## Notes

- Requires internet access when fetching.
- Use the API responsibly to avoid unnecessary traffic.
- Official documentation:
  - https://arasaac.org/developers/api
