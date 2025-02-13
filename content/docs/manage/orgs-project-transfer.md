---
title: Transfer projects to an organization
enableTableOfContents: true
updatedOn: '2025-02-13T13:32:35.159Z'
---

As an Admin or Member of an organization, you can transfer projects in the following ways:

- From personal accounts to organizations
- Between different organizations (via API)

This guide explains how to transfer projects using both the UI and API methods, and covers important requirements and limitations.

## Guidelines

Before transferring projects, review these important guidelines covering transfer limits, requirements, and other key considerations.

### Transfer limits

| Transfer method                                      | Project limit                            |
| ---------------------------------------------------- | ---------------------------------------- |
| [Neon Console](#transfer-from-the-neon-console)      | Up to 200 projects at a time             |
| [API](#transfer-projects-via-api)                    | Up to 400 projects in a single operation |
| [Python script](#transfer-large-numbers-of-projects) | Unlimited (processes in batches)         |

The number of projects you can transfer is limited by the target Organization plan's allowance.

### Requirements

- Minimum **Member** role in the target Organization. **Admin** role if tranferring from an organization.
- Compatible billing plans (can transfer from higher to lower tier, not vice versa)
- Projects must not have GitHub or Vercel integrations
- Vercel-managed organizations are not supported

### Additional considerations

- If any organization members were already collaborators on the projects being transferred, we'll remove their collaborator access since they'll get full access as org members anyway
- Transferring projects between Organizations is currently supported using the [API](#transfer-between-organizations-via-api) only

## Transfer from the Neon Console

You can transfer individual projects by selecting each project to transfer from your personal account, or you can transfer in bulk by starting from the destination Organization.

### Transfer a single project

Make sure you're in your personal account. Find the project you want to transfer, then start the Transfer from under projects settings.

![transfer single project](/docs/manage/transfer_single.gif)

### Transfer projects in bulk

Navigate to the Organization you want to import projects into. In the **Billing** section, find **Transfer projects** in the list of "Get Started with your paid plan" actions. From this action, you can choose the projects you want to transfer &#8212; either all of them or a selection. The list of available projects is taken from existing projects in your personal account.

![transfer projects in bulk](/docs/manage/transfer_bulk.gif)

## Transfer projects via API

You can transfer projects to a destination organization using two different API endpoints, depending on your use case:

- [Transfer personal projects to an organization](#transfer-personal-projects-to-an-organization)
- [Transfer projects between organizations](#transfer-projects-between-organizations)

### Transfer personal projects to an organization

Use the [Project Transfer API](https://api-docs.neon.tech/reference/transferprojectsfromorgtoorg) to transfer projects from your personal Neon account to a specified organization account.

`POST /users/me/projects/transfer`

The API call requires both the organization ID and the project IDs that you want to transfer. Below is an example using the API in a cURL command.

```bash shoudlWrap
curl -X POST 'https://console.neon.tech/api/v2/users/me/projects/transfer' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "org_id": "org-cool-breeze-12345678",
  "project_ids": [
    "project-id-1",
    "project-id-2"
  ]
}'
```

### Example responses

Here's the response after a successful transfer:

```bash shouldWrap
{
  "status": "success",
  "message": "Projects successfully transferred from personal account to organization."
}
```

And here's a sample response showing incompatible subscription types:

```json
{
  "limits": [
    {
      "name": "subscription_type",
      "actual": "launch",
      "expected": "scale"
    }
  ],
  "error": "Transfer failed: the organization has too many projects or its plan is incompatible with the source account."
}
```

### Transfer projects between organizations

Use the Organization Transfer API to transfer projects between two specified organization accounts.

`POST /organizations/{destination_org_id}/projects/transfer`

This requires:

- Your personal API key with access to both the source and destination organizations
- **Admin** permissions in the source organization (where projects are currently located)
- At least **Member** permissions in the destination organization (where projects will be transferred to)
- Compatible billing plans between organizations (e.g., projects can move from Scale to Launch but not the other way around)

<Admonition type="note">Projects with GitHub or Vercel integrations cannot be transferred</Admonition>

**Example request**

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{destination_org_id}/projects/transfer' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
  "project_ids": [
    "project-id-1",
    "project-id-2"
  ]
}'
```

Where:

- `destination_org_id` is the organization receiving the projects
- `project_ids` is an array of up to 400 project IDs to transfer

### Response behavior

A successful transfer returns a 200 status code with an empty JSON object:

```json
{}
```

You can verify the transfer in the Neon Console or by listing the projects in the destination organization via API.

### Error responses

The API may return these errors:

- **`406`** – Transfer failed - the target organization has too many projects or its plan is incompatible with the source organization. Reduce projects or upgrade the organization.
- **`422`** – One or more of the provided project IDs have GitHub or Vercel integrations installed. Transferring integration projects is currently not supported.

## Transfer large numbers of projects

When your number of projects exceeds the Console transfer limit of 200 (or the API transfer limit of 400), you can use the following Python script to transfer projects in batches.

### How to use the script

1. **Replace placeholders**: Update the script with your actual API key and organization ID.
   - Your API key belongs to your Personal Account. See [API actions](/docs/manage/orgs-api#using-the-api-key) to learn more.
   - To find your organization ID, see [Finding your org_id](/docs/manage/orgs-api#finding-your-orgid).
1. **Run the script**: Execute the script locally to transfer projects.

The script will efficiently handle large project transfers by splitting them into manageable batches of 400 projects at a time.
<Tabs labels={["Python", "Bash"]}>

<TabItem>

```python shouldWrap
import requests

API_KEY = "your_api_key_here"
ORG_ID = "your_org_id_here"
TRANSFER_API_URL = "https://console.neon.tech/api/v2/users/me/projects/transfer"
PROJECTS_API_URL = f"https://console.neon.tech/api/v2/projects?limit=400"
HEADERS = {
"accept": "application/json",
"Authorization": f"Bearer {API_KEY}"
}

def fetch_all_projects():
   projects = []
   cursor = None

    while True:
        url = PROJECTS_API_URL
        if cursor:
            url += f"&cursor={cursor}"

        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch projects: {response.text}")

        data = response.json()
        projects.extend(data.get("projects", []))
        if len(projects) == 0:
            break

        cursor = data.get("pagination", {}).get("cursor")
        if cursor == projects[-1].get("id"):
            break

    return projects

def transfer_projects(project_ids):
   payload = {
   "project_ids": project_ids,
   "org_id": ORG_ID
   }

    response = requests.post(TRANSFER_API_URL, json=payload, headers=HEADERS)
    if response.status_code == 200:
        print(f"Successfully transferred projects: {project_ids}")
    elif response.status_code == 406:
        print("Transfer failed due to insufficient organization limits.")
    elif response.status_code == 501:
        print("Transfer failed because one or more projects have integration linked.")
    else:
        print(f"Transfer failed: {response.text}")

def main():
   all_projects = fetch_all_projects()
   print(f"Fetched {len(all_projects)} projects.")

    # Split the projects into batches of 400 for transfer
    batch_size = 400
    for i in range(0, len(all_projects), batch_size):
        batch = all_projects[i:i + batch_size]
        project_ids = [project["id"] for project in batch]
        transfer_projects(project_ids)

if _name_ == "_main_":
main()
```

</TabItem>

<TabItem>

```bash shouldWrap
#!/bin/bash

# Configuration
API_KEY="your_api_key_here"
ORG_ID="your_org_id_here"
TRANSFER_API_URL="https://console.neon.tech/api/v2/users/me/projects/transfer"
PROJECTS_API_URL="https://console.neon.tech/api/v2/projects?limit=400"
HEADERS=(-H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY")

fetch_all_projects() {
  local projects=()
  local cursor=""
  local response=""
  local data=""
  local next_cursor=""

  while true; do
    if [ -n "$cursor" ]; then
      response=$(curl -s "${HEADERS[@]}" "${PROJECTS_API_URL}&cursor=$cursor")
    else
      response=$(curl -s "${HEADERS[@]}" "$PROJECTS_API_URL")
    fi

    if [ $? -ne 0 ]; then
      echo "Failed to fetch projects: $response" >&2
      exit 1
    fi

    data=$(echo "$response" | jq '.projects')
    projects+=($(echo "$data" | jq -r '.[] | .id'))

    if [ ${#projects[@]} -eq 0 ]; then
      break
    fi

    next_cursor=$(echo "$response" | jq -r '.pagination.cursor // ""')

    # Check if we have reached the last cursor
    last_project_id="${projects[${#projects[@]} - 1]]}"
    if [ -z "$next_cursor" ] || [ "$next_cursor" == "$last_project_id" ]; then
      break
    fi

    cursor=$next_cursor
  done

  echo "${projects[@]}"
}

transfer_projects() {
  local project_ids=("$@")
  local project_ids_json=$(printf '%s\n' "${project_ids[@]}" | jq -R . | jq -s)
  local payload='{"org_id": "'"${ORG_ID}"'", "project_ids": '"${project_ids_json}"'}'

  local response=$(curl -s -o /dev/stderr -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "$payload" \
    "$TRANSFER_API_URL")

  local status_code=$(echo "$response" | sed -n '$p')
  local response_body=$(echo "$response" | sed '$d')

  if [ "$status_code" == "200" ]; then
    echo "Successfully transferred projects: ${project_ids[*]}"
  elif [ "$status_code" == "406" ]; then
    echo "Transfer failed due to insufficient organization limits."
  elif [ "$status_code" == "501" ]; then
    echo "Transfer failed because one or more projects have integration linked."
  else
    echo "Transfer failed: $response_body"
  fi
}

main() {
  local all_projects=($(fetch_all_projects))
  echo "Fetched ${#all_projects[@]} projects."

  # Split projects into batches of 400 for transfer
  local batch_size=400
  for ((i = 0; i < ${#all_projects[@]}; i += batch_size)); do
    batch=("${all_projects[@]:i:batch_size}")
    transfer_projects "${batch[@]}"
  done
}

main
```

</TabItem>
</Tabs>
