[#id](#DOCGUIDE-TOOLSETS)

## J.2. Tool Sets [#](#DOCGUIDE-TOOLSETS)

- [J.2.1. Installation on Fedora, RHEL, and Derivatives](docguide-toolsets#DOCGUIDE-TOOLSETS-INST-FEDORA-ET-AL)
- [J.2.2. Installation on FreeBSD](docguide-toolsets#DOCGUIDE-TOOLSETS-INST-FREEBSD)
- [J.2.3. Debian Packages](docguide-toolsets#DOCGUIDE-TOOLSETS-INST-DEBIAN)
- [J.2.4. macOS](docguide-toolsets#DOCGUIDE-TOOLSETS-INST-MACOS)
- [J.2.5. Detection by `configure`](docguide-toolsets#DOCGUIDE-TOOLSETS-CONFIGURE)

The following tools are used to process the documentation. Some might be optional, as noted.

- [DocBook DTD](https://www.oasis-open.org/docbook/) [#](#DOCGUIDE-TOOLSETS-DOCBOOK-DTD)

  This is the definition of DocBook itself. We currently use version 4.5; you cannot use later or earlier versions. You need the XML variant of the DocBook DTD, not the SGML variant.

- [DocBook XSL Stylesheets](https://github.com/docbook/wiki/wiki/DocBookXslStylesheets) [#](#DOCGUIDE-TOOLSETS-DOCBOOK-XSL)

  These contain the processing instructions for converting the DocBook sources to other formats, such as HTML.

  The minimum required version is currently 1.77.0, but it is recommended to use the latest available version for best results.

- [Libxml2](http://xmlsoft.org/) for `xmllint` [#](#DOCGUIDE-TOOLSETS-LIBXML2)

  This library and the `xmllint` tool it contains are used for processing XML. Many developers will already have Libxml2 installed, because it is also used when building the PostgreSQL code. Note, however, that `xmllint` might need to be installed from a separate subpackage.

- [Libxslt](http://xmlsoft.org/XSLT/) for `xsltproc` [#](#DOCGUIDE-TOOLSETS-LIBXSLT)

  `xsltproc` is an XSLT processor, that is, a program to convert XML to other formats using XSLT stylesheets.

- [FOP](https://xmlgraphics.apache.org/fop/) [#](#DOCGUIDE-TOOLSETS-FOP)

  This is a program for converting, among other things, XML to PDF. It is needed only if you want to build the documentation in PDF format.

We have documented experience with several installation methods for the various tools that are needed to process the documentation. These will be described below. There might be some other packaged distributions for these tools. Please report package status to the documentation mailing list, and we will include that information here.

[#id](#DOCGUIDE-TOOLSETS-INST-FEDORA-ET-AL)

### J.2.1. Installation on Fedora, RHEL, and Derivatives [#](#DOCGUIDE-TOOLSETS-INST-FEDORA-ET-AL)

To install the required packages, use:

```

yum install docbook-dtds docbook-style-xsl libxslt fop
```

[#id](#DOCGUIDE-TOOLSETS-INST-FREEBSD)

### J.2.2. Installation on FreeBSD [#](#DOCGUIDE-TOOLSETS-INST-FREEBSD)

To install the required packages with `pkg`, use:

```

pkg install docbook-xml docbook-xsl libxslt fop
```

When building the documentation from the `doc` directory you'll need to use `gmake`, because the makefile provided is not suitable for FreeBSD's `make`.

[#id](#DOCGUIDE-TOOLSETS-INST-DEBIAN)

### J.2.3. Debian Packages [#](#DOCGUIDE-TOOLSETS-INST-DEBIAN)

There is a full set of packages of the documentation tools available for Debian GNU/Linux. To install, simply use:

```

apt-get install docbook-xml docbook-xsl libxml2-utils xsltproc fop
```

[#id](#DOCGUIDE-TOOLSETS-INST-MACOS)

### J.2.4. macOS [#](#DOCGUIDE-TOOLSETS-INST-MACOS)

If you use MacPorts, the following will get you set up:

```

sudo port install docbook-xml docbook-xsl-nons libxslt fop
```

If you use Homebrew, use this:

```

brew install docbook docbook-xsl libxslt fop
```

The Homebrew-supplied programs require the following environment variable to be set. For Intel based machines, use this:

```

export XML_CATALOG_FILES=/usr/local/etc/xml/catalog
```

On Apple Silicon based machines, use this:

```

export XML_CATALOG_FILES=/opt/homebrew/etc/xml/catalog
```

Without it, `xsltproc` will throw errors like this:

```

I/O error : Attempt to load network entity http://www.oasis-open.org/docbook/xml/4.5/docbookx.dtd
postgres.sgml:21: warning: failed to load external entity "http://www.oasis-open.org/docbook/xml/4.5/docbookx.dtd"
...
```

While it is possible to use the Apple-provided versions of `xmllint` and `xsltproc` instead of those from MacPorts or Homebrew, you'll still need to install the DocBook DTD and stylesheets, and set up a catalog file that points to them.

[#id](#DOCGUIDE-TOOLSETS-CONFIGURE)

### J.2.5. Detection by `configure` [#](#DOCGUIDE-TOOLSETS-CONFIGURE)

Before you can build the documentation you need to run the `configure` script, as you would when building the PostgreSQL programs themselves. Check the output near the end of the run; it should look something like this:

```

checking for xmllint... xmllint
checking for xsltproc... xsltproc
checking for fop... fop
checking for dbtoepub... dbtoepub
```

If `xmllint` or `xsltproc` is not found, you will not be able to build any of the documentation. `fop` is only needed to build the documentation in PDF format. `dbtoepub` is only needed to build the documentation in EPUB format.

If necessary, you can tell `configure` where to find these programs, for example

```

./configure ... XMLLINT=/opt/local/bin/xmllint ...
```

If you prefer to build PostgreSQL using Meson, instead run `meson setup` as described in [Section 17.4](install-meson), and then see [Section J.4](docguide-build-meson).
