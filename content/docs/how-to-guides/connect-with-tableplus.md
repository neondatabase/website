---
title: Connect with TablePlus
---

To connect with TablePlus, the project name needs to be specified as an option in the
database name field.

    dbname=main options=project=<project name>

For example:

![Screenshot of TablePlus connection dialog](/docs-images/TablePlus-screenshot.png)

This syntax takes advantage of libpq's feature of expanding the
database name to different options. Because the current version of
TablePlus is built with an older version of the libpq library, the
hostname is not passed to the server automatically, so it needs to
be given as an explicit option. See
<https://github.com/TablePlus/TablePlus-Linux/issues/150>
