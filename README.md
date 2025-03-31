# Secure Multisig Checklist

A checklist for setting up and maintaining secure multisignature wallets, with adaptive recommendations based on different threat profiles.

## Features

- Checklist items categorized by setup, security, transaction verification, and emergency preparedness with progress tracking for each section and overall completion
- Threat profile selector to adapt recommendations based on value at risk or role
- Conditional display of security requirements based on selected threat profile
- Report sharing capability
- Print reports for offline use

## Development

### Requirements

node.js
npm

### Basic Setup

```bash
# Install the necessary dependencies
npm i

# Start the development server with auto-reloading
npm run dev
```

### Result sharing / Progress Saving

By enabling [supabase](https://supabase.com/) (open source, self-hosted or hosted platform), storing and sharing results is possible.
If you do not enable supabase, then report sharing is not available on the nav menu.

#### Setup supabase

You can [self-host](https://github.com/supabase/supabase) supabase, or run it on their hosted platform.
To run it on the hosted platform, create an account and project on supabase; free tier is likely sufficient.

1. Go to Project Settings > API
2. Copy your "Project URL" (this is your `VITE_SUPABASE_URL`)
3. Copy your "anon public" key (this is your `VITE_SUPABASE_ANON_KEY`)

#### Google sign-in

In order to reduce the risk of spam, authentication via google or github sign-in is required to store results.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set up the OAuth consent screen if prompted
6. Select "Web application" as the application type
7. Add authorized JavaScript origins:
   - `https://your-project-ref.supabase.co` (your unique Supabase URL)
   - `http://localhost:8080` (local development)
   - `https://howtomultisig.com` (production URL)
8. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback` (your unique Supabase URL)
   - `http://localhost:8080/auth/v1/callback` (local development)
   - `https://howtomultisig.com/auth/v1/callback` (production URL)
9. Click "Create" and copy your Client ID and Client Secret

#### Github sign-in

In order to reduce the risk of spam, authentication via google or github sign-in is required to store results.

1. Go to [OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth app
3. Set the Authorization callback URL to `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy your Client ID and Client Secret

##### Enable Google sign-in in supabase

1. In your supabase project dashboard, go to Authentication > Providers
2. Locate Google and click "Enable"
3. Enter the Client ID and Client Secret from Google Cloud Console
4. Save the changes

##### Enable Github sign-in in supabase

1. In your supabase project dashboard, go to Authentication > Providers
2. Locate Github and click "Enable"
3. Enter the Client ID and Client Secret from Github
4. Save the changes

##### Create the required tables in supabase

Click on SQL Editor in your supabase project, and run the following SQLs after verifying that it looks good.

To create the tables required for sharing results at a point in time, run this SQL query which will setup the necessary tables and add Row Level Security which requires a user to have signed-in via google to store the report.

```sql
-- Create multisig_reports table
CREATE TABLE multisig_reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  completeditems JSONB NOT NULL,
  profile TEXT NOT NULL,
  reviewer TEXT,
  transaction_hash TEXT,
  checklist_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  -- Total row size constraint: 5KB (5120 bytes)
  CONSTRAINT multisig_row_size_limit CHECK (
    octet_length(id) +
    octet_length(name) +
    octet_length(completeditems::text) +
    octet_length(profile) +
    octet_length(COALESCE(reviewer, '')) +
    octet_length(COALESCE(transaction_hash, '')) +
    octet_length(COALESCE(checklist_version, '')) <= 5120
  )
);

-- Enable Row Level Security
ALTER TABLE multisig_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous reads
CREATE POLICY allow_anonymous_reads
  ON multisig_reports
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated inserts
CREATE POLICY allow_authenticated_inserts
  ON multisig_reports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy to disallow updates and deletes
CREATE POLICY deny_updates
  ON multisig_reports
  FOR UPDATE
  USING (false);

CREATE POLICY deny_deletes
  ON multisig_reports
  FOR DELETE
  USING (false);
```

To create the table required for storing user progress if a user signs in, run this SQL query which will setup the table and add Row Level Security to ensure only the signed in user can insert, update, and read their own data.

```sql
CREATE TABLE user_checklists (
  user_id UUID PRIMARY KEY,
  completeditems TEXT[] DEFAULT '{}',
  profile TEXT DEFAULT 'large',
  checklist_version TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  -- Total row size constraint: 5KB (5120 bytes)
  CONSTRAINT user_checklist_row_size_limit CHECK (
    octet_length(array_to_string(completeditems, ',')) +
    octet_length(profile) +
    octet_length(COALESCE(checklist_version, '')) <= 5120
  )
);

-- Set up Row Level Security
ALTER TABLE user_checklists ENABLE ROW LEVEL SECURITY;

-- Allow users to modify only their own data
CREATE POLICY "allow_user_to_read" 
  ON user_checklists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "allow_user_to_insert" 
  ON user_checklists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_user_to_update" 
  ON user_checklists FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "allow_user_to_delete"
  ON user_checklists FOR DELETE
  USING (auth.uid() = user_id);
```

##### Local development

1. Create a `.env` file in the project root based on `.env.example`
2. Add your supabase URL and anon key to the `.env` file

```bash
# Example .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

##### Production

You could deploy this on a self-hosted [Coolify](https://github.com/coollabsio/coolify), a VPS, or on something like Vercel.
The environment variables in your project settings should be set to:

- `VITE_SUPABASE_URL`: supabase project URL
- `VITE_SUPABASE_ANON_KEY`: supabase anon key


## Adding a New Checklist Version

When making significant changes to the checklist items, it's important to increment the version number to maintain backward compatibility with shared checklists. Follow these steps to create a new version:

1. **Update Version Information in `src/lib/checklistData.ts`**:
   ```typescript
   // Add a new version definition
   const version_x_y_z: ChecklistVersion = {
     version: "x.y.z",  // Follow semantic versioning
     releaseDate: "YYYY-MM-DD",
     changes: [
       "Description of change 1",
       "Description of change 2",
       // ...
     ]
   };

   // Update the version history array to include the new version
   export const versionHistory: ChecklistVersion[] = [
     version_1_0_0,
     // ... previous versions
     version_x_y_z  // Add the new version here
   ];

   // Set the current version to the new version
   export const currentVersion: ChecklistVersion = version_x_y_z;
   ```

2. **When Modifying Checklist Items**:
   - For new items, add `addedInVersion: "x.y.z"` to track when items were introduced
   - For updated items, add `modifiedInVersion: "x.y.z"` to indicate changes
   - For removed items, add `removedInVersion: "x.y.z"` instead of deleting them to maintain compatibility with older reports

3. **Update Documentation**:
   Add notes to the changelog in your release documentation highlighting the main changes in the new version.

### Example: How Version Tracking Works

When a user shares a report, the current version is stored with that report. When someone views a shared report from version 1.0.0, they'll see the checklist as it existed in that version, even if the current version is 2.0.0. This ensures that reports maintain their accurate history, while checklists can evolve with new security practices.

## License

[MIT](LICENSE)
