---
title: Automate branching with Githooks
subtitle: Learn how you can automatically create and delete database branches in Neon using Githooks
enableTableOfContents: true
isDraft: true
---

This guide leads you through creating a Githook script that automates the creation of Neon branches every time a new Git branch is created. This is possible because Neon provides an API to manage your projects, branches, and most other operations supported by the Neon Console. You can learn more about the Neon API [here](https://neon-console-docs-link.com).

We’ll start with a simple Githook example and incrementally build up to thr final solution. You can find the repository along with the instructions on [GitHub](https://github-link.com).

## What are Neon branches?

Similarly to Git branches, Neon branches are isolated copies of your database that are helpful for experimenting with new features without compromising your database. You can instantly create Neon branches using the Neon console, API, or CLI.

## What are Githooks?

Githooks are custom scripts that run on certain events in the Git lifecycle. You can use them to customize Git’s internal behavior and trigger customizable actions at key points in your development workflow. This guides shows how to configure a post-checkout hook, which runs after the `git checkout` command.

## The challenges of local development

Traditionally, local development with PostgreSQL can be somewhat cumbersome. You either need to have PostgreSQL installed on your local machine or use Docker, both of which can be resource-intensive and may slow down your computer. In addition, setting up and maintaining a local database to mirror your production environment requires writing and managing seed scripts. This means you spend significant time managing your database setup rather than focusing on coding.

Having a separate Neon branch for each of your Git branches can improve your local development experience. With this setup, you don’t need to worry about managing a local PostgreSQL instance or creating seed scripts. You also avoid the risk of inconsistencies between your local and production database schemas, as your Neon branches are exact copies of your main database. The Githook described in this guide automates the process of creating Neon branches, saving you time and effort.

## Create a basic Githook

Start by creating a simple Git post-checkout hook that prints a message after a git checkout operation. Githooks should be placed in the ``.git/hooks` directory of your Git repository. 

Create a new project folder and the post-checkout file:

```shell
mkdir neon-githook
cd neon-githook
git init
touch .git/hooks/post-checkout
```

In the post-checkout file, add the following code:

```shell
#!/bin/sh
echo "You just checked out a git branch!"
```

To make the Githook run, you need to make the script executable:

```shell
chmod +x .git/hooks/post-checkout
```

Now, every time you run git checkout, you’ll see the message: “You just checked out a git branch!”

## Checking if a Git branch is new

In this step, you will modify the script to create a Neon branch whenever a new Git branch is created.

First, we need to determine if we just checked out a new Git branch or an existing one. The git checkout command passes three arguments to the post-checkout hook:

$1 – the ref of the previous HEAD
$2 – the ref of the new HEAD (which may or may not have changed)
$3 – a flag indicating whether the checkout was a branch checkout (changing branches, flag=1) or a file checkout (retrieving a file from the index, flag=0)

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
    if echo "$BRANCHES_JSON" | jq -e --arg BRANCH_NAME "$BRANCH_NAME" '.branches[] | select(.name == $BRANCH_NAME)' >/dev/null; then

      echo "Neon branch $BRANCH_NAME already exists."
      exit
    fi

    # Prompt the user to ask if they want to create a Neon branch
    read -p "Do you want to create a Neon branch for $BRANCH_NAME? (y/n): " answer </dev/tty

    # Convert the answer to lowercase to make the condition case-insensitive
    answer=$(echo $answer | tr '[:upper:]' '[:lower:]')

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
        CONNECTION_URI=$(echo $RESPONSE | jq -r '.connection_uris[0].connection_uri')

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

This topic showed how to implement a Git post-checkout hook that automates the creation of Neon branches every time you create a new Git branch. We started from a simple script and gradually added more features, handling user interactions and API responses, and ensuring it only runs for newly created Git branches.
