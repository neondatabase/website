[#id](#EXTERNAL-EXTENSIONS)

## H.4. Extensions [#](#EXTERNAL-EXTENSIONS)

PostgreSQL is designed to be easily extensible. For this reason, extensions loaded into the database can function just like features that are built in. The `contrib/` directory shipped with the source code contains several extensions, which are described in [Appendix F](contrib). Other extensions are developed independently, like [PostGIS](https://postgis.net/). Even PostgreSQL replication solutions can be developed externally. For example, [Slony-I](https://www.slony.info) is a popular primary/standby replication solution that is developed independently from the core project.
