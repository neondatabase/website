---
title: Automating Neon branch creation with Githooks
description: Instant development databases with post-checkout hook
excerpt: >-
  In this blog post, we’ll walk through creating a Githook script that automates
  the creation of Neon branches every time a new Git branch is created. This is
  possible because Neon provides an API to manage your projects, branches, and
  most other operations supported by the Neon Co...
date: "2023-05-25T21:33:03"
updatedOn: "2023-12-20T21:01:25"
category: community
categories:
  - community
  - workflows
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/automating-neon-branch-creation-with-githooks/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Automating Neon branch creation with Githooks - Neon
  description: Instant development databases with post-checkout hook
  keywords: []
  noindex: false
  ogTitle: Automating Neon branch creation with Githooks - Neon
  ogDescription: >-
    In this blog post, we’ll walk through creating a Githook script that
    automates the creation of Neon branches every time a new Git branch is
    created. This is possible because Neon provides an API to manage your
    projects, branches, and most other operations supported by the Neon Console.
    You can learn more about the Neon […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/automating-neon-branch-creation-with-githooks/social.png
---

<figure>
<video width="2336" height="1794" style={{ aspectRatio: '2336 / 1794' }} autoPlay loop muted playsInline src="https://cdn.neonapi.io/public/videos/pages/blog/automating-neon-branch-creation-with-githooks/sequence-01-f5e99565.mp4"></video>
</figure>

In this blog post, we’ll walk through creating a [Githook](https://git-scm.com/docs/githooks) script that automates the creation of [Neon branches](https://neon.tech/docs/introduction/branching) every time a new Git branch is created. This is possible because Neon provides an API to manage your projects, branches, and most other operations supported by the Neon Console. You can [learn more about the Neon API here](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

We’ll start with a simple Githook example and incrementally build up to our final solution. You can find the repository along with the instructions on [GitHub](https://github.com/raoufchebri/create-neon-branch-with-githooks).

## What are Neon branches?

Similarly to Git branches, Neon branches are isolated copies of your database that are helpful for experimenting with new features without compromising your database. You can instantly create Neon branches using the Neon console or the API. [Learn more about database branching in the docs](https://neon.tech/docs/introduction/branching).

## What are Githooks?

Githooks are custom scripts that run on certain events in the Git lifecycle. You can use them to customize Git’s internal behavior and trigger customizable actions at key points in your development workflow. In our case, we’ll use a `post-checkout` hook, which runs after the `git checkout` command.

## The challenges of local development

Traditionally, local development with Postgres can be somewhat cumbersome. You either need to have Postgres installed on your local machine or use Docker, both of which can be resource-intensive and may slow down your computer. In addition, setting up and maintaining your local Postgres database to mirror your production environment requires writing and managing seed scripts. This means you spend significant time managing your database setup rather than focusing on coding.

Having a separate Neon branch for each of your Git branches can improve your local development experience. With this setup, you don’t need to worry about managing a local Postgres instance or creating seed scripts. You also avoid the risk of inconsistencies between your local and production database schemas, as your Neon branches are exact copies of your main database. The Githook we describe in this article automates the process of creating these Neon branches, saving you even more time and effort.

## Starting simple: the basic Githook

Let’s start by creating a simple Git post-checkout hook that prints a message after a `git checkout` operation. Githooks should be placed in the .git/hooks directory of your Git repository. Let’s create a new project folder and the post-checkout file:

```bash
mkdir neon-githook
cd neon-githook
git init
touch .git/hooks/post-checkout
```

In the `post-checkout` file, add the following code:

```bash
#!/bin/sh
echo "You just checked out a git branch!"
```

To make this hook run, we have to make the script executable:

```bash
chmod +x .git/hooks/post-checkout
```

Now, every time you run `git checkout`, you’ll see the message: “You just checked out a git branch!”

## Checking if a Git branch is new

Next, we’ll modify the script to create a Neon branch whenever a new Git branch is created.

First, we need to determine if we just checked out a new Git branch or an existing one. The `git checkout` command passes three arguments to the post-checkout hook:

`$1` – the ref of the previous HEAD

`$2` – the ref of the new HEAD (which may or may not have changed)

`$3` – a flag indicating whether the checkout was a branch checkout (changing branches, flag=1) or a file checkout (retrieving a file from the index, flag=0)

We can determine if the command is a Git branch checkout by checking the third argument passed to the `post-checkout` hook. If it’s 1, we have checked out a new Git branch.

```bash
#!/bin/sh
if [ $3 == 1 ]; then
  echo "You just checked out a new git branch!"
fi
```

The issue here is if we switch back to a previously checked-out Git branch, the script considers it a new Git branch. To avoid this, we count the number of times the Git branch has been checked out. If it’s 1, it means that the Git branch has been checked out for the first time.

## Adding More Functionality: Creating a Neon Branch

We want to create a new Neon branch for every new Git branch in our local development environment and paste the new connection string to our environment variables.

To that end, we need to add code that sends a POST request to the Neon API to create a new database branch. For that, you need to [create a project](https://console.neon.tech/) and [generate an API key](https://neon.tech/docs/manage/api-keys#create-an-api-key) on the Neon Console. To generate an API key:

1. Log in to the Neon Console.
2. Click your account in the bottom left corner of the Neon Console, and select Account.
3. Select Developer Settings and click Generate new API Key.
4. Enter a name for the API key.
5. Click Create and copy the generated key.

<figure>
<video width="3424" height="1914" style={{ aspectRatio: '3424 / 1914' }} autoPlay loop muted playsInline src="https://cdn.neonapi.io/public/videos/pages/blog/automating-neon-branch-creation-with-githooks/api-key-from-console-0f577c35.mp4"></video>
</figure>

The `PROJECT_ID` for a Neon project is found on the Settings page in the Neon Console.

![Image](https://cdn.neonapi.io/public/images/pages/blog/automating-neon-branch-creation-with-githooks/image-28-1024x573-e5c88362.png)

Use the commands below to add the `PROJECT_ID` and `API_KEY` to your environment variables:

```bash
export NEON_PROJECT_ID=<neon_project_id>
export NEON_API_KEY=<neon_api_key>
```

Now, we can add the following the `curl` command to the `post-checkout` file to create a branch:

```bash
#!/bin/sh
if [ $3 == 1 ]; then
  BRANCH_NAME=$(git symbolic-ref --short HEAD)
  NUM_CHECKOUTS=`git reflog --date=local | grep -o ${BRANCH_NAME} | wc -l`
  if [ ${NUM_CHECKOUTS} -eq 1 ]; then
    # Add your own PROJECT_ID and API_KEY
    PROJECT_ID=$NEON_PROJECT_ID
    API_KEY=$NEON_API_KEY
    # Execute the curl command and save the output
    RESPONSE=$(curl --silent --request POST \
        --url https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches \
        --header 'accept: application/json' \
        --header "authorization: Bearer $API_KEY" \
        --header 'content-type: application/json' \
        --data '
        {
          "endpoints": [
          {
            "type": "read_write"
          }
        ],
        "branch": {
        "name": "'"$BRANCH_NAME"'"
        }
     }
    ')

    # Extract the connection_uri from the response
    CONNECTION_URI=$(echo $RESPONSE | jq -r '.connection_uris [0].connection_uri')
  fi
fi
```

## Adding User Interaction: Prompting for Confirmation

Before we automatically create a Neon branch, we might want to ask the user if they want to create one. We can do this with the `sh` read command:

```bash
#!/bin/sh
if [ $3 == 1 ]; then
  BRANCH_NAME=$(git symbolic-ref --short HEAD)
  read -p "Do you want to create a Neon branch for $BRANCH_NAME? (y/n): " answer </dev/tty

  # further code...
fi
```

Here, the read command reads the user’s input into the answer variable. However, it’s important to note that Githooks are not connected to the terminal, so we have to redirect input from /dev/tty.

## Handling the Neon API Response

The next step is to handle the API response. We want to extract the `connection_uri` from the response and save it to a `.env` file. We can use the [`jq`](https://stedolan.github.io/jq/) command to parse the JSON response:

```bash
#!/bin/sh
if [ $3 == 1 ]; then
  # ... existing code ...
  RESPONSE=$(curl --silent --request POST \
    # ... existing code ...
  )

  CONNECTION_URI=$(echo $RESPONSE | jq -r '.connection_uris [0].connection_uri')

  if [[ $CONNECTION_URI == postgres://* ]]; then
    echo "DATABASE_URL=$CONNECTION_URI" >> .env
  else
    echo "Invalid connection string."
  fi
fi
```

## Checking if a Neon Branch Already Exists

Before making a request to create a Neon branch, we can first check if it already exists. To do this, we can send a GET request to the Neon API, parse the response, and look for our Neon branch in the returned list of branches.

Here’s how we add this to our script:

```bash
# ... existing code ...

# Get the list of branches

BRANCHES_JSON=$(curl --silent --request GET \
    --url https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches \
    --header 'accept: application/json' \
    --header "authorization: Bearer $API_KEY")
# Check if the branch already exists
if echo "$BRANCHES_JSON" | jq -e --arg BRANCH_NAME "$BRANCH_NAME" '.branches [] | select(.name == $BRANCH_NAME)' >/dev/null; then
  echo "Neon branch $BRANCH_NAME already exists."
  exit
fi
```

We then use `jq` to parse the response and search for a Neon branch with the same name as the one we want to create. If the branch name is found, we print a message and terminate the script. This small change makes the script more robust and user-friendly.

This is what the final code looks like:

```bash
#!/bin/bash
if [ $3 == 0 ]; then exit; fi
# Check if we just checked out a new branch
if [ $3 == 1 ]; then
  BRANCH_NAME=$(git symbolic-ref --short HEAD)
  NUM_CHECKOUTS=`git reflog --date=local | grep -o ${BRANCH_NAME} | wc -l`
  if [ ${NUM_CHECKOUTS} -eq 1 ]; then
    # Add your own PROJECT_ID and API_KEY
    PROJECT_ID=$PROJECT_ID
    API_KEY=$API_KEY

    # Get the list of branches
    BRANCHES_JSON=$(curl --silent --request GET \
        --url https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches \
        --header 'accept: application/json' \
        --header "authorization: Bearer $API_KEY")

    # Check if the branch already exists
    if echo "$BRANCHES_JSON" | jq -e --arg BRANCH_NAME "$BRANCH_NAME" '.branches [] | select(.name == $BRANCH_NAME)' >/dev/null; then

      echo "Neon branch $BRANCH_NAME already exists."
      exit
    fi

    # Prompt the user to ask if they want to create a Neon branch
    read -p "Do you want to create a Neon branch for $BRANCH_NAME? (y/n): " answer </dev/tty

    # Convert the answer to lowercase to make the condition case-insensitive
    answer=$(echo $answer | tr ' [:upper:]' ' [:lower:]')

    if [ "$answer" == "y" ] || [ "$answer" == "yes" ]; then

        # Execute the curl command and save the output

        RESPONSE=$(curl --silent --request POST \

            --url https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches \

            --header 'accept: application/json' \

            --header "authorization: Bearer $API_KEY" \

            --header 'content-type: application/json' \

            --data '
        {
            "endpoints": [
            {
                "type": "read_write"
            }
            ],
            "branch": {
            "name": "'"$BRANCH_NAME"'"
            }
        }
        ')

        # Extract the connection_uri from the response
        CONNECTION_URI=$(echo $RESPONSE | jq -r '.connection_uris [0].connection_uri')

        if [[ $CONNECTION_URI == postgres://* ]]; then
          # If it does, write it to the .env file
          echo "DATABASE_URL=$CONNECTION_URI" >> .env
        else
          # If it doesn't, print an error message or handle this case as needed
          echo "Invalid connection string."
        fi
    else
        echo "Skipping Neon branch creation"
    fi
  fi
fi
```

## Conclusion

This blog post showed how to implement a Git post-checkout hook that automates the creation of Neon branches every time you create a new Git branch. We started from a simple script and gradually added more features, handling user interactions and API responses, and ensuring it only runs for newly created Git branches.

Luckily, you won’t have to implement this code in your environments for much longer. We are currently working on a CLI that helps you manage your projects and includes other capabilities such as creating branches using Git commands. So, make sure to stay tuned.<br />[Get started with Neon and it’s API](https://console.neon.tech/) today for free, and let us know how you use Githooks in your workflows.
