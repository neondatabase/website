### Fixes & improvements

Pageserver: Added support for on-demand download of layer files from cold storage. Layer files contain the data required reconstruct any version of a data page. On-demand download enables Neon to quickly distribute data across Pageservers and recover from local Pageserver failures. This feature augments Neon's storage capability by allowing data to be transferred efficiently from cold storage to Pageservers whenever the data is needed.
