## CREATE TEXT SEARCH TEMPLATE

CREATE TEXT SEARCH TEMPLATE — define a new text search template

## Synopsis

```

CREATE TEXT SEARCH TEMPLATE name (
    [ INIT = init_function , ]
    LEXIZE = lexize_function
)
```

## Description

`CREATE TEXT SEARCH TEMPLATE` creates a new text search template. Text search templates define the functions that implement text search dictionaries. A template is not useful by itself, but must be instantiated as a dictionary to be used. The dictionary typically specifies parameters to be given to the template functions.

If a schema name is given then the text search template is created in the specified schema. Otherwise it is created in the current schema.

You must be a superuser to use `CREATE TEXT SEARCH TEMPLATE`. This restriction is made because an erroneous text search template definition could confuse or even crash the server. The reason for separating templates from dictionaries is that a template encapsulates the “unsafe” aspects of defining a dictionary. The parameters that can be set when defining a dictionary are safe for unprivileged users to set, and so creating a dictionary need not be a privileged operation.

Refer to [Chapter 12](textsearch "Chapter 12. Full Text Search") for further information.

## Parameters

* *`name`*

    The name of the text search template to be created. The name can be schema-qualified.

* *`init_function`*

    The name of the init function for the template.

* *`lexize_function`*

    The name of the lexize function for the template.

The function names can be schema-qualified if necessary. Argument types are not given, since the argument list for each type of function is predetermined. The lexize function is required, but the init function is optional.

The arguments can appear in any order, not only the one shown above.

## Compatibility

There is no `CREATE TEXT SEARCH TEMPLATE` statement in the SQL standard.

## See Also

[ALTER TEXT SEARCH TEMPLATE](sql-altertstemplate "ALTER TEXT SEARCH TEMPLATE"), [DROP TEXT SEARCH TEMPLATE](sql-droptstemplate "DROP TEXT SEARCH TEMPLATE")