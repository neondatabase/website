---
title: Deploy a Next.js app with Prisma and Vercel
enableTableOfContents: true
---

This guide describes how to setup and deploy a Next.js application on Vercel that creates a database branch in Neon for each Preview Deployment. Schema changes are managed using Prisma.

The example application is called NatureSnap. It is a simple photo gallery application for viewing nature photos. The application only displays photographs. The example shows how to modify the application to also display the name of the photographer, demonstrating how you can use Neon integration with Vercel to create a database branch for each preview deployment.

## Prerequsites

- A Vercel account
- A GitHub account
- Prisma

## Download the example application and install dependencies

Download the example NatureSnap application and install dependencies.

## Initialize a Git repository and push the application code to GitHub

## Deploy the application on Vercel

## Create a project in Neon

- call it NatureSnap
- create it in Frankfurt (?)

## Prepare your Neon project

### Create a database user

Create a database user that will be used by the application to access the application database. Name the user `naturesnap`.

### Create an application database

Create a database for the application. Name the database `naturesnap`.

### Create a shadow database for Prisma Migrate

Create a shadow database for Prisma MIgrate, which is required to manage schema changes. Name the database `shadow`.

## Import the application data

Import data for the NatureSnap application.

### Verify that data was imported

Verify that the data was imported by viewing the data from the Neon Console.

## Add the Neon Integration to your Vercel account

Add the Neon-Vercel integration.

### View the results of the integration

View the results of the integration in Neon and Vercel

## Set the shadow database and development environment variables

couple of small things to really get me going in dev
populate the shadow database url for prisma migrations

now i’m set to developer locally
let’s check the env variables that i have locally
these will need to be updated, so i’ll just pull the new set of env variables from vercel
the app can run locally now and i use new neon branch here!

## Update the application and database locally

create a new branch
Add new feature and table: i want to map the users of my app to the topics they participated in
modify the UI & update the prisma schema

### Inspect the changes

Check what I changed
I maped users to the topics they participated in
I added UI elements and changed the schema

## Generate migration

Generate the migration based on the updated schema
Behind the scenes, I actually add data into the new table
From the photo authors, I can infer some first users to topics connections and add them right away


## Conclusion

Now it runs locally
The new small icons on the list of topics are topic participants, the data that i’ve added
The app now shows in black/white, the topics that i haven’t participated in 

Time to commit the changes!
just a quick check before i do that
all good, ready to push this new branch to git

my branch is on now github

Vercel picks it up
notifies Neon
neon picked this up and created a new database branch for my preview, add user topics!

In Vercel, Neon has pushed the new DATABASE_URL variable to the Vercel preview environment variables, specific to my new branch

Vercel is building
Deployed

and this runs my migrations and seed the data as part of them too
