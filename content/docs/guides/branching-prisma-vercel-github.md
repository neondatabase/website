---
title: Database Branching with Neon, Vercel, Prisma and GitHub Actions
subtitle: Create isolated databases for every pull request using Neon branching
enableTableOfContents: true
updatedOn: '2024-03-06T10:15:00.000Z'
---

Neon offers a unique branching feature that allows you to create isolated copies of your database in seconds, regardless of its size. It is particularly useful when working with preview environments, since you can create a separate database for each environment. This ensures your changes are still tested against real production data, while changes made in one preview do not affect others. 

In this guide, we'll walk through setting up a database branching workflow using Neon, Vercel, and GitHub Actions. We'll create a sample Next.js application that uses Prisma ORM to interact with the database and deploy it to Vercel. We'll also set up a GitHub Actions workflow to automatically create a new Neon branch for each pull request and delete it when the pull request is closed.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A [Vercel](https://vercel.com) account for deploying the sample application. 
- A [GitHub](https://github.com) account for hosting the project repository and setting up the Actions workflow. 

The full workflow involves interaction with all three services, so there are a number of tokens/connection parameters to track. Create two separate files in the project root directory to store these variables. Make sure they are not **tracked** by git.

1. A `.secrets` file. We'll upload them to the Github repository, so Github Actions can access them. 
2. An `.env` file. We need the Neon database connection strings to run initial setup commands, and create migration files.

## Retrieve your Neon database connection string and other parameters

Navigate to the **Connection Details** on the Neon **Project Dashboard** to find your database connection string. Toggle the `Pooled Connection` checkbox to get a pooled connection string for your Neon database, which is useful in serverless environments like Vercel. 

```bash
DATABASE_URL=POOLED_NEON_DATABASE_CONNECTION_STRING
```

### Retrieve other Neon parameters

For the branching step, the Github Action step needs a few more parameters that we will add to the `.secrets` file:

1. From the database connection string collected in the previous step, extract the username. It is the part following `postgres://` and before the first `:`. Save it to `.secrets` as the variable `NEON_DATABASE_USERNAME`. 

    This username will be used to query the available projects/branches in your Neon account.

2. Navigate to the project page in your Neon console, and click on `Overview` in the sidebard under the `Branches` section. Copy the `ID` listed for the `main` branch and save it to `.secrets` as the variable `NEON_PROJECT_ID`. 

    We will use this ID to create new branches with the main branch as the base. 

3. From your Neon console, navigate through `[Profile Icon] > Account Settings > API Keys`. Create a new API key and save it to `.secrets` as the variable `NEON_API_KEY`. 

    This key will be used to authenticate the Github Action step that creates new branches in our Neon project.

## Setting up the Next.js Application

### Fork the example project and clone it

We've created a small Next.js-Prisma application that fetches and displays a list of atomic elements from the database. To run it with your Vercel/GitHub account, fork the [project repository](https://github.com/neondatabase/guide-branching-prisma-vercel-github/).

Now, to set up the project on your local system, clone the forked repository:

```bash
git clone https://github.com/[YOUR_GITHUB_USERNAME]/guide-branching-prisma-vercel-github.git
cd guide-branching-prisma-vercel-github && npm install
```

### Run Prisma migrations

This project defines a simple `Element` model with `id`, `elementName`, `atomicNumber`, and `symbol` fields.

```prisma
model Element {
  @@map("elements")
  id           Int    @id @default(autoincrement())
  elementName  String @map("element_name")
  atomicNumber Int    @map("atomic_number") @unique
  symbol       String
}
```


Run the setup script so Prisma can execute the initial migrations and add seed data to the table:

```bash
npm run setup
```

### Test the local development server

This app has a single page component that fetches the list of elements from the database and displays them. 

Start the development server and navigate to `http://localhost:3000` in your browser to verify that it works:

```bash
npm run dev
```

## Setting up Vercel Deployment

### Create new project and deploy the application

Log in to your Vercel account and navigate to the Vercel dashboard. Click on the `Add New` button to create a new project. When asked to import a Git repository, select the forked repository from your GitHub account. 

Next, you need to configure the project before Vercel can deploy it. 

1. Add the `DATABASE_URL` variable defined in your local `.env` file to the `Environment variables` section in the form.

2. Under `Build and Output Settings`, toggle `override` for the `Build command` setting and replace it with `prisma generate && next build`. 

Click on the `Deploy` button to deploy the current application to Vercel.

### Further Vercel configuration

After the deployment is complete, navigate to the `Settings` tab in the Vercel dashboard for your project. Click on `Git` in the sidebar and under the `Ignored Build Step` section, select the `Behavior` to be `Only build production`. Then, click `Save`.

This is needed because our Github Action workflow will handle the preview deployments, and we don't want Vercel to build the project for every pull request. 

### Fetch a Vercel API token

Navigate to the `Account Settings` section in your Vercel dashboard and click on the `Tokens` tab. Create a new token with full account scope and save it to the `.secrets` file as the variable `VERCEL_TOKEN`. 

This token will be used by the Github Action workflow to deploy the preview environments for each pull request to Vercel. 

## Setting up GitHub Actions Workflow

This project uses GitHub Actions to create/delete Neon branches for each pull request and automate the deployment of preview environments to Vercel. The workflow scripts are already present in the project repository, so you only need to set up the required secrets in the GitHub repository settings. 

### Create a Github personal access token

Navigate to the `Settings` section in your GitHub account and click on the `Developer settings` tab. Click on the `Personal access tokens` section and create a new token with the `repo` scope. Make sure it has all the necessary permissions to create branches and pull requests in your repository. 

Save this token to the `.secrets` file as the variable `GH_TOKEN`. 

### Set up the Repository secrets

From your Github repository page, navigate to the `Settings` tab and select `Security > Secrets and Variables > Actions`. 

Add all the secrets from the `.secrets` file to the repository secrets:

- `NEON_PROJECT_ID`: The Neon project ID.
- `NEON_DATABASE_USERNAME`: The username from the Neon database connection string.
- `NEON_API_KEY`: The API key obtained from the Neon account. 
- `DATABASE_URL`: The pooled connection string to the Neon database.
- `VERCEL_TOKEN`: The API key created from your Vercel dashboard. 
- `GH_TOKEN`: The personal access token created from your GitHub account.

Now, we are good to go! 

### Github Action steps

The project repository contains Github Action workflows that create and delete Neon branches for each pull request and deploy preview environments to Vercel. 

1. `deploy-preview.yml`: This workflow is triggered whenever a pull request is opened or updated. It creates a new Neon branch using the `neondatabase/create-branch-action`, deploys the application to a Vercel preview environment, and runs the database migrations against the newly created Neon branch.

2. `cleanup-preview.yml`: This workflow is triggered when a pull request is closed. It deletes the Neon preview branch associated with the pull request, using the `neondatabase/delete-branch-action`. 

3. `deploy-production.yml`: This workflow is triggered when changes are merged into the main branch. It runs the prisma migrations against the `main` branch of the Neon project, and deploys the application to the production environment on Vercel.

## Testing the Workflow

We will make a small change to the data schema and test the workflow by creating a new branch, opening a pull request, and verifying the preview deployment on Vercel. 

### Make changes to the application

Navigate to the `prisma/schema.prisma` file in the project repository and add a new `atomicMass` field to the `Element` model:

```prisma
model Element {
  @@map("elements")
  id           Int    @id @default(autoincrement())
  elementName  String @map("element_name")
  atomicNumber Int    @map("atomic_number") @unique
  symbol       String
  atomicMass   Float  @map("atomic_mass") @default(0)  
}
```

Also update the `app/page.js` file to display the new field:

```jsx
# app/page.js

...

export default async function ElementList() {
  const elements = await getElements();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Elements</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Atomic Number</th>
            <th className="px-4 py-2">Atomic Mass</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((element) => (
            <tr key={element.id}>
              <td className="border px-4 py-2 text-center">
                {element.elementName}
              </td>
              <td className="border px-4 py-2 text-center">{element.symbol}</td>
              <td className="border px-4 py-2 text-center">
                {element.atomicNumber}
              </td>
              <td className="border px-4 py-2 text-center">
                {element.atomicMass}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Generate Prisma migrations

Run the following commands in your terminal:

```bash
npx prisma migrate dev --name add_mass --create-only
npx prisma generate
```

Note the `create-only` flag is necessary since we don't want to run the migrations against the main branch. This step just creates the migration file, while the Github Action workflow will run the migrations against the preview branch. 

### Create a new branch and open a pull request

Create a new branch in your repository and push the changes to the branch:

```bash
git checkout -b feature/add-mass
git add . && git commit -m "Add atomic mass field to Element model"
git push origin feature/add-mass
```

Navigate to your repository on GitHub and open a new pull request for the `feature/add-mass` branch. This will trigger the `deploy-preview` workflow, creating a new Neon branch and deploying a preview environment on Vercel. 

To test the preview deployment, click on the `Details` link in the pull request to access the preview environment URL. Verify that the changes are working as expected. 

You can also visit your Neon project dashboard to see the newly created branch. 

### Close the pull request

Once you're done testing, close the pull request. This will trigger the `cleanup-preview` workflow, deleting the associated Neon preview branch. 

## Conclusion

In this guide, we demonstrated how to set up a database branching workflow using Neon, Vercel, and GitHub Actions. By leveraging Neon's branching feature, you can create isolated databases for each preview environment, ensuring that changes made in one preview do not affect others.

While this guide used Next.js and Prisma, the same workflow can be adapted to work with other frameworks and ORMs. The key components are:

1. Creating a new Neon branch for each preview environment.
2. Deploying the application to a preview environment (in this case, using Vercel).
3. Running database migrations against the preview branch.
4. Deleting the preview branch when the associated pull request is closed.

By following this workflow, you can streamline your development process and ensure that your preview environments are always in sync with your database changes.

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Prisma Documentation](https://www.prisma.io/docs)

<NeedHelp/>