---
title: Branching — Testing queries
subtitle: Create a Neon branch to test queries before running them in production
enableTableOfContents: true
redirectFrom:
  - /docs/tutorial/test-queries
updatedOn: '2023-10-07T10:43:33.374Z'
---

Complex queries that modify data or alter schemas have the potential to be destructive. It is advisable to test these types of queries before running them in production. On other database systems, testing potentially destructive queries can be time and resource intensive. For example, testing may involve setting up a separate database instance and replicating data. With Neon, you can instantly create a database branch with a full copy-on-write clone of your production data in just a few clicks. When you finish testing, you can remove the branch just as easily.

This guide walks you through creating a branch of your production data, testing a potentially destructive query, and deleting the branch when you are finished.

1. [Create a test branch](#create-a-test-branch)
3. [Test your query](#test-your-query)
4. [Delete the test branch](#delete-the-test-branch)

For the purpose of this guide, let's assume you have a database in Neon with the following table and data:

```sql
CREATE TABLE Post (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    author_name VARCHAR(100),
    date_published DATE
);
```

```sql
INSERT INTO Post (id, title, content, author_name, date_published)
VALUES
(1, 'My first post', 'This is the content of the first post.', 'Alice', '2023-01-01'),
(2, 'My second post', 'This is the content of the second post.', 'Alice', '2023-02-01'),
(3, 'Old post by Bob', 'This is an old post by Bob.', 'Bob', '2020-01-01'),
(4, 'Recent post by Bob', 'This is a recent post by Bob.', 'Bob', '2023-06-01'),
(5, 'Another old post', 'This is another old post.', 'Alice', '2019-06-01');
```

## Create a test branch

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
4. Enter a name for the branch. This guide uses the name `my_test_branch`.
5. Select a parent branch. Select the branch defined as your primary branch.
6. Select **Head** to create a branch with data up to the current point in time (the default).
7. Leave **Create compute endpoint** selected. This creates the branch with its own dedicated compute instance.
8. Click **Create Branch** to create your branch.

You can also create a test branch using the [Neon CLI](/docs/reference/cli-branches#create) or [Neon API](/docs/manage/branches#create-a-branch-with-the-api).

<CodeTabs labels={["CLI", "API"]}>

```bash
neonctl branches create --project-id <project-id> --name my_test_branch
```

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/<project-id>/branches \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "name": "my_test_branch"
  }
}
' | jq
```

</CodeTabs>

## Test your query

Navigate to the **SQL Editor**, select the test branch, and run your query. For example, perhaps you are deleting blog posts from your database for a certain author published before a certain date, and you want to make sure the query only removes the intended records.

```sql
DELETE FROM Post
WHERE author_name = 'Alice' AND date_published < '2020-01-01';
```

Next, inspect the data to ensure the intended records were deleted, while others remained unaffected. This query allows you to quickly see if the number of records matches your expectations:

```sql
SELECT COUNT(*) FROM Post;
```

Before the `DELETE` query, there were 5 records. If the query ran correctly, this should now show 4.

## Delete the test branch

When you finish testing your query, you can delete the test branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Select the test branch from the table.
4. On the branch page, click the **More** drop-down menu and select **Delete**.
4. On the confirmation dialog, click **Delete**.

You can also delete a branch using the [Neon CLI](/docs/reference/cli-branches#delete) or [Neon API](/docs/manage/branches#delete-a-branch-with-the-api).

<CodeTabs labels={["CLI", "API"]}>

```bash
neonctl branches delete my_test_branch
```

```bash
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/<project-id>/branches/<branch-id> \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' |jq
```

</CodeTabs>
