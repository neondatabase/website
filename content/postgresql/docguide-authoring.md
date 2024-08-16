[#id](#DOCGUIDE-AUTHORING)

## J.5. Documentation Authoring [#](#DOCGUIDE-AUTHORING)

- [J.5.1. Emacs](docguide-authoring#DOCGUIDE-AUTHORING-EMACS)

The documentation sources are most conveniently modified with an editor that has a mode for editing XML, and even more so if it has some awareness of XML schema languages so that it can know about DocBook syntax specifically.

Note that for historical reasons the documentation source files are named with an extension `.sgml` even though they are now XML files. So you might need to adjust your editor configuration to set the correct mode.

[#id](#DOCGUIDE-AUTHORING-EMACS)

### J.5.1. Emacs [#](#DOCGUIDE-AUTHORING-EMACS)

nXML Mode, which ships with Emacs, is the most common mode for editing XML documents with Emacs. It will allow you to use Emacs to insert tags and check markup consistency, and it supports DocBook out of the box. Check the [nXML manual](https://www.gnu.org/software/emacs/manual/html_mono/nxml-mode.html) for detailed documentation.

`src/tools/editors/emacs.samples` contains recommended settings for this mode.
