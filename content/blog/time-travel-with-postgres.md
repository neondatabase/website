---
title: Time Travel with Serverless Postgres
description: Data recovery with database branching
excerpt: >-
  One unfortunate scenario you might run into is running a SQL query that
  accidentally results in data loss. To deal with this issue, you would
  typically need to have backups and then roll back your database to a previous
  state. Neon’s database branching feature enables you to crea...
date: '2022-12-07T17:11:02'
updatedOn: '2023-07-19T09:54:30'
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Time Travel with Serverless Postgres - Neon
  description: Data recovery with database branching
  keywords: []
  noindex: false
  ogTitle: Time Travel with Serverless Postgres - Neon
  ogDescription: >-
    One unfortunate scenario you might run into is running a SQL query that
    accidentally results in data loss. To deal with this issue, you would
    typically need to have backups and then roll back your database to a
    previous state. Neon’s database branching feature enables you to create
    copies of your database at any point […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/social.png
source:
  wpId: 741
  wpSlug: time-travel-with-postgres
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/neon-time-travel-with-postgres-1024x576-ee4eec7a.jpg)

One unfortunate scenario you might run into is running a SQL query that accidentally results in data loss. To deal with this issue, you would typically need to have backups and then roll back your database to a previous state.

Neon’s database branching feature enables you to create copies of your database at any point in time to restore your data to a previous state within seconds.

![Image](https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/image-4-1024x391-201f91d9.png)

