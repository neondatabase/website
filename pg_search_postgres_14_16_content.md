# pg_search Extension Content for Postgres 14-16

This file contains the content that was removed from the pg_search documentation for Postgres 14-16. It will be added back to the documentation when the issue is fixed.

## TabItem Content for pg_search.md

```markdown
<TabItem>

1.  **Enable the required pg_search libraries**

    Enable the required `pg_search` library in your Neon project using the [Update project](https://api-docs.neon.tech/reference/updateproject) API. You will need your [Neon project ID](/docs/reference/glossary#project-id) and your [Neon API key](/docs/manage/api-keys). **Running this API restarts your project's computes**.

    <Admonition type="important">
    When you enable a library using the `Update project` command, you must specify **all libraries** that should remain enabled. To get a list of currently enabled libraries, run `SHOW shared_preload_libraries;` from an SQL client. The result should look something like this:

        ```sql shouldWrap
        SHOW shared_preload_libraries;
        neon,pg_stat_statements,timescaledb,pg_cron,pg_partman_bgw,rag_bge_small_en_v15,rag_jina_reranker_v1_tiny_en
        ```

    You need to add `pg_search` to the list.

    When running the `Update project` API:

    - Library names must be quoted, comma-separated, and specified in a single string, as in the example below.
    - Specify all libraries that should be enabled. If a library is not included in the `Update project` API call, it will not be enabled.
    - The `neon` and `pg_stat_statements` libraries will remain enabled whether you include them in your API call or not — they're used by a Neon system-managed database.
    - If you do not use one of the libraries enabled by default, you can exclude it from your API call. For example, if you do not use the `pgrag` extension, you can exclude its libraries (`"rag_bge_small_en_v15,rag_jina_reranker_v1_tiny_en"`).

    </Admonition>

    This API call adds the `pg_search` library to the list of currently enabled libraries.

    ```bash
    curl --request PATCH \
        --url https://console.neon.tech/api/v2/projects/<your_project_id> \
        --header 'accept: application/json' \
        --header "authorization: Bearer $NEON_API_KEY" \
        --header 'content-type: application/json' \
        --data '
    {
      "project": {
        "settings": {
          "preload_libraries": {
            "enabled_libraries": [
              "neon","pg_stat_statements","timescaledb","pg_cron","pg_partman_bgw","rag_bge_small_en_v15,rag_jina_reranker_v1_tiny_en","pg_search"
            ]
          }
        }
      }
    }
    '
    ```

1.  **Check to make sure the `pg_search` library is enabled**

    Run the following command to make sure `pg_search` was added to the list of enabled libraries.

    ```sql shouldWrap
    SHOW shared_preload_libraries;
    neon,pg_stat_statements,timescaledb,pg_cron,pg_partman_bgw,rag_bge_small_en_v15,rag_jina_reranker_v1_tiny_en,pg_search
    ```

1.  **Install the `pg_search` extension**

    Install the `pg_search` extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

    ```sql
    CREATE EXTENSION IF NOT EXISTS pg_search;
    ```

</TabItem>
```

## Changelog Entry for 2025-04-25.md

```markdown
## pg_search extension now available on Postgres 14, 15, and 16

We've updated the `pg_search` extension to version 0.15.16 and expanded support to Postgres 14, 15, and 16 (previously only available on Postgres 17). This powerful full-text search extension enables you to implement advanced search capabilities in your applications with minimal configuration.

To use `pg_search`, you'll need to load the required libraries with a simple Update project API call before installing the extension. Detailed instructions are available in our documentation: [Enable the pg_search extension](/docs/extensions/pg_search#enable-the-pgsearch-extension).

For more information and guidance, check out our guides:

- [The pg_search extension](/docs/extensions/pg_search)
- [Comparing Text Search Strategies: pg_search vs. tsvector vs. External Engines](/guides/pg-search-vs-tsvector)
- [Building an End-to-End Full-Text Search Experience With pg_search on Neon](/guides/pg-search)
```

## pg-extensions.md Table Entry

```markdown
|| [pg_search](/docs/extensions/pg_search)                                                          | 0.15.14 | 0.15.14 | 0.15.14 | 0.15.14 | Install with `CREATE EXTENSION pg_search;` on Postgres 17.                                                                                                                                                                                                                                                                                                                                                                                                    |
```

## roadmap.md Entry

```markdown
- **Support for [pg_search](https://neon.tech/docs/extensions/pg_search)**: We partnered with [ParadeDB](https://www.paradedb.com/) to bring `pg_search` to Neon, delivering up to 1,000x faster full-text search inside Postgres on versions 14, 15, and 16. [Read the announcement](https://neon.tech/blog/pgsearch-on-neon).
```
