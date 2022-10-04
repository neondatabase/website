---
title: How to Use Branches
---

Now that you have access to [branching](https://neon.tech/docs/conceptual-guides/branching.md) on Neon, let's look at how you can use it.

Branching allows you to create a copy of your Project data which you can modify without affecting the data you have in production.

A branch is created with the same data that existed in your Project at the time the branch was created, but future changes to your Project data do not affect the branch.

The following guide describes how to using branching in your project.

Branches currently appear as a new project in the Neon Console and API, but when the branching feature is made available to all users, branches will be associated with their parent Project.

---
Let's look at how to create branches using the Neon Console and the Neon API.

Create a Project in Neon and add your data
===============
Log in to Neon and create a project in the Neon Console: [https://console.neon.tech](https://console.neon.tech)
Add data to your Project using the Neon SQL Editor, `psql`, or some other PostgreSQL client.

Refer to the Neon documentation for information about creating a Project:
https://neon.tech/docs/cloud/getting-started/
https://neon.tech/docs/cloud/tutorials/
https://neon.tech/docs/quickstart/postgres/

After creating a Project and adding data, click **Create branch** on the **Dashboard** tab in the Neon Console to create a branch.
Alternatively, you can use the Neon API to create a branch.

Create a branch using the API
======================================
Using the Neon API requires an API key. For information about how to obtain an API key for your Project, refer to [Using API keys](https://neon.tech/docs/get-started-with-neon/using-api-keys/).
For information about the API methods that Neon supports, refer to the [Neon API Reference](https://console.neon.tech/api-docs). 
To create a branch, use the following API method:

	POST /projects/{project_id}/branches

Here's an example of a cURL command that uses that method to create a branch: 

```
curl -o - -X POST -H 'Authorization: Bearer ...' https://console.neon.tech/api/v1/clusters/ancient-haze-985396/branches
```

To use the cURL command with your Project, change the placeholder Project name `ancient-haze-985396` to the name of the Project that you want to branch from.
In the response to the API request, you will receive information about the branch you created. The branch name will have the following format:
`$parent_project_id-branch-...`.
Currently, a branch appears as separate Project on the **Dashboard** tab in the Neon Console. This will change in the future when the branching feature becomes generally available.
All the data in the parent project when you create the branch will be available in the branched project as well.
Future changes to the data in the parent and the branch are independent, so you can make changes to the branch without affecting your parent project.

Learn More About [Branching](https://neon.tech/docs/conceptual-guides/branching.md) in Neon
