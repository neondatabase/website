---
title: Dynamic Routing with Hasura and Neon
subtitle: Leverage Neon's branching with Hasura's dynamic routing for powerful development, testing, and preview environments.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-04-20T00:00:00.000Z'
updatedOn: '2025-04-20T00:00:00.000Z'
---

Managing different database environments for development, testing, staging, and production can be complex. Traditional methods often involve provisioning separate database instances, managing complex data synchronization scripts, or dealing with slow snapshot restores. Neon's serverless Postgres brings efficient, Git-like branching to your database, while Hasura provides an instant GraphQL API layer.

This guide demonstrates how to combine the power of [Neon's database branching](/docs/introduction/branching) with [Hasura's Dynamic Database Routing](https://hasura.io/docs/2.0/databases/database-config/dynamic-db-connection/) feature. This combination allows you to create isolated database environments instantly using Neon branches and dynamically route GraphQL requests from Hasura to the appropriate branch based on request context (like HTTP headers or session variables), streamlining your development, testing, and preview workflows. By leveraging Neon's branching and Hasura's dynamic routing, you can effectively consolidate your infrastructure, serving multiple development, testing, or preview environments from only one Neon project and one Hasura instance.

## Prerequisites

Before you start, ensure you have the following:

- **A Neon Account:** Sign up for a free Neon account at [neon.tech](https://console.neon.tech/signup).
- **A Neon Project:** You need to have a Neon project. If you do not have one, create it via [pg.new](https://pg.new)
- **A Hasura Instance:** A running Hasura instance (v2.x or later). This can be Hasura Cloud Professional or Enterprise tiers, or a self-hosted Enterprise instance. Dynamic routing is not available in the free tier.

## Understanding the core concepts

### Neon Branching

Neon allows you to create branches of your Postgres database almost instantly. Key features include:

- **Copy-on-write:** Branches are lightweight clones. They initially share the parent's data without duplication. Storage costs only increase for the _changes_ (deltas) made within a branch.
- **Isolation:** Each branch operates independently. Changes made in one branch do not affect the parent or other branches. This is perfect for development, testing, or running experiments without impacting production data.
- **Speed:** Creating a branch takes only a few seconds.
- **Management:** Branches can be created and managed via the Neon Console, Neon API, or Neon CLI.
- **Connection string:** Each branch gets its own unique connection string, allowing applications to connect directly to it.

Think of Neon branching like Git branching, but for your database.

### Hasura Dynamic Database Routing

Available in Hasura Cloud Professional/Enterprise and Self-Hosted Enterprise, this feature allows Hasura to route GraphQL requests to different database connections based on request parameters. It uses two main components:

- **Connection set:** A named collection of database connections (including the primary database and potentially read replicas or other databases/branches) that Hasura can choose from.
- **Connection template:** A template written in [Kriti templating language](https://hasura.io/docs/2.0/api-reference/kriti-templating/) that defines the logic for selecting a connection from the Connection Set for a given GraphQL request.

The Kriti template has access to request context variables like:

- `$.request.headers`: HTTP headers from the client request (e.g., `x-hasura-branch-name`).
- `$.request.session`: Hasura session variables (e.g., `x-hasura-role`, `x-hasura-user-id`).
- `$.request.query`: Information about the GraphQL query (e.g., `operation_type`, `operation_name`).

The template must resolve to one of the predefined connection identifiers:

- `$.primary`: The main database connection defined for the source.
- `$.read_replicas`: A randomly chosen read replica (if configured).
- `$.connection_set.<member_name>`: A specific connection defined within the connection set.
- `$.default`: The default Hasura behavior (route to read replicas for queries/subscriptions, primary for mutations, or just primary if no replicas).

## Conceptual overview

Here's a high-level overview of how to set up dynamic routing with Neon and Hasura:

1.  **Create Neon branches:** For each environment you need (e.g., `dev`, `staging`, `feature-x`), create a corresponding branch in your Neon project. Obtain the connection string for each branch.
2.  **Configure Hasura data source:** Add your _primary_ Neon database as a data source in Hasura.
3.  **Define connection set:** In the Hasura data source configuration, add the connection strings of your Neon branches to the Connection set, giving each a unique, descriptive name (e.g., `dev_branch`, `staging_branch`, `feature_x_branch`).
4.  **Implement connection template:** Write a Kriti template that inspects the incoming GraphQL request (e.g., checks for a specific header like `x-hasura-branch-name`) and resolves to the appropriate member name in the Connection set (e.g., `$.connection_set.dev_branch`).
5.  **Route Requests:** Send GraphQL requests to Hasura with the necessary context (e.g., the `x-hasura-branch-name` header) to route them to the desired Neon branch.

We shall discuss the implementation in detail in the next section.

## Step-by-step implementation

### Create Neon branches

You can create branches using the [Neon Console](/docs/introduction/branching/#create-a-branch), [API](/docs/guides/branching-neon-api), or [CLI](/docs/guides/branching-neon-cli). For detailed instructions, follow [Neon's Create a branch guide](/docs/manage/branches#create-a-branch) to set up branches for your development and feature environments.

Copy the connection strings for each branch you create; you will need them later.

### Configure Hasura data source

If you haven't already, add your Neon database as a data source in Hasura. Follow the step by-step guide on [Connect from Hasura Cloud to Neon](/docs/guides/hasura) to set up the primary connection.

### Define the connection set in Hasura

Now, add your Neon branches to the connection set for the data source you just configured:

1.  Go to the `Hasura Console -> Data -> Manage`.
2.  Click "Edit" next to your data source.

        ![Edit Data Source](/docs/guides/hasura/edit-data-source.png)

3.  Navigate to the `Dynamic Routing` tab.
4.  Under "Available Connections for Templating", click `+ Add Connection`.
    ![Add Connections for Templating](/docs/guides/hasura/add-connection-for-templating.png)
5.  In the modal:
    - **Connection name:** Enter a unique, lowercase name (e.g., `dev_branch`). This name will be used in the Kriti template.
    - **Connect Database via:** Select `Database URL`.
    - **Database URL:** Paste the connection string for your `dev` Neon branch which you copied earlier in the [Create Neon Branches](#create-neon-branches) section.
      ![Add Connection Modal](/docs/guides/hasura/add-connection-modal.png)
    - Click `Add Connection`.

      <Admonition type="tip">
      To enhance security and manageability, consider using environment variables in Hasura instead of hardcoding the connection string. To do this, navigate to **Hasura Project settings** > **Env vars** > **New env var** and create a new variable (e.g., `NEON_DATABASE_URL_DEV_BRANCH`) with your connection string as its value.
          
          ![Create Environment Variable](/docs/guides/hasura/create-env-var.png)

      Then, in the connection modal, select **Connect database via Environment variable** and enter the variable name you created. This approach keeps your connection string secure and simplifies future updates.
      </Admonition>

6.  Repeat step 5 for other branches, e.g., `staging_branch`, `feature_x_branch`, etc., using their respective connection strings.

You should now see `dev_branch`, `feature_x_branch` and `staging_branch` listed under "Available Connections for Templating".

    ![Available Connections for Templating](/docs/guides/hasura/available-connections-for-templating.png)

### Create the connection template

This template defines the routing logic. We'll create a template that routes requests based on an `x-hasura-branch-name` HTTP header.

1.  In the `Dynamic Routing` tab for your data source, find the "Connection Template" section.
2.  Select `Custom Template`.
    ![Custom Template Kriti](/docs/guides/hasura/custom-template-kriti.png)
3.  Enter the following Kriti template in the editor:

    ```json
    {{ if ($.request.headers?["x-hasura-branch-name"] == "dev")}}
        {{$.connection_set.dev_branch}}
    {{ elif ($.request.headers?["x-hasura-branch-name"] == "feature-x")}}
        {{$.connection_set.feature_x_branch}}
    {{ elif ($.request.headers?["x-hasura-branch-name"] == "staging")}}
        {{$.connection_set.staging_branch}}
    {{ else }}
        {{$.default}}
    {{ end }}
    ```

4.  Click `Update Connection Template` to save it.

#### Explanation of the template

- `$.request.headers?["x-hasura-branch-name"]`: Accesses the header value. The `?` handles cases where the header might be missing.
- `== "dev"` / `== "feature-x"` / `== "staging"`: Checks if the header matches the expected branch name.
- `{{$.connection_set.dev_branch}}`: If the header matches 'dev', the template resolves to use the connection named `dev_branch` from the set.
- `{{$.connection_set.feature_x_branch}}`: If the header matches 'feature-x', route to that connection.
- `{{$.connection_set.staging_branch}}`: If the header matches 'staging', route to that connection.
- The `else` block provides fallback behavior: mutations go to the default (primary) branch, while other operations follow the default routing. You can adjust this fallback as needed.

<Admonition type="note">
You can utilize any attribute from the request context within your Kriti template. For instance, you can use session variables to route requests based on user roles or IDs.

Here's an example of how you might check the request session:

    ```json
    {{ if ($.request.session.x-hasura-role == "manager")}}
        {{$.connection_set.manager_connection}}
    {{ elif ($.request.session.x-hasura-role == "employee")}}
        {{$.connection_set.employee_connection}}
    {{ else }}
        {{$.default}}
    {{ end }}
    ```

This approach enables more complex routing logic by directing requests according to the user's role.

For more advanced routing logic, or for information on dynamically creating and updating connection templates, refer to [Hasura's Dynamic Routing for Databases](https://hasura.io/docs/2.0/databases/database-config/dynamic-db-connection/).

</Admonition>

### Testing the connection template with Hasura Validate

Hasura provides a convenient way to test your connection template directly within the Console. This simulates a GraphQL request based on the context you provide (headers, session variables, etc.).

1.  You can find the **Validate** button in the **Dynamic Routing** tab of your data source configuration.
    ![Validate Dynamic Routing](/docs/guides/hasura/validate-dynamic-routing.png)

2.  **Simulate Request Context:**
    This modal allows you to define the context (`$.request`) that your Kriti template will evaluate against.
    - **Test Routing to `dev_branch`:**
      - In the **Headers** section, click `+ Add`.
      - Enter `x-hasura-branch-name` as the header key and `dev` as the value.
      - Leave **Operation Type** as `Query`.
      - Click the `► Validate` button at the _bottom right_ of the modal.
      - **Expected Result:** The output below should show `Routing to: $.connection_set. Value: dev_branch`.
        ![Validate Dynamic Routing to dev_branch](/docs/guides/hasura/validate-dynamic-routing-dev-branch.png)

    - **Test Fallback Routing (Query):**
      - Remove the `x-hasura-branch-name` header
      - Click `► Validate`.
      - **Expected Result:** Based on our template's fallback logic, this should show `Routing to: $.default`.

This validation provides a quick and safe way to confirm your routing logic works as expected under different conditions before applying it to live traffic.

### Update your application code

Now that the connection template is validated, you're ready to leverage Hasura's dynamic routing with your Neon branches. Send the `x-hasura-branch-name` header along with your GraphQL requests, setting its value to match the target branch identifier (e.g., `dev`, `feature-x`, `staging`). This mechanism provides precise control and can be easily incorporated into your application code or automated within CI/CD processes to manage environments effectively.

## Read replicas and routing

Neon allows you to create [Read Replicas](/docs/introduction/read-replicas) for your database branches, which are separate compute endpoints designed for handling read-only traffic. Hasura's Dynamic Routing feature allows you to leverage these replicas strategically using connection templates.

### Creating read replicas in Neon

First, create the necessary read replicas for your Neon branches by following the [Create and manage Read Replicas guide](/docs/guides/read-replica-guide).

Note that replicas can be added to any branch, including the primary. Once a replica is created, copy its connection string, which you'll need for the next step.

### Configuring read replicas in Hasura

To configure read replicas for your primary Neon data source within Hasura, follow these steps:

1.  Go to the `Hasura Console -> Data -> Manage`.
2.  Locate your primary data source and click the "Edit" button next to it.
3.  Navigate to the `Connection Details` tab.
4.  Scroll down to the "Read Replicas" section and click `+ Add New Read Replica`.
    ![Add Read Replica](/docs/guides/hasura/add-read-replica.png)
5.  In the modal, paste the connection string **you copied earlier for your Neon read replica** into the `Database URL` field, then click `Add Read Replica` (within the modal).
6.  (Optional) Repeat step 5 if you have multiple read replicas to add for this primary source.
7.  **Finally, ensure you click** the main `Update Connection` button at the bottom of the page to save these changes to the data source configuration.
    ![Hasura Update Connection](/docs/guides/hasura/update-connection-read-replica.png)

### Kriti variables for replica routing

Within your Kriti connection template, you have access to specific variables that control how Hasura interacts with read replicas (which are typically configured in the main Data Source 'Connection Settings' for the primary connection):

- **`{{$.primary}}`**: Explicitly routes the request to the primary read-write connection defined for the data source, bypassing any read replicas.
- **`{{$.read_replicas}}`**: Routes the request to a _randomly chosen_ read replica from the list configured in the main 'Connection Settings'. This is only valid for `query` and `subscription` operations. Using it for `mutation` operations will result in an error.
- **`{{$.default}}`**: Routes the request according to Hasura's default behavior:
  - If read replicas _are_ configured: Routes `query`/`subscription` operations to a random read replica and `mutation` operations to the `primary` connection.
  - If read replicas _are not_ configured: Routes all operations to the `primary` connection.
- **`{{$.connection_set.<member_name>}}`**: Routes the request to a specific named connection (like a Neon branch connection string) defined in your Dynamic Routing connection set, bypassing default replica logic.

### Implementing routing logic in Kriti

You can use conditional logic within your Kriti template to decide when to utilize read replicas. The primary use case is often within the fallback logic (when a specific branch isn't targeted via a header). The `default` connection in Hasura will automatically route to a read replica if one is configured.

Here's an example of how you might implement this in your Kriti template:

    ```json
    {{ if ($.request.headers?["x-hasura-branch-name"] == "dev")}}
        {{$.connection_set.dev_branch}}
    {{ elif ($.request.headers?["x-hasura-branch-name"] == "feature-x")}}
        {{$.connection_set.feature_x_branch}}
    {{ elif ($.request.headers?["x-hasura-branch-name"] == "staging")}}
        {{$.connection_set.staging_branch}}
    {{ elif ($.request.query.operation_type == "mutation")}}
        {{$.primary}}
    {{ elif ($.request.headers?["no-stale-read"] == "true")}}
        {{$.primary}}
    {{ else }}
        {{$.default}}
    {{ end }}
    ```

#### Explanation of the fallback logic:

1.  **Mutations:** Always directed to `{{$.primary}}` for write capability.
2.  **Fresh reads:** If the `no-stale-read: true` header is present (for queries/subscriptions), route to `{{$.primary}}` to bypass potential replication lag on replicas.
3.  **Standard reads:** For all other queries/subscriptions in the fallback scenario, route to `{{$.default}}`. This directs Hasura to use one of the read replicas configured in the main connection settings. If no replicas are configured there, Hasura falls back gracefully to the primary connection.
4.  **Branch-specific reads:** If a specific branch is targeted via the `x-hasura-branch-name` header, route to that branch connection.

## Considerations and limitations

- **Schema consistency:** Hasura derives the GraphQL schema _only_ from the `primary` connection. All branches in your connection set _should_ have a compatible schema. Hasura does not verify schema consistency across the connection set members. Mismatched schemas can lead to runtime errors when a request is routed to a branch with an incompatible schema.
- **Migrations:** Hasura CLI migrations can only be applied directly to the `primary` connection defined in the source configuration.
- **Event triggers:** Hasura Event Triggers are typically configured on the primary database and will only fire for mutations executed on the `primary` connection. Mutations routed to other branches in the connection set will _not_ trigger these events.

## Conclusion

Combining Neon's instant database branching with Hasura's dynamic routing offers a powerful and flexible way to manage multiple database environments for development, testing, and previews. By creating lightweight, isolated Neon branches and using Hasura's connection templates to intelligently route requests based on context, you can significantly streamline your workflows, improve developer productivity, and ensure safer testing without the overhead of managing multiple full databases and GraphQL instances.

## Resources

- [Neon Branching](/docs/introduction/branching)
- [Neon Read Replica](/docs/introduction/read-replicas)
- [Hasura Dynamic Database Connection Routing](https://hasura.io/docs/2.0/databases/database-config/dynamic-db-connection/)
- [Hasura Kriti Templating Specification](https://hasura.io/docs/2.0/api-reference/kriti-templating/)
- [Hasura Read Replicas](https://hasura.io/docs/2.0/databases/database-config/read-replicas/)
