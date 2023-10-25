<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              45.7. PL/Perl Event Triggers              |                                                                    |                                                |                                                       |                                                                    |
| :----------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](plperl-triggers.html "45.6. PL/Perl Triggers")  | [Up](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language") | Chapter 45. PL/Perl — Perl Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plperl-under-the-hood.html "45.8. PL/Perl Under the Hood") |

***

## 45.7. PL/Perl Event Triggers [#](#PLPERL-EVENT-TRIGGERS)

PL/Perl can be used to write event trigger functions. In an event trigger function, the hash reference `$_TD` contains information about the current trigger event. `$_TD` is a global variable, which gets a separate local value for each invocation of the trigger. The fields of the `$_TD` hash reference are:

* `$_TD->{event}`

    The name of the event the trigger is fired for.

* `$_TD->{tag}`

    The command tag for which the trigger is fired.

The return value of the trigger function is ignored.

Here is an example of an event trigger function, illustrating some of the above:

```

CREATE OR REPLACE FUNCTION perlsnitch() RETURNS event_trigger AS $$
  elog(NOTICE, "perlsnitch: " . $_TD->{event} . " " . $_TD->{tag} . " ");
$$ LANGUAGE plperl;

CREATE EVENT TRIGGER perl_a_snitch
    ON ddl_command_start
    EXECUTE FUNCTION perlsnitch();
```

***

|                                                        |                                                                    |                                                                    |
| :----------------------------------------------------- | :----------------------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](plperl-triggers.html "45.6. PL/Perl Triggers")  | [Up](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language") |  [Next](plperl-under-the-hood.html "45.8. PL/Perl Under the Hood") |
| 45.6. PL/Perl Triggers                                 |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                       45.8. PL/Perl Under the Hood |
