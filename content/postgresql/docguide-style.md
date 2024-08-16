[#id](#DOCGUIDE-STYLE)

## J.6. Style Guide [#](#DOCGUIDE-STYLE)

- [J.6.1. Reference Pages](docguide-style#DOCGUIDE-STYLE-REF-PAGES)

[#id](#DOCGUIDE-STYLE-REF-PAGES)

### J.6.1. Reference Pages [#](#DOCGUIDE-STYLE-REF-PAGES)

Reference pages should follow a standard layout. This allows users to find the desired information more quickly, and it also encourages writers to document all relevant aspects of a command. Consistency is not only desired among PostgreSQL reference pages, but also with reference pages provided by the operating system and other packages. Hence the following guidelines have been developed. They are for the most part consistent with similar guidelines established by various operating systems.

Reference pages that describe executable commands should contain the following sections, in this order. Sections that do not apply can be omitted. Additional top-level sections should only be used in special circumstances; often that information belongs in the “Usage” section.

- Name [#](#DOCGUIDE-STYLE-REF-PAGES-NAME)

  This section is generated automatically. It contains the command name and a half-sentence summary of its functionality.

- Synopsis [#](#DOCGUIDE-STYLE-REF-PAGES-SYNOPSIS)

  This section contains the syntax diagram of the command. The synopsis should normally not list each command-line option; that is done below. Instead, list the major components of the command line, such as where input and output files go.

- Description [#](#DOCGUIDE-STYLE-REF-PAGES-DESCRIPTION)

  Several paragraphs explaining what the command does.

- Options [#](#DOCGUIDE-STYLE-REF-PAGES-OPTIONS)

  A list describing each command-line option. If there are a lot of options, subsections can be used.

- Exit Status [#](#DOCGUIDE-STYLE-REF-PAGES-EXIT-STATUS)

  If the program uses 0 for success and non-zero for failure, then you do not need to document it. If there is a meaning behind the different non-zero exit codes, list them here.

- Usage [#](#DOCGUIDE-STYLE-REF-PAGES-USAGE)

  Describe any sublanguage or run-time interface of the program. If the program is not interactive, this section can usually be omitted. Otherwise, this section is a catch-all for describing run-time features. Use subsections if appropriate.

- Environment [#](#DOCGUIDE-STYLE-REF-PAGES-ENVIRONMENT)

  List all environment variables that the program might use. Try to be complete; even seemingly trivial variables like `SHELL` might be of interest to the user.

- Files [#](#DOCGUIDE-STYLE-REF-PAGES-FILES)

  List any files that the program might access implicitly. That is, do not list input and output files that were specified on the command line, but list configuration files, etc.

- Diagnostics [#](#DOCGUIDE-STYLE-REF-PAGES-DIAGNOSTICS)

  Explain any unusual output that the program might create. Refrain from listing every possible error message. This is a lot of work and has little use in practice. But if, say, the error messages have a standard format that the user can parse, this would be the place to explain it.

- Notes [#](#DOCGUIDE-STYLE-REF-PAGES-NOTES)

  Anything that doesn't fit elsewhere, but in particular bugs, implementation flaws, security considerations, compatibility issues.

- Examples [#](#DOCGUIDE-STYLE-REF-PAGES-EXAMPLES)

  Examples

- History [#](#DOCGUIDE-STYLE-REF-PAGES-HISTORY)

  If there were some major milestones in the history of the program, they might be listed here. Usually, this section can be omitted.

- Author [#](#DOCGUIDE-STYLE-REF-PAGES-AUTHOR)

  Author (only used in the contrib section)

- See Also [#](#DOCGUIDE-STYLE-REF-PAGES-SEE-ALSO)

  Cross-references, listed in the following order: other PostgreSQL command reference pages, PostgreSQL SQL command reference pages, citation of PostgreSQL manuals, other reference pages (e.g., operating system, other packages), other documentation. Items in the same group are listed alphabetically.

Reference pages describing SQL commands should contain the following sections: Name, Synopsis, Description, Parameters, Outputs, Notes, Examples, Compatibility, History, See Also. The Parameters section is like the Options section, but there is more freedom about which clauses of the command can be listed. The Outputs section is only needed if the command returns something other than a default command-completion tag. The Compatibility section should explain to what extent this command conforms to the SQL standard(s), or to which other database system it is compatible. The See Also section of SQL commands should list SQL commands before cross-references to programs.
