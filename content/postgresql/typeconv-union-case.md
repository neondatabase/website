[#id](#TYPECONV-UNION-CASE)

## 10.5. `UNION`, `CASE`, and Related Constructs [#](#TYPECONV-UNION-CASE)

SQL `UNION` constructs must match up possibly dissimilar types to become a single result set. The resolution algorithm is applied separately to each output column of a union query. The `INTERSECT` and `EXCEPT` constructs resolve dissimilar types in the same way as `UNION`. Some other constructs, including `CASE`, `ARRAY`, `VALUES`, and the `GREATEST` and `LEAST` functions, use the identical algorithm to match up their component expressions and select a result data type.

[#id](#id-1.5.9.10.9)

**Type Resolution for `UNION`, `CASE`, and Related Constructs**

1. If all inputs are of the same type, and it is not `unknown`, resolve as that type.

2. If any input is of a domain type, treat it as being of the domain's base type for all subsequent steps. [\[12\]](#ftn.id-1.5.9.10.9.3.1.1)

3. If all inputs are of type `unknown`, resolve as type `text` (the preferred type of the string category). Otherwise, `unknown` inputs are ignored for the purposes of the remaining rules.

4. If the non-unknown inputs are not all of the same type category, fail.

5. Select the first non-unknown input type as the candidate type, then consider each other non-unknown input type, left to right. [\[13\]](#ftn.id-1.5.9.10.9.6.1.1) If the candidate type can be implicitly converted to the other type, but not vice-versa, select the other type as the new candidate type. Then continue considering the remaining inputs. If, at any stage of this process, a preferred type is selected, stop considering additional inputs.

6. Convert all inputs to the final candidate type. Fail if there is not an implicit conversion from a given input type to the candidate type.

Some examples follow.

[#id](#id-1.5.9.10.11)

**Example 10.10. Type Resolution with Underspecified Types in a Union**

```
SELECT text 'a' AS "text" UNION SELECT 'b';

 text
------
 a
 b
(2 rows)
```

Here, the unknown-type literal `'b'` will be resolved to type `text`.

[#id](#id-1.5.9.10.12)

**Example 10.11. Type Resolution in a Simple Union**

```
SELECT 1.2 AS "numeric" UNION SELECT 1;

 numeric
---------
       1
     1.2
(2 rows)
```

The literal `1.2` is of type `numeric`, and the `integer` value `1` can be cast implicitly to `numeric`, so that type is used.

[#id](#id-1.5.9.10.13)

**Example 10.12. Type Resolution in a Transposed Union**

```
SELECT 1 AS "real" UNION SELECT CAST('2.2' AS REAL);

 real
------
    1
  2.2
(2 rows)
```

Here, since type `real` cannot be implicitly cast to `integer`, but `integer` can be implicitly cast to `real`, the union result type is resolved as `real`.

[#id](#id-1.5.9.10.14)

**Example 10.13. Type Resolution in a Nested Union**

```
SELECT NULL UNION SELECT NULL UNION SELECT 1;

ERROR:  UNION types text and integer cannot be matched
```

This failure occurs because PostgreSQL treats multiple `UNION`s as a nest of pairwise operations; that is, this input is the same as

```
(SELECT NULL UNION SELECT NULL) UNION SELECT 1;
```

The inner `UNION` is resolved as emitting type `text`, according to the rules given above. Then the outer `UNION` has inputs of types `text` and `integer`, leading to the observed error. The problem can be fixed by ensuring that the leftmost `UNION` has at least one input of the desired result type.

`INTERSECT` and `EXCEPT` operations are likewise resolved pairwise. However, the other constructs described in this section consider all of their inputs in one resolution step.

\
