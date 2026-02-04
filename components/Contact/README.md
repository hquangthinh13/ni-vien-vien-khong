# Contact Page Service

Service for fetching contact page data from the Strapi backend.

## Available Functions

### 1. `fetchContactPage(options)`

Fetch the complete contact page with all fields and relations.

**Parameters:**

- `options.locale` - Language locale (e.g., 'en', 'vi')
- `options.populate` - Relations to populate (default: '\*')
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ContactPageResponse>`

**Example:**

```ts
const contactPage = await fetchContactPage({
  locale: "vi",
  populate: "*",
});
```

---

### 2. `fetchContactPageFields(options)`

Fetch specific fields from the contact page.

**Parameters:**

- `options.locale` - Language locale (required)
- `options.fields` - Array of field names to fetch (required)
- `options.populate` - Relations to populate
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ContactPageResponse>`

**Example:**

```ts
const contactInfo = await fetchContactPageFields({
  locale: "vi",
  fields: ["address", "phoneNumber", "emailPrimary"],
});
```

---

## Response Format

Both functions return a `ContactPageResponse`:

```ts
{
  data: ContactPageAttributes | null,
  meta?: {
    // metadata from Strapi
  }
}
```

**ContactPageAttributes includes:**

- `address` - Contact address
- `phoneNumber` - Primary phone number
- `emailPrimary` - Primary email address
- `emailSecondary` - Secondary email address (optional)
- And other contact-related fields

---

## Testing

See [scripts/test-contact-page.ts](../../scripts/test-contact-page.ts) for comprehensive examples.

Run the test script:

```bash
npm run test:contact
```

Test with specific locale:

```bash
npm run test:contact vi
npm run test:contact en
```

---

## Error Handling

All functions throw errors if the API request fails:

```ts
try {
  const contactPage = await fetchContactPage({ locale: "vi" });
} catch (error) {
  console.error("Failed to fetch contact page:", error.message);
}
```

---

## Notes

- Authorization requires `STRAPI_API_TOKEN` or `NEXT_PUBLIC_STRAPI_API_TOKEN` env variable
- Default locale is 'vi' if not specified in test script
- Use `fetchContactPageFields` when you only need specific contact information for performance optimization
- Both functions support all Strapi query parameters through the flexible `buildQuery` function