This article will cover how Neon’s data branching works and how you can use it for disaster recovery. If you prefer to watch a video instead, you can check out this [Developer Days](https://neon.tech/developer-days-1/) talk, presented by one of Neon’s Co-Founders, [Stas Kelvich](https://github.com/kelvich).

<YoutubeIframe embedId="Qq6wzfopJ38" isDocPost={false} />

## What is a branch?

A branch acts as an isolated environment for working with your database. It is a [copy-on-write](https://en.wikipedia.org/wiki/Copy-on-write) clone of your data where you can make modifications without affecting the originating data. Each Neon project has a [root branch](https://neon.tech/docs/reference/glossary#root-branch) called the main, and you can create more branches depending on your needs.

## Creating a branch

To get started, you first need to create a project in the [console](https://console.neon.tech/sign_in).

To create a branch via the console, navigate to the Branches tab and click on “New Branch”

![Image](https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/image-5-1024x576-8c12e1fd.png)

You will then need to select a parent branch. If this is your first branch, then the parent branch will be main. When it comes to which data you want this branch to copy, you have several options:

- **Head**: creates a branch with all data from the parent branch up to the current point in time.
- **Time**: creates a branch and pulls all data from the parent branch up to a certain point in time. This feature enables you to restore your database to a previous state within a specific time window. During the technical preview, we offer a window of 7 days.
- **LSN**: creates a branch and pulls all data from the parent branch up to a certain LSN ([Log Sequence Number](https://neon.tech/docs/reference/glossary/#lsn)). This is a pointer to a location in the WAL ([Write-Ahead Log](https://neon.tech/docs/reference/glossary/#wal)), which is the log of changes made to the database cluster.

![Image](https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/image-6-1024x576-a939e6aa.png)

If you have a rough idea of when the database was in the correct state, pick the “Time” option.

Alternatively, you can also create branches via the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). To do that, you will first need to generate an API key. Go to the profile icon in the upper right corner and choose the “Account” option from the dropdown menu. Next, go to the Developer Settings tab and click on “Generate new API key”

![Image](https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/image-7-1024x576-96c2b22b.png)

Now that you have an API key, you can send a request to the API to create branches. Here’s an example cURL command:

```bash
curl "https://console.neon.tech/api/v2/projects/${PROJECT_ID}/branches" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${NEON_API_KEY}" \
  -d '{
    "branch": {
      "name": "My new branch!"
    }
  }' | jq
```

You are sending a `POST` request to the create branch endpoint. You are passing the API key in the request’s header and you’re passing your project ID as a variable. Finally, you’re formatting the JSON response using `jq`, an optional third-party tool (see [jq](https://stedolan.github.io/jq/) for more information)

## How to get the most accurate rollback

Rolling back your database to a certain point in time can be good enough. However, this solution might not work for you if you are not 100% confident when the data loss occurred precisely.

Fortunately, you can leverage Neon’s ability to create point-in-time branches with data up to a particular Log Sequence Number (LSN) to determine precisely when the data loss occurred. Let us take a look at an example:

Imagine you have the following users table:

```bash
| Name  |
| ----- |
| Bob   |
| Alice |
| Mike  |
| John  |
| Sarah |
| Lilly |
```

Then for some reason, you wanted to remove Alice from the list manually, so you ran the following query:

```bash
DELETE FROM users WHERE name != "Alice"
```

The next day, you noticed your mistake and discovered that you deleted all users from the table instead of Alice. Unfortunately, you are not sure when exactly the query finished executing and rolling back to an arbitrary date is not an option.

Since Neon offers the ability to create point-in-time branches, you can generate a sequence of branches that include past data in chronological order between two LSNs. You can then go through this list of branches and accurately determine when the disaster occurred.

To generate the list of branches, you will first need to define a start LSN and an end LSN.

To get the start LSN, you can create a branch where you are sure that that data was in a proper state (e.g., one day ago). You can then run the following query to return the LSN

```bash
SELECT pg_current_wal_flush_lsn()
-- returns a hexadecimal value (e.g. 1E9F3918) this will be the start //value of the list
```

You then need to run the same query on the branch containing the incorrect data. The returned value will be the end LSN.

After generating the list of branches, you will notice that you have a search problem where the goal is to find the LSN that resulted in the incorrect data.

Since we have a sorted sequence of LSN values, we can leverage the “[binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm)” algorithm.

Here is a quick summary of how it works:

1. Divide the list into two halves, and compare the target item with the middle item in the list. If the target is equal to the middle item, you have found it, and the search is over.
2. If the target is less than the middle item, the target must be in the left half of the list. Repeat the same process on the left half of the list until you find the target or narrow it down to a single item.
3. If the target is greater than the middle item, the target must be in the right half of the list. Repeat the same process on the right half of the list until you find the target or narrow it down to a single item.
4. Continue dividing the list and comparing the target with the middle item until you find the target or narrow it down to a single item.

Instead of checking for equality, we will need to write a validation function that ensures the correctness of the database. In our example, we can use the following query:

```bash
SELECT count (*) FROM users > 1
-- If the row count of the `users` table is greater than 1, then our database is in the proper state.
```

Depending on your database schema and the type of data loss that occurred, this validation function will be different.

![Image](https://cdn.neonapi.io/public/images/pages/blog/time-travel-with-postgres/image-8-1024x576-252bcce9.png)

Here is a complete example script using Python and Neon’s API:

```javascript
#!/usr/bin/env python3
import psycopg2
import requests
import os
import time

# We know that, e.g. three days ago everything was fine. It is possible to
# mannualy create a branch at specific time with UI and get it's LSN.
start = 0x2EB3898
# Last lsn, `select pg_current_wal_flush_lsn()`
end   = 0x3779AD8

# Database info
project = "silent-morning-200885"
db_creds = f"admin:{os.environ['PGPASSWORD']}"
headers = {
    "Authorization": f"Bearer {os.environ['NEON_API_KEY']}",
    "Content-Type": "application/json"
}

def query_branch(query, branch):
    endpoint_name = branch['endpoints'][0]['id']
    connstr = f"postgres://{db_creds}@{endpoint_name}.eu-central-1.aws.neon.tech/neondb"
    conn = psycopg2.connect(connstr)
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchall()[0][0]
    print(f"Checking \"{query}\" at lsn \"{branch['branch']['parent_lsn']}\": -> {result}")
    return result

def create_branch(parent_id, lsn):
    branch = requests.post(f'https://console.neon.tech/api/v2/projects/{project}/branches',
        headers=headers,
        data=f'{{"endpoints":[{{"type":"read_write"}}],"branch":{{"name":"branch_{lsn}","parent_id":"{parent_id}","parent_lsn":"{lsn}"}}}}'
    ).json()
    print(f"Creating branch at lsn = {lsn}")
    return branch

def delete_branch(branch, lsn):
    branch_id = branch['branch']['id']
    branch = requests.delete(f'https://console.neon.tech/api/v2/projects/{project}/branches/{branch_id}',
        headers=headers
    ).json()
    print(f"Deleted branch at lsn = {lsn}")
    time.sleep(2)
    return branch

def query_at_lsn(parent_id, query, lsni):
    lsn = f"0/{lsni:X}"
    branch = create_branch(parent_id, lsn)
    ret = query_branch(query, branch)
    delete_branch(branch, lsn)
    return ret

def bsearch_rightmost(parent_id, l, r, query):
    while l < r:
        m = (l + r)//2
        if query_at_lsn(parent_id, query, m):
            l = m + 1
        else:
            r = m
    print(f"Converged at 0/{l:X}")

# Find out name of the main branch
resp = requests.get(f'https://console.neon.tech/api/v2/projects/{project}/branches', headers=headers)
main_branch_id = next(b for b in (resp.json()['branches']) if b['name'] == "main")["id"]
print(f"Main branch id is: \"{main_branch_id}\"")

# Do the bsearch
bsearch_rightmost(main_branch_id, start, end, "SELECT count(*) > 1 FROM users")
print("Finishing")
```

After running the following script, you will get the following output which returns the LSN:

```bash
> python3 neon_bisect.py
Main branch id is: "br-rough-queen-879713
Creating branch at lsn = 0/1628D2B4
Checking "select exists(select name from users where name='neon')" at lsn "0/1628D2B4": -> True
Creating branch at lsn = 0/1A6405E6
Checking "select exists(select name from users where name='neon')" at lsn "0/1A6405E6": -> False
Creating branch at lsn = 0/18466C4D
Checking "select exists(select name from users where name='neon')" at lsn "0/18466C4D": -> False
Creating branch at lsn = 0/17379F81
Checking "select exists(select name from users where name='neon')" at lsn "0/17379F81": -> False
Creating branch at lsn = 0/16B0391B
Checking "select exists(select name from users where name='neon')" at lsn "0/16B0391B": -> False
Creating branch at lsn = 0/166C85E8
Checking "select exists(select name from users where name='neon')" at lsn "0/166C85E8": -> True
Creating branch at lsn = 0/168E5F82
Checking "select exists(select name from users where name='neon')" at lsn "0/168E5F82": -> True
Creating branch at lsn = 0/169F4C4F
Checking "select exists(select name from users where name='neon')" at lsn "0/169F4C4F": -> False
Creating branch at lsn = 0/1696D5E9
Checking "select exists(select name from users where name='neon')" at lsn "0/1696D5E9": -> False
Creating branch at lsn = 0/16929AB6
Checking "select exists(select name from users where name='neon')" at lsn "0/16929AB6": -> False
Creating branch at lsn = 0/16907D1C
Checking "select exists(select name from users where name='neon')" at lsn "0/16907D1C": -> True
Creating branch at lsn = 0/16918BE9
Checking "select exists(select name from users where name='neon')" at lsn "0/16918BE9": -> True
Creating branch at lsn = 0/16921350
Checking "select exists(select name from users where name='neon')" at lsn "0/16921350": -> True
Creating branch at lsn = 0/16925703
Checking "select exists(select name from users where name='neon')" at lsn "0/16925703": -> False
Creating branch at lsn = 0/1692352A
Checking "select exists(select name from users where name='neon')" at lsn "0/1692352A": -> True
Creating branch at lsn = 0/16924617
Checking "select exists(select name from users where name='neon')" at lsn "0/16924617": -> True
Creating branch at lsn = 0/16924E8D
Checking "select exists(select name from users where name='neon')" at lsn "0/16924E8D": -> False
Creating branch at lsn = 0/16924A52
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A52": -> True
Creating branch at lsn = 0/16924C70
Checking "select exists(select name from users where name='neon')" at lsn "0/16924C70": -> False
Creating branch at lsn = 0/16924B61
Checking "select exists(select name from users where name='neon')" at lsn "0/16924B61": -> False
Creating branch at lsn = 0/16924ADA
Checking "select exists(select name from users where name='neon')" at lsn "0/16924ADA": -> False
Creating branch at lsn = 0/16924A96
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A96": -> False
Creating branch at lsn = 0/16924A74
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A74": -> True
Creating branch at lsn = 0/16924A85
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A85": -> True
Creating branch at lsn = 0/16924A8E
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A8E": -> False
Creating branch at lsn = 0/16924A8A
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A8A": -> False
Creating branch at lsn = 0/16924A88
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A88": -> True
Creating branch at lsn = 0/16924A89
Checking "select exists(select name from users where name='neon')" at lsn "0/16924A89": -> False
Converged at 0/16924A89
Finishing
```

Now you can create a branch using this LSN value and restore your database to the correct state.

## Final thoughts

In this article, you learned how to create branches for your Neon project and how you can leverage Neon’s API along with point-in-time branches to restore your database to a correct state.

Neon is currently in [Technical Preview](https://neon.tech/docs/introduction/roadmap), meaning you can [sign up](https://console.neon.tech/sign_in) and try out the platform. If you have any feedback, feel free to email us at [feedback@neon.tech](mailto:feedback@neon.tech), we would love to hear from you.

Finally, if you would like to keep up with our latest updates, make sure to subscribe to our newsletter down below.
