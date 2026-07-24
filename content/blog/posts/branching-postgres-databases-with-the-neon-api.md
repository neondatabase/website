---
title: Branching Postgres databases with the Neon API
description: Use Neon API with GitHub Actions
excerpt: >-
  In this post, we’ll discuss using database branching and the Neon API from a
  CI/CD pipeline. By the end of this post, you’ll have a better understanding of
  how database branching can help you test your code and schema changes before
  deploying to production. What is a branch? A br...
date: '2022-12-07T17:43:14'
updatedOn: '2023-07-14T08:55:34'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/branching-postgres-databases-with-the-neon-api/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Branching Postgres databases with the Neon API - Neon
  description: Use Neon API with GitHub Actions
  keywords: []
  noindex: false
  ogTitle: Branching Postgres databases with the Neon API - Neon
  ogDescription: >-
    In this post, we’ll discuss using database branching and the Neon API from a
    CI/CD pipeline. By the end of this post, you’ll have a better understanding
    of how database branching can help you test your code and schema changes
    before deploying to production. What is a branch? A branch acts as an
    isolated environment […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/branching-postgres-databases-with-the-neon-api/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/branching-postgres-databases-with-the-neon-api/neon-branching-and-github-actions-1-1024x576-3fd1442f.jpg)

In this post, we’ll discuss using database branching and the Neon API from a CI/CD pipeline. By the end of this post, you’ll have a better understanding of how database branching can help you test your code and schema changes before deploying to production.

## What is a branch?

A branch acts as an isolated environment for working with your database. It is a copy-on-write clone of your data that you can modify without affecting the originating data, which allows you to integrate production data into your development environment.

Each Neon project has a root branch called main, and you can create more branches depending on your needs.

## Integrate branching into your GitHub actions

End-to-end (e2e) testing ensures that your application works as expected in a real-world environment. However, e2e testing can be challenging, especially when it involves testing with production data. This is where Neon’s database branching comes into play.

Instead of manually creating a branch from the Neon console, you can automate and extend this capability using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). This opens up a few scenarios, one of which is integrating database branching into your GitHub pipelines for testing.

With database branching, you can create and manage multiple database versions without impacting your production environment. This means you can test your application against different data sets without worrying about downtime or data loss.

One of the areas we are exploring is to use of the Neon API with GitHub Actions. We have implemented two experimental GitHub Actions: [neondatabase/create-branch-action](https://github.com/neondatabase/create-branch-action) and [neondatabase/delete-branch-action](https://github.com/neondatabase/delete-branch-action).

These actions allow you to automate creating and deleting branches with the Neon API and integrate the automation into your development workflow.

Here is an example of how you can use these actions to set up e2e testing with database branching:

1. In your repository, create a new workflow file (e.g., e2e-tests.yml) in the .github/workflows directory.
2. In the workflow file, define a new job and specify the trigger (e.g., on: push).
3. In the job, add the `neondatabase/create-branch-action` to create a new branch from your production database. Specify the required input parameters, such as the database connection string and the name of the new branch.
4. Add the steps to run your E2E tests, such as installing dependencies, building your application, and running the tests.
5. Add the `neondatabase/delete-branch-action` to delete the branch created in step 3. This ensures that the branch is removed after the tests are completed.

```bash
name: Neon Developer Days Actions Demo
run-name: e2e Testing with Neon Actions????
on: [pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/create-branch-action@beta
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          parent_branch_id: ${{ secrets.NEON_PARENT_BRANCH_ID }}
          branch_name: action_demo_branch
          api_key: ${{ secrets.NEON_API_KEY }}          username: ${{secrets.DBUSERNAME}}          Password: ${{secrets.DBPASSWORD}}       
        id: create-branch
      - run: echo project_id ${{ steps.create-branch.outputs.project_id}}
      - run: echo branch_id ${{ steps.create-branch.outputs.branch_id}}
      - uses: actions/checkout@v2
      - run: npm install
      - uses: neondatabase/delete-branch-action@beta
        with:
          project_id: ${{ steps.create-branch.outputs.project_id}}
          branch_id: ${{ steps.create-branch.outputs.branch_id}}
          api_key: ${{ secrets.NEON_API_KEY }}
```

With this setup, you can run your e2e tests against a copy of your production database, without impacting your production environment. This allows you to test your application with real-world data, and catch potential issues before they affect your users.

We are working with the developer community to improve these actions and make them suitable for production use. If you have any feedback or suggestions, please feel free to reach out to us or open an issue on GitHub.

## Summary

With database branching, Neon becomes a development tool that you can seamlessly integrate into your existing Postgres-based stack. It can be a powerful tool for e2e testing, and GitHub Actions can help you automate the process and integrate it into your development workflow.

What is your use case for branching? What would you like to see in Neon? Please email us with questions and feedback at feedback@neon.tech.

Thank you for being part of the Neon community, and we look forward to seeing what you build with Neon.
