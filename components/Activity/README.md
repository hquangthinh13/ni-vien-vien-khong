# Activity Service

Service for fetching activity/event data from the Strapi backend.

## Available Functions

### 1. `fetchActivities(options)`

Fetch all activities with optional filtering, pagination, and sorting.

**Parameters:**

- `options.locale` - Language locale (e.g., 'en', 'vi')
- `options.populate` - Relations to populate (default: '\*')
- `options.fields` - Specific fields to fetch
- `options.pagination` - `{ page: number, pageSize: number }`
- `options.sort` - Sort string (e.g., 'activityDate:desc')
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ActivityResponse>`

**Example:**

```ts
const activities = await fetchActivities({
  locale: "vi",
  pagination: { page: 1, pageSize: 10 },
  sort: "activityDate:desc",
});
```

---

### 2. `fetchActivityByDocumentId(options)`

Fetch a single activity by its document ID.

**Parameters:**

- `options.documentId` - The activity's document ID (required)
- `options.locale` - Language locale
- `options.populate` - Relations to populate (default: '\*')
- `options.fields` - Specific fields to fetch
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ActivityResponse>`

**Example:**

```ts
const activity = await fetchActivityByDocumentId({
  documentId: "lgv3gu7ccx3u7dpwwn5zhqh4",
  locale: "vi",
});
```

---

### 3. `fetchNearestActivity(options)`

Fetch the nearest upcoming activity from a reference date (default: today).

**Parameters:**

- `options.locale` - Language locale
- `options.populate` - Relations to populate (default: '\*')
- `options.fields` - Specific fields to fetch
- `options.referenceDate` - ISO date string (default: today)
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ActivityResponse>`

**Example:**

```ts
const nextActivity = await fetchNearestActivity({
  locale: "vi",
  populate: "*",
});
```

---

### 4. `fetchActivitiesByMonth(options)`

Fetch all activities within a specific month.

**Parameters:**

- `options.year` - Year (e.g., 2025)
- `options.month` - Month 1-12 (e.g., 2 for February)
- `options.locale` - Language locale
- `options.populate` - Relations to populate
- `options.fields` - Specific fields to fetch
- `options.pagination` - `{ page: number, pageSize: number }`
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ActivityResponse>`

**Example:**

```ts
const febActivities = await fetchActivitiesByMonth({
  year: 2025,
  month: 2,
  locale: "vi",
  pagination: { page: 1, pageSize: 10 },
});
```

---

### 5. `fetchActivitiesByCategory(options)`

Fetch activities filtered by a specific category.

**Parameters:**

- `options.category` - Activity category (required)
- `options.locale` - Language locale
- `options.populate` - Relations to populate
- `options.fields` - Specific fields to fetch
- `options.pagination` - `{ page: number, pageSize: number }`
- `options.signal` - AbortSignal for request cancellation

**Returns:** `Promise<ActivityResponse>`

**Example:**

```ts
const buddhismActivities = await fetchActivitiesByCategory({
  category: "Phật Sự Trong Nước",
  locale: "vi",
  pagination: { page: 1, pageSize: 10 },
});
```

---

## Response Format

All functions return an `ActivityResponse`:

```ts
{
  data: Activity[] | Activity | null,
  meta?: {
    pagination?: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number
    }
  }
}
```

---

## Testing

See [scripts/test-activity-service.ts](../../scripts/test-activity-service.ts) for comprehensive examples.

Run the test script:

```bash
npm run test:activity
```

Test with specific parameters:

```bash
npm run test:activity vi [documentId] [category]
```

**Examples:**

```bash
# Test with Vietnamese locale
npm run test:activity vi

# Test with specific document ID
npm run test:activity vi lgv3gu7ccx3u7dpwwn5zhqh4

# Test with specific category
npm run test:activity vi lgv3gu7ccx3u7dpwwn5zhqh4 "Phật Sự Trong Nước"
```

---

## Error Handling

All functions throw errors if the API request fails:

```ts
try {
  const activities = await fetchActivities({ locale: "vi" });
} catch (error) {
  console.error("Failed to fetch activities:", error.message);
}
```

---

## Notes

- All date strings use ISO 8601 format (YYYY-MM-DD)
- Month parameter is 1-based (1 = January, 12 = December)
- Authorization requires `STRAPI_API_TOKEN` or `NEXT_PUBLIC_STRAPI_API_TOKEN` env variable
- Support all Strapi query parameters through the flexible `buildQuery` function
