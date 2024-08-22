---
title: Transfer projects to an organization
enableTableOfContents: true
---

<EarlyAccess/>

When creating an organization as an Admin &#8212; or as a member of an organization that's already up and running &#8212; you may need to transfer existing projects from your personal account to your target organization.

## Guidelines

The Neon Console allows you to transfer projects up to 200 projects at a time, while the API supports up to 400 projects in a single operation. If you need to transfer more than 200 projects, our [Python script](#transfer-large-numbers-of-projects) can help you efficiently manage this one-time​ task.

A few important points to keep in mind:

- You must be at least a Member of the selected Organization to transfer projects to it.
- The number of projects you can transfer is limited by the target Organization plan's allowance.
- Projects can't be transferred between incompatible plans due to differences in usage allowances. For example, attempting to transfer projects from a Scale plan personal account to a Launch plan Organization will result in an error.

## Transfer from the Neon Console

You can transfer individual projects by selecting each project to transfer from your personal account, or you can transfer in bulk by starting from the destination Organization.

### Transfer a single project

Make sure you're in your personal account. Find the project you want to transfer, then start the Transfer from under projects settings.

![transfer single project](/docs/manage/transfer_single.gif)

### Transfer projects in bulk

Navigate to the Organization you want to import projects into. In the **Billing** section, find **Transfer projects** in the list of "Get Started with your paid plan" actions. From this action, you can choose the projects you want to transfer &#8212; either all of them or a selection. The available projects are listed from your personal account.

![transfer projects in bulk](/docs/manage/transfer_bulk.gif)

## Transfer projects via API

Use the Project Transfer API to transfer projects from your personal Neon account to a specified organization account.

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

## Transfer large numbers of projects

When your number of projects exceeds the Console transfer limit of 200 (or the API transfer limit of 400), you can use the following Python script to transfer projects in batches.

### How to use the script

1. **Replace placeholders**: Update the script with your actual API key and organization ID.
   - Your API key belongs to your Personal Account. See [API actions](/docs/manage/orgs-api#using-the-api-key) to learn more.
   - To find your organization ID, see [Finding your org_id](/docs/manage/orgs-api#finding-your-orgid).
2. **Set up your environment**: Ensure Python is installed, along with the `requests` library (`pip install requests`).
3. **Run the script**: Execute the script locally to transfer projects.

The script will efficiently handle large project transfers by splitting them into manageable batches of 400 projects at a time.

```python
import requests

# Configuration
API_KEY = "your_api_key_here"
ORG_ID = "org-dry-haze-00120778"
TRANSFER_API_URL = "https://console.neon.tech/api/v2/users/me/projects/transfer"
PROJECTS_API_URL = f"https://console.neon.tech/api/v2/projects?limit=10&org_id={ORG_ID}"
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

        cursor = data.get("next_cursor")
        if not cursor:
            break

    return projects

def transfer_projects(project_ids):
    payload = {
        "project_ids": project_ids,
        "destination_org_id": ORG_ID
    }

    response = requests.post(TRANSFER_API_URL, json=payload, headers=HEADERS)
    if response.status_code == 200:
        print(f"Successfully transferred projects: {project_ids}")
    elif response.status_code == 406:
        print("Transfer failed due to insufficient organization limits.")
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

if __name__ == "__main__":
    main()
```
