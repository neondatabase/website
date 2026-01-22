---
title: Using Neon Postgres with Zapier
subtitle: Automate workflows by connecting Neon Postgres to hundreds of apps with Zapier, triggering actions from database events or pushing data into Neon from other services.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-29T00:00:00.000Z'
updatedOn: '2025-05-29T00:00:00.000Z'
---

Zapier is a powerful no-code automation platform that allows you to connect Neon Postgres to thousands of other web services. By linking your Neon database with apps like Slack, Google Sheets, Gmail, Stripe, or Typeform, you can automate actions based on database events (e.g., a new row is added) or push data into Neon from these external systems.

This guide will walk you through setting up two common automation scenarios:

1.  Triggering an action when a new row is added to a table.
2.  Adding data to a table based on an event in an external service.

These examples will illustrate the core concepts, which you can then adapt to a wide variety of other use cases.

## Prerequisites

Before you begin, ensure you have the following:

- **Zapier Account:** A Zapier account is required to create and manage Zaps. Please note that the PostgreSQL integration is a Pro feature on Zapier and requires a [paid plan](https://zapier.com/pricing).

* **Neon Account and Project:** A Neon account and a project with a running Postgres database. You can create a free Neon account and project at [pg.new](https://pg.new).
* **Database tables (for examples):** For the examples in this guide, we'll be using the following tables to demonstrate the functionality. Create these tables in your Neon database if you intend to follow along:
  - A table named `users` to demonstrate triggering actions from new rows.
  - A table named `form_submissions` to demonstrate adding data from an external source.

    You can create these tables using the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or any Postgres client such as [`psql`](/docs/connect/query-with-psql-editor)

    **Example SQL for `users` table:**

        ```sql
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ```

    **Example SQL for `form_submissions` table:**

        ```sql
        CREATE TABLE form_submissions (
            id SERIAL PRIMARY KEY,
            submitter_email VARCHAR(255),
            feedback_text TEXT,
            submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ```

<Admonition type="important">
For Zapier's "New Row" trigger to reliably detect new entries in Neon, your table should have an auto-incrementing `PRIMARY KEY` (like `SERIAL` or `BIGSERIAL`) or a column that strictly orders new rows (like a `created_at` timestamp). Zapier uses this "Ordering Column" to check for new entries.
</Admonition>

## Connecting Neon Postgres to Zapier

Before creating Zaps, you need to connect your Neon database to Zapier. Zapier uses a generic "PostgreSQL" app integration. Due to how [Neon uses Server Name Indication (SNI) for routing connections](/docs/connect/connection-errors#the-endpoint-id-is-not-specified) and how some clients handle SNI, a specific format is required for the password field in Zapier to ensure a successful connection.

1.  **Log in to Zapier.**
2.  Navigate to "**App Connections**" from the left sidebar.
    ![App Connections in Zapier](/docs/guides/zapier-app-connections.png)
3.  Click "**Add connection**" and search for "**PostgreSQL**".
    ![Add connection page in Zapier](/docs/guides/zapier-add-connection.png)
4.  A pop-up window will appear asking for connection details. You can find most of these in your Neon Console on the **Dashboard** page, by clicking on the **Connect** button for your database. Fill in the following fields:
    - **Host:** Your Neon host (e.g., `ep-tight-boat-a6aplura-pooler.us-west-2.aws.neon.tech`)
    - **Port:** `5432`
    - **Database:** Your Neon database name (e.g., `neondb`)
    - **Username:** Your Neon database user (e.g., `neon_user`)
    - **Password:** **This is where the special format is needed.** See the important note below.

    <Admonition type="important" title="Password Format for Neon Postgres in Zapier">
    To connect Zapier to Neon successfully, you must include your Neon **Endpoint ID** within the password field. This is because Neon uses SNI to route connections, and some clients like Zapier's PostgreSQL connector do not pass SNI information in a way that Neon can use directly without this workaround.
    1.  Find your **Endpoint ID**. It's the first part of your Neon hostname (e.g., if your host is `ep-tight-boat-a6aplura-pooler.us-west-2.aws.neon.tech`, your endpoint ID is `ep-tight-boat-a6aplura`).
    2.  In Zapier's **Password** field, enter the following string, replacing `[endpoint_id]` with your actual endpoint ID and `[your_actual_password]` with your database user's password:

        `endpoint=[endpoint_id]$[your_actual_password]`

    **Example:** If your endpoint ID is `ep-tight-boat-a6aplura` and your password is `MySecurePassword`, you would enter:

    `endpoint=ep-tight-boat-a6aplura$MySecurePassword`

    This format allows Zapier to connect to your Neon database while adhering to the SNI requirements.
    </Admonition>

    <Admonition type="important" title="Security Best Practice">
    It is strongly recommend to create a dedicated database user/role in Neon specifically for Zapier. Grant this user only the minimum necessary permissions on the specific tables Zapier will interact with.
    </Admonition>

5.  After filling in all fields, including the specially formatted password, click "**Yes, Continue to PostgreSQL**". Zapier will test the connection.
6.  If the connection is successful, you should see **PostgreSQL** listed under your connected apps in Zapier. You can now use this connection in your Zaps.
    ![PostgreSQL connection in Zapier](/docs/guides/zapier-postgresql-connection.png)

## Use case 1: Notify on new Database entries

Let's create a Zap that sends a Slack message whenever a new user is added to `users` table in Neon.

### Step 1: Setting up the Trigger (new row in Neon)

1. Navigate to your Zapier dashboard and click "**Create > Zap**" to create a new Zap.
   ![Create Zap in Zapier](/docs/guides/zapier-create-zap.png)

2. **Trigger Setup:**
   - Search for and select "**PostgreSQL**" as the trigger app.
   - For "Event", choose "**New Row**".
   - For "Account", select the Neon PostgreSQL connection you configured earlier. Click "Continue".
     ![PostgreSQL trigger in Zapier](/docs/guides/zapier-postgresql-trigger.png)
   - You will be prompted to set up the trigger. Fill in your trigger details.
   - **Table:** Select or type the name of your table (e.g., `users`).
   - **Order By:** Select the column Zapier should use to find new rows. An auto-incrementing primary key like `id` or a timestamp like `signed_up_at` is ideal. `id` column is used in this example.
3. Click "**Continue**".
   ![PostgreSQL trigger setup in Zapier](/docs/guides/zapier-postgresql-trigger-setup.png)

4. Add sample data to your `users` table in Neon if you haven't already. Use the following SQL command in the Neon SQL Editor or any Postgres client to insert a sample user:

   ```sql
   INSERT INTO users (name, email) VALUES ('John Doe', 'john@doe.com');
   ```

5. **Test trigger:** Click "**Test trigger**". Zapier will attempt to find a recent row in your `users` table.
   You should see data from the row appear. Click "**Continue with selected record**".
   ![PostgreSQL trigger test in Zapier](/docs/guides/zapier-postgresql-trigger-test.png)

### Step 2: Setting up the Action (Send Slack message)

1.  **Action Setup:**
    - Search for and select "**Slack**" as the action app.
    - For "Event", choose "**Send Channel Message**".
    - **Connect Slack Account:** If you haven't already, connect your Slack account and grant Zapier permissions.
    - You will be prompted to set up the action. Fill in your action details.
    - **Channel:** Choose the Slack channel where you want to send notifications.
    - **Message Text:** Compose your message. You can insert data from the Neon trigger step.
    - You can use the "/" button to insert fields from the trigger data. For example, you might write:

      ```
      New user signed up: *{{name}}* ({{email}})
      ```

      This will dynamically insert the user's name and email from the Neon trigger data. Refer to the image below for an example.

      ![Slack action setup in Zapier](/docs/guides/zapier-slack-action-setup.png)

    - Configure other options like "Bot Name", "Bot Icon", etc., as desired.

2.  Click "**Continue**".
3.  **Test action:** Click "**Test step**". Zapier will send a sample message to your selected Slack channel using the data from the trigger test.
    ![Zapier message test in Slack](/docs/guides/zapier-slack-test-message.png)
4.  If the test is successful, click "**Publish Zap**".

Now, whenever a new row is added to your `users` table in Neon Postgres, a message will automatically be posted to your specified Slack channel.

<Admonition type="note" title="Trigger frequency">
Zapier uses a polling system for its "New Row" trigger, checking Postgres for new data every 2-15 minutes (depending on your Zapier plan), not in real-time. This means a new row added to Neon may take a few minutes to trigger your Zap and send the Slack message.
</Admonition>

## Use case 2: Log Form submissions into Neon

Let's create a Zap that adds a new row to our `form_submissions` table in Neon whenever a Google Form is submitted.

### Step 1: Setting up the Trigger (New Google Form response)

1.  In Zapier, click "**Create Zap**".
2.  Search for and select "**Google Forms**" as the trigger app.
3.  For "Trigger Event", choose "**New Form Response**". Click "Continue".
4.  **Connect Google Forms Account:** If you haven't already, connect your Google account and grant Zapier permissions.
5.  Select the Google Form you want to use.
6.  Click "**Continue**".
7.  Make a test submission in your Google Form to ensure there is data for Zapier to work with. You can do this by filling out the form and submitting it.
8.  **Test trigger:** Click "**Test trigger**". Zapier will attempt to find a recent form submission. Click "**Continue with selected record**".

### Step 2: Setting up the Action (Create row in Neon)

1.  **Action Setup:**
    - Search for and select "**PostgreSQL**" as the action app.
    - For "Event", choose "**New Row**". Click "Continue".
    - For "Account", select the Neon PostgreSQL connection you configured earlier. Click "Continue".
    - You will be prompted to set up the action. Fill in your action details.
    - **Table:** Select or type the name of your table (e.g., `form_submissions`).
    - **Map columns:** You will see a list of columns from your `form_submissions` table. For each column, you need to map the corresponding data from the Google Forms trigger.
      - For `submitter_email`, select the Google Forms field that collects the email (e.g., `{{Email}}`).
      - For `feedback_text`, select the Google Forms field for feedback (e.g., `{{Feedback}}`).
      - The `id` and `submitted_at` columns in our example `form_submissions` table have default values (SERIAL and CURRENT_TIMESTAMP respectively), so you can often leave them unmapped in Zapier, and Postgres will handle them. If your table structure requires them, map them accordingly.
        ![Google Forms to Neon mapping in Zapier](/docs/guides/zapier-google-forms-to-neon-mapping.png)
2.  Click "**Continue**".
3.  **Test action:** Click "**Test step**". Zapier will attempt to create a new row in your `form_submissions` table in Neon using the data from the Google Forms test.
4.  **Verify in Neon:** Check your `form_submissions` table in Neon to confirm the new row was added.
5.  If the test is successful and the data appears in Neon, click "**Publish Zap**".

Now, every time your Google Form is submitted, the data will be automatically logged into your Neon Postgres database.

## Expanding to other use cases

The two examples above demonstrate the fundamental patterns for integrating Neon with other services via Zapier:

1.  **Neon as a Trigger:** An event in your Neon database (like a new row or an updated row) initiates actions in other apps.
2.  **Neon as an Action:** An event in an external app (like a new email, a new Stripe payment, an Airtable update) results in data being created or updated in your Neon database.

You can adapt these patterns to automate a vast array of tasks. Here are some additional use cases you might consider:

- **Notify on new Database entries:** For example: Neon -> Email, Neon -> Discord.
- **Log Form submissions into Neon:** For example: Typeform -> Neon, JotForm -> Neon.
- **Update Google Sheets from Neon:**
  - Trigger: New/Updated Row in Neon.
  - Action: Create/Update Row in Google Sheets.
- **Sync Stripe payments or subscriptions:**
  - Trigger: New Stripe charge/subscription.
  - Action: Create row in Neon.
- **Send custom emails from data in Neon:**
  - Trigger: New/Updated Row in Neon (e.g., a user signs up).
  - Action: Create a personalized email using OpenAI and send it via Mailchip/Resend etc.

The process for building these Zaps will be very similar:

1.  Choose your **Trigger** app and event.
2.  Choose your **Action** app and event.
3.  Connect your app accounts.
4.  Configure the trigger and action, mapping data fields between the services.
5.  Test and publish your Zap.

## Troubleshooting

If you encounter issues connecting Neon to Zapier or if your Zaps involving Neon are not working as expected, consider the following:

- **Verify password format:** Ensure you are using the correct password format when connecting Neon to Zapier, which includes the `endpoint=[endpoint_id]$` prefix before your actual password. Refer to the details in the [Connecting Neon Postgres to Zapier](#connecting-neon-postgres-to-zapier) section for the exact structure. An incorrect password format is a common reason for connection failures.

- **Specific Errors:**

  If you encounter an error message stating: "**Your Zap could not be turned on - AppVersions using SQL Zero require static-ip pool types**" when trying to activate or run a Zap involving the PostgreSQL connection.
  - **Observation:** This issue appears to be related to the Zapier platform's handling of PostgreSQL connections and can sometimes occur without any changes made to your Zap configuration. It has been [reported by users in the Zapier community](https://community.zapier.com/troubleshooting-99/your-zap-could-not-be-turned-on-appversions-using-sql-zero-require-static-ip-pool-types-47107).
  - **Recommended Action:** If you encounter this specific error, and you've confirmed your connection details (including the password format) are correct, the most effective course of action is to **contact Zapier Support directly** as described in the above community post. You can contact them through the [Zapier Support page](https://zapier.com/app/get-help).

## Conclusion

Zapier provides a user-friendly way to connect your Neon Postgres database to the wider ecosystem of cloud applications, enabling powerful automations without writing code. By understanding the trigger and action model, you can streamline workflows, synchronize data, and save significant time.

## Resources

- [Zapier](https://zapier.com)
- [PostgreSQL App on Zapier](https://zapier.com/apps/postgresql/integrations)
- [Zapier example templates for PostgreSQL](https://zapier.com/apps/postgresql/integrations#zap-template-list)
- [Neon Documentation](/docs)

<NeedHelp/>
