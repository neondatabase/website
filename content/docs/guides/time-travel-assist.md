---
title: Time Travel Assist
subtitle: Learn how to query point-in-time connections against your data's history
enableTableOfContents: true
---

To help troubleshoot your data's history, you can use Time Travel Assist to connect to any selected point in time within your history retention window and then run queries against that connection. 

You can use Time Travel Assist from two places in the Neon Console:

- **SQL Editor** &#8212; Time Travel is built into the SQL editor letting you switch between queries of your current data and previous iterations of your data in the same view.
- **Restore** &#8212; Time Travel Assist is also built into the Branch Restore flow where it can help you make sure ou've targeted the correct restore point before you restore a branch.

## How Time Travel Assist works

It's a good idea to run this kind of query to make sure you've targeted the correct restore point before you restore a branch.

The restore operation and Time Travel Assist are meant to work together. When you select a branch and timestamp, you can either use that selection as your restore point or as the point in time connection to query against.

![Time travel assist](/docs/guides/branch_time_travel.png)

### Ephemeral endpoints

Time travel assist leverages Neon's instant branching capability to create a temporary branch and compute endpoint at the selected point in time, which is automatically removed once you are done querying against this point-in-time connection. The compute endpoints are ephemeral: they are not listed on the **Branches** page or in a CLI or API list branches request.

However, you can see the history of operations related to the creation and deletion of the ephemeral branch on the **Operations** page:

- start_compute
- create_branch
- delete_timeline
- suspend_compute

### How long do ephemeral endpoints remain active

The ephemeral endpoints are created according to your configured [default compute size](/docs/manage/projects#reset-the-default-compute-size). An ephemeral endpoint remains active for as long as you keep running queries against it. After 10 seconds of inactivity, the timeline is deleted and the endpoint is removed.

## Using Time Travel Assist

Here is how to use the Time Travel Assist SQL editor:

1. Select the branch you want to query against, then select a timestamp, the same as you would to [Restore a branch](#restore-a-branch-to-an-earlier-state).

    This makes the selection for Time Travel Assist. Notice the updated fields above the SQL editor show the **branch** and **timestamp** you just selected.
    ![Time travel assist](/docs/guides/time_travel_assist.png)
  
1. Check that you have the right database selected to run your query against. Use the database selector under the SQL editor to switch to a different database for querying against.
1. Write your read-only query in the editor, then click **Query at timestamp** to run the query. You don't have to include time parameters in the query; the query is automatically targeted to your selected timestamp.

If your query is successful, you will see a table of results under the editor.

Depending on your query and the selected timestamp, instead of a table of results, you might see different error messages like:
| Error                | Explanation             |
|----------------------|-------------------------|
| If you query a timestamp in the future         | Console request failed with 400 Bad Request: timestamp [timestamp] is in the future, try an older timestamp |
| If you query a timestamp from before your project was created | Console request failed with 400 Bad Request: parent timestamp [timestamp] is earlier than the project creation timestamp [timestamp], try a more recent timestamp |
| If you query from earlier than your history retention window | Console request failed with 400 Bad Request: timestamp [timestamp] recedes your project's history retention window of 168h0m0s, try a more recent timestamp |

Adjust your selected timestamp accordingly.