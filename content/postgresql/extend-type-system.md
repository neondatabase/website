[#id](#EXTEND-TYPE-SYSTEM)

## 38.2. The PostgreSQL Type System [#](#EXTEND-TYPE-SYSTEM)

- [38.2.1. Base Types](extend-type-system#EXTEND-TYPE-SYSTEM-BASE)
- [38.2.2. Container Types](extend-type-system#EXTEND-TYPE-SYSTEM-CONTAINER)
- [38.2.3. Domains](extend-type-system#EXTEND-TYPE-SYSTEM-DOMAINS)
- [38.2.4. Pseudo-Types](extend-type-system#EXTEND-TYPE-SYSTEM-PSEUDO)
- [38.2.5. Polymorphic Types](extend-type-system#EXTEND-TYPES-POLYMORPHIC)

PostgreSQL data types can be divided into base types, container types, domains, and pseudo-types.

[#id](#EXTEND-TYPE-SYSTEM-BASE)

### 38.2.1. Base Types [#](#EXTEND-TYPE-SYSTEM-BASE)

Base types are those, like `integer`, that are implemented below the level of the SQL language (typically in a low-level language such as C). They generally correspond to what are often known as abstract data types. PostgreSQL can only operate on such types through functions provided by the user and only understands the behavior of such types to the extent that the user describes them. The built-in base types are described in [Chapter 8](datatype).

Enumerated (enum) types can be considered as a subcategory of base types. The main difference is that they can be created using just SQL commands, without any low-level programming. Refer to [Section 8.7](datatype-enum) for more information.

[#id](#EXTEND-TYPE-SYSTEM-CONTAINER)

### 38.2.2. Container Types [#](#EXTEND-TYPE-SYSTEM-CONTAINER)

PostgreSQL has three kinds of “container” types, which are types that contain multiple values of other types. These are arrays, composites, and ranges.

Arrays can hold multiple values that are all of the same type. An array type is automatically created for each base type, composite type, range type, and domain type. But there are no arrays of arrays. So far as the type system is concerned, multi-dimensional arrays are the same as one-dimensional arrays. Refer to [Section 8.15](arrays) for more information.

Composite types, or row types, are created whenever the user creates a table. It is also possible to use [CREATE TYPE](sql-createtype) to define a “stand-alone” composite type with no associated table. A composite type is simply a list of types with associated field names. A value of a composite type is a row or record of field values. Refer to [Section 8.16](rowtypes) for more information.

A range type can hold two values of the same type, which are the lower and upper bounds of the range. Range types are user-created, although a few built-in ones exist. Refer to [Section 8.17](rangetypes) for more information.

[#id](#EXTEND-TYPE-SYSTEM-DOMAINS)

### 38.2.3. Domains [#](#EXTEND-TYPE-SYSTEM-DOMAINS)

A domain is based on a particular underlying type and for many purposes is interchangeable with its underlying type. However, a domain can have constraints that restrict its valid values to a subset of what the underlying type would allow. Domains are created using the SQL command [CREATE DOMAIN](sql-createdomain). Refer to [Section 8.18](domains) for more information.

[#id](#EXTEND-TYPE-SYSTEM-PSEUDO)

### 38.2.4. Pseudo-Types [#](#EXTEND-TYPE-SYSTEM-PSEUDO)

There are a few “pseudo-types” for special purposes. Pseudo-types cannot appear as columns of tables or components of container types, but they can be used to declare the argument and result types of functions. This provides a mechanism within the type system to identify special classes of functions. [Table 8.27](datatype-pseudo#DATATYPE-PSEUDOTYPES-TABLE) lists the existing pseudo-types.

[#id](#EXTEND-TYPES-POLYMORPHIC)

### 38.2.5. Polymorphic Types [#](#EXTEND-TYPES-POLYMORPHIC)

Some pseudo-types of special interest are the _polymorphic types_, which are used to declare _polymorphic functions_. This powerful feature allows a single function definition to operate on many different data types, with the specific data type(s) being determined by the data types actually passed to it in a particular call. The polymorphic types are shown in [Table 38.1](extend-type-system#EXTEND-TYPES-POLYMORPHIC-TABLE). Some examples of their use appear in [Section 38.5.11](xfunc-sql#XFUNC-SQL-POLYMORPHIC-FUNCTIONS).

[#id](#EXTEND-TYPES-POLYMORPHIC-TABLE)

**Table 38.1. Polymorphic Types**

| Name                      | Family | Description                                                                                                                      |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `anyelement`              | Simple | Indicates that a function accepts any data type                                                                                  |
| `anyarray`                | Simple | Indicates that a function accepts any array data type                                                                            |
| `anynonarray`             | Simple | Indicates that a function accepts any non-array data type                                                                        |
| `anyenum`                 | Simple | Indicates that a function accepts any enum data type (see [Section 8.7](datatype-enum))                                          |
| `anyrange`                | Simple | Indicates that a function accepts any range data type (see [Section 8.17](rangetypes))                                           |
| `anymultirange`           | Simple | Indicates that a function accepts any multirange data type (see [Section 8.17](rangetypes))                                      |
| `anycompatible`           | Common | Indicates that a function accepts any data type, with automatic promotion of multiple arguments to a common data type            |
| `anycompatiblearray`      | Common | Indicates that a function accepts any array data type, with automatic promotion of multiple arguments to a common data type      |
| `anycompatiblenonarray`   | Common | Indicates that a function accepts any non-array data type, with automatic promotion of multiple arguments to a common data type  |
| `anycompatiblerange`      | Common | Indicates that a function accepts any range data type, with automatic promotion of multiple arguments to a common data type      |
| `anycompatiblemultirange` | Common | Indicates that a function accepts any multirange data type, with automatic promotion of multiple arguments to a common data type |

Polymorphic arguments and results are tied to each other and are resolved to specific data types when a query calling a polymorphic function is parsed. When there is more than one polymorphic argument, the actual data types of the input values must match up as described below. If the function's result type is polymorphic, or it has output parameters of polymorphic types, the types of those results are deduced from the actual types of the polymorphic inputs as described below.

For the “simple” family of polymorphic types, the matching and deduction rules work like this:

Each position (either argument or return value) declared as `anyelement` is allowed to have any specific actual data type, but in any given call they must all be the _same_ actual type. Each position declared as `anyarray` can have any array data type, but similarly they must all be the same type. And similarly, positions declared as `anyrange` must all be the same range type. Likewise for `anymultirange`.

Furthermore, if there are positions declared `anyarray` and others declared `anyelement`, the actual array type in the `anyarray` positions must be an array whose elements are the same type appearing in the `anyelement` positions. `anynonarray` is treated exactly the same as `anyelement`, but adds the additional constraint that the actual type must not be an array type. `anyenum` is treated exactly the same as `anyelement`, but adds the additional constraint that the actual type must be an enum type.

Similarly, if there are positions declared `anyrange` and others declared `anyelement` or `anyarray`, the actual range type in the `anyrange` positions must be a range whose subtype is the same type appearing in the `anyelement` positions and the same as the element type of the `anyarray` positions. If there are positions declared `anymultirange`, their actual multirange type must contain ranges matching parameters declared `anyrange` and base elements matching parameters declared `anyelement` and `anyarray`.

Thus, when more than one argument position is declared with a polymorphic type, the net effect is that only certain combinations of actual argument types are allowed. For example, a function declared as `equal(anyelement, anyelement)` will take any two input values, so long as they are of the same data type.

When the return value of a function is declared as a polymorphic type, there must be at least one argument position that is also polymorphic, and the actual data type(s) supplied for the polymorphic arguments determine the actual result type for that call. For example, if there were not already an array subscripting mechanism, one could define a function that implements subscripting as `subscript(anyarray, integer) returns anyelement`. This declaration constrains the actual first argument to be an array type, and allows the parser to infer the correct result type from the actual first argument's type. Another example is that a function declared as `f(anyarray) returns anyenum` will only accept arrays of enum types.

In most cases, the parser can infer the actual data type for a polymorphic result type from arguments that are of a different polymorphic type in the same family; for example `anyarray` can be deduced from `anyelement` or vice versa. An exception is that a polymorphic result of type `anyrange` requires an argument of type `anyrange`; it cannot be deduced from `anyarray` or `anyelement` arguments. This is because there could be multiple range types with the same subtype.

Note that `anynonarray` and `anyenum` do not represent separate type variables; they are the same type as `anyelement`, just with an additional constraint. For example, declaring a function as `f(anyelement, anyenum)` is equivalent to declaring it as `f(anyenum, anyenum)`: both actual arguments have to be the same enum type.

For the “common” family of polymorphic types, the matching and deduction rules work approximately the same as for the “simple” family, with one major difference: the actual types of the arguments need not be identical, so long as they can be implicitly cast to a single common type. The common type is selected following the same rules as for `UNION` and related constructs (see [Section 10.5](typeconv-union-case)). Selection of the common type considers the actual types of `anycompatible` and `anycompatiblenonarray` inputs, the array element types of `anycompatiblearray` inputs, the range subtypes of `anycompatiblerange` inputs, and the multirange subtypes of `anycompatiblemultirange` inputs. If `anycompatiblenonarray` is present then the common type is required to be a non-array type. Once a common type is identified, arguments in `anycompatible` and `anycompatiblenonarray` positions are automatically cast to that type, and arguments in `anycompatiblearray` positions are automatically cast to the array type for that type.

Since there is no way to select a range type knowing only its subtype, use of `anycompatiblerange` and/or `anycompatiblemultirange` requires that all arguments declared with that type have the same actual range and/or multirange type, and that that type's subtype agree with the selected common type, so that no casting of the range values is required. As with `anyrange` and `anymultirange`, use of `anycompatiblerange` and `anymultirange` as a function result type requires that there be an `anycompatiblerange` or `anycompatiblemultirange` argument.

Notice that there is no `anycompatibleenum` type. Such a type would not be very useful, since there normally are not any implicit casts to enum types, meaning that there would be no way to resolve a common type for dissimilar enum inputs.

The “simple” and “common” polymorphic families represent two independent sets of type variables. Consider for example

```

CREATE FUNCTION myfunc(a anyelement, b anyelement,
                       c anycompatible, d anycompatible)
RETURNS anycompatible AS ...
```

In an actual call of this function, the first two inputs must have exactly the same type. The last two inputs must be promotable to a common type, but this type need not have anything to do with the type of the first two inputs. The result will have the common type of the last two inputs.

A variadic function (one taking a variable number of arguments, as in [Section 38.5.6](xfunc-sql#XFUNC-SQL-VARIADIC-FUNCTIONS)) can be polymorphic: this is accomplished by declaring its last parameter as `VARIADIC` `anyarray` or `VARIADIC` `anycompatiblearray`. For purposes of argument matching and determining the actual result type, such a function behaves the same as if you had written the appropriate number of `anynonarray` or `anycompatiblenonarray` parameters.
