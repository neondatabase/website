[#id](#PLPERL)

## Chapter 45. PL/Perl — Perl Procedural Language

**Table of Contents**

- [45.1. PL/Perl Functions and Arguments](plperl-funcs)
- [45.2. Data Values in PL/Perl](plperl-data)
- [45.3. Built-in Functions](plperl-builtins)

  - [45.3.1. Database Access from PL/Perl](plperl-builtins#PLPERL-DATABASE)
  - [45.3.2. Utility Functions in PL/Perl](plperl-builtins#PLPERL-UTILITY-FUNCTIONS)

- [45.4. Global Values in PL/Perl](plperl-global)
- [45.5. Trusted and Untrusted PL/Perl](plperl-trusted)
- [45.6. PL/Perl Triggers](plperl-triggers)
- [45.7. PL/Perl Event Triggers](plperl-event-triggers)
- [45.8. PL/Perl Under the Hood](plperl-under-the-hood)

  - [45.8.1. Configuration](plperl-under-the-hood#PLPERL-CONFIG)
  - [45.8.2. Limitations and Missing Features](plperl-under-the-hood#PLPERL-MISSING)

PL/Perl is a loadable procedural language that enables you to write PostgreSQL functions and procedures in the [Perl programming language](https://www.perl.org).

The main advantage to using PL/Perl is that this allows use, within stored functions and procedures, of the manyfold “string munging” operators and functions available for Perl. Parsing complex strings might be easier using Perl than it is with the string functions and control structures provided in PL/pgSQL.

To install PL/Perl in a particular database, use `CREATE EXTENSION plperl`.

### Tip

If a language is installed into `template1`, all subsequently created databases will have the language installed automatically.

### Note

Users of source packages must specially enable the build of PL/Perl during the installation process. (Refer to [Chapter 17](installation) for more information.) Users of binary packages might find PL/Perl in a separate subpackage.
