# Export data

Export TaskFlow data for backups, reporting, or migration.

## Export a project

To export one project:

1. Open the project.
2. Click the **Project menu** (⋯).
3. Choose **Export**.
4. Select **CSV** or **JSON**.
5. Click **Download**.

Exports include tasks, assignees, due dates, and custom fields defined on that project.

## Export the whole workspace

Workspace **Owners** and **Admins** can export all projects:

1. Go to **Settings → Workspace**.
2. Click **Export workspace data**.
3. Choose **CSV** or **JSON**.
4. TaskFlow emails a download link when the export is ready (usually within 15 minutes).

Exports expire after 7 days.

## API rate limits

Programmatic exports through the TaskFlow API are limited to **60 requests per minute** per API token. Burst traffic above that limit receives HTTP 429 responses.
