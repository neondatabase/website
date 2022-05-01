### Getting Started with Hasura

Hasura is a cloud-based GraphQL provider for existing databases. This guide will cover zero-coding integration between Neon cloud service and Hasura Cloud. By the end of this guide, we will have a working HTTP API endpoint that uses GraphQL to query our serverless database and responds with a set of rows.

First, let us set up a Neon project:

1. Go to the Neon console <https://console.neon.tech/app/projects>.
2. Create a new Project or use any existing one.
3. Open the Project page and click the 'Generate token' button.
4. Copy DATABASE_URL. We will need it later.

Second, add this Project as a data source in the Hasura Cloud project:

1. Go to the Hasura Cloud projects list <https://cloud.hasura.io/projects>.
2. Create a new project or launch a console for the existing one.
3. Go to the DATA section, and in the 'Connect Existing Database' tab, paste DATABASE_URL into the corresponding form field. Give it some name and click connect.
4. That is mostly it! Hasura Cloud will connect and automatically discover the public schema. While Neon will spin up a new compute node for your database when any new connection arrives and suspend it when it is idle.

Now we can create the first table using the Hasura Console web interface. Let it be table 't' with a single column 'text' of a type 'Text'. Once created, you can put some rows into it and finally navigate to the API section for endpoint creation. In the GraphQL tab, we can query our table with GraphQL, for example:

```graphql
query MyQuery {
  t {
    text
  }
}
```

Save this GraphQL query as an HTTP API endpoint by clicking the REST tab. Let us call the endpoint 'query_t'.

Finally, you can use this endpoint to get the table content now. For example, that is how it works from the shell:

```bash
$ curl -H 'x-hasura-admin-secret: {admin_secret}' https://{your_project_name}.hasura.app/api/rest/query_t
{"t":[{"text":"test"}]}
```

Thanks for your time, and keep hacking!

