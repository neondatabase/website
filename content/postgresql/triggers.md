[#id](#TRIGGERS)

## Chapter 39. Triggers

**Table of Contents**

- [39.1. Overview of Trigger Behavior](trigger-definition)
- [39.2. Visibility of Data Changes](trigger-datachanges)
- [39.3. Writing Trigger Functions in C](trigger-interface)
- [39.4. A Complete Trigger Example](trigger-example)

This chapter provides general information about writing trigger functions. Trigger functions can be written in most of the available procedural languages, including PL/pgSQL ([Chapter 43](plpgsql)), PL/Tcl ([Chapter 44](pltcl)), PL/Perl ([Chapter 45](plperl)), and PL/Python ([Chapter 46](plpython)). After reading this chapter, you should consult the chapter for your favorite procedural language to find out the language-specific details of writing a trigger in it.

It is also possible to write a trigger function in C, although most people find it easier to use one of the procedural languages. It is not currently possible to write a trigger function in the plain SQL function language.
