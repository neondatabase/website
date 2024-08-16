[#id](#GIST-BUILTIN-OPCLASSES)

## 68.2. Built-in Operator Classes [#](#GIST-BUILTIN-OPCLASSES)

The core PostgreSQL distribution includes the GiST operator classes shown in [Table 68.1](gist-builtin-opclasses#GIST-BUILTIN-OPCLASSES-TABLE). (Some of the optional modules described in [Appendix F](contrib) provide additional GiST operator classes.)

[#id](#GIST-BUILTIN-OPCLASSES-TABLE)

**Table 68.1. Built-in GiST Operator Classes**

| Name                                  | Indexable Operators                | Ordering Operators     |
| ------------------------------------- | ---------------------------------- | ---------------------- |
| `box_ops`                             | `<< (box, box)`                    | `<-> (box, point)`     |
| `&< (box, box)`                       |                                    |                        |
| `&& (box, box)`                       |                                    |                        |
| `&> (box, box)`                       |                                    |                        |
| `>> (box, box)`                       |                                    |                        |
| `~= (box, box)`                       |                                    |                        |
| `@> (box, box)`                       |                                    |                        |
| `<@ (box, box)`                       |                                    |                        |
| `&<\| (box, box)`                     |                                    |                        |
| `<<\| (box, box)`                     |                                    |                        |
| `\|>> (box, box)`                     |                                    |                        |
| `\|&> (box, box)`                     |                                    |                        |
| `~ (box, box)`                        |                                    |                        |
| `@ (box, box)`                        |                                    |                        |
| `circle_ops`                          | `<< (circle, circle)`              | `<-> (circle, point)`  |
| `&< (circle, circle)`                 |                                    |                        |
| `&> (circle, circle)`                 |                                    |                        |
| `>> (circle, circle)`                 |                                    |                        |
| `<@ (circle, circle)`                 |                                    |                        |
| `@> (circle, circle)`                 |                                    |                        |
| `~= (circle, circle)`                 |                                    |                        |
| `&& (circle, circle)`                 |                                    |                        |
| `\|>> (circle, circle)`               |                                    |                        |
| `<<\| (circle, circle)`               |                                    |                        |
| `&<\| (circle, circle)`               |                                    |                        |
| `\|&> (circle, circle)`               |                                    |                        |
| `@ (circle, circle)`                  |                                    |                        |
| `~ (circle, circle)`                  |                                    |                        |
| `inet_ops`                            | `<< (inet, inet)`                  |                        |
| `<<= (inet, inet)`                    |                                    |                        |
| `>> (inet, inet)`                     |                                    |                        |
| `>>= (inet, inet)`                    |                                    |                        |
| `= (inet, inet)`                      |                                    |                        |
| `<> (inet, inet)`                     |                                    |                        |
| `< (inet, inet)`                      |                                    |                        |
| `<= (inet, inet)`                     |                                    |                        |
| `> (inet, inet)`                      |                                    |                        |
| `>= (inet, inet)`                     |                                    |                        |
| `&& (inet, inet)`                     |                                    |                        |
| `multirange_ops`                      | `= (anymultirange, anymultirange)` |                        |
| `&& (anymultirange, anymultirange)`   |                                    |                        |
| `&& (anymultirange, anyrange)`        |                                    |                        |
| `@> (anymultirange, anyelement)`      |                                    |                        |
| `@> (anymultirange, anymultirange)`   |                                    |                        |
| `@> (anymultirange, anyrange)`        |                                    |                        |
| `<@ (anymultirange, anymultirange)`   |                                    |                        |
| `<@ (anymultirange, anyrange)`        |                                    |                        |
| `<< (anymultirange, anymultirange)`   |                                    |                        |
| `<< (anymultirange, anyrange)`        |                                    |                        |
| `>> (anymultirange, anymultirange)`   |                                    |                        |
| `>> (anymultirange, anyrange)`        |                                    |                        |
| `&< (anymultirange, anymultirange)`   |                                    |                        |
| `&< (anymultirange, anyrange)`        |                                    |                        |
| `&> (anymultirange, anymultirange)`   |                                    |                        |
| `&> (anymultirange, anyrange)`        |                                    |                        |
| `-\|- (anymultirange, anymultirange)` |                                    |                        |
| `-\|- (anymultirange, anyrange)`      |                                    |                        |
| `point_ops`                           | `\|>> (point, point)`              | `<-> (point, point)`   |
| `<< (point, point)`                   |                                    |                        |
| `>> (point, point)`                   |                                    |                        |
| `<<\| (point, point)`                 |                                    |                        |
| `~= (point, point)`                   |                                    |                        |
| `<@ (point, box)`                     |                                    |                        |
| `<@ (point, polygon)`                 |                                    |                        |
| `<@ (point, circle)`                  |                                    |                        |
| `poly_ops`                            | `<< (polygon, polygon)`            | `<-> (polygon, point)` |
| `&< (polygon, polygon)`               |                                    |                        |
| `&> (polygon, polygon)`               |                                    |                        |
| `>> (polygon, polygon)`               |                                    |                        |
| `<@ (polygon, polygon)`               |                                    |                        |
| `@> (polygon, polygon)`               |                                    |                        |
| `~= (polygon, polygon)`               |                                    |                        |
| `&& (polygon, polygon)`               |                                    |                        |
| `<<\| (polygon, polygon)`             |                                    |                        |
| `&<\| (polygon, polygon)`             |                                    |                        |
| `\|&> (polygon, polygon)`             |                                    |                        |
| `\|>> (polygon, polygon)`             |                                    |                        |
| `@ (polygon, polygon)`                |                                    |                        |
| `~ (polygon, polygon)`                |                                    |                        |
| `range_ops`                           | `= (anyrange, anyrange)`           |                        |
| `&& (anyrange, anyrange)`             |                                    |                        |
| `&& (anyrange, anymultirange)`        |                                    |                        |
| `@> (anyrange, anyelement)`           |                                    |                        |
| `@> (anyrange, anyrange)`             |                                    |                        |
| `@> (anyrange, anymultirange)`        |                                    |                        |
| `<@ (anyrange, anyrange)`             |                                    |                        |
| `<@ (anyrange, anymultirange)`        |                                    |                        |
| `<< (anyrange, anyrange)`             |                                    |                        |
| `<< (anyrange, anymultirange)`        |                                    |                        |
| `>> (anyrange, anyrange)`             |                                    |                        |
| `>> (anyrange, anymultirange)`        |                                    |                        |
| `&< (anyrange, anyrange)`             |                                    |                        |
| `&< (anyrange, anymultirange)`        |                                    |                        |
| `&> (anyrange, anyrange)`             |                                    |                        |
| `&> (anyrange, anymultirange)`        |                                    |                        |
| `-\|- (anyrange, anyrange)`           |                                    |                        |
| `-\|- (anyrange, anymultirange)`      |                                    |                        |
| `tsquery_ops`                         | `<@ (tsquery, tsquery)`            |                        |
| `@> (tsquery, tsquery)`               |                                    |                        |
| `tsvector_ops`                        | `@@ (tsvector, tsquery)`           |                        |

For historical reasons, the `inet_ops` operator class is not the default class for types `inet` and `cidr`. To use it, mention the class name in `CREATE INDEX`, for example

```

CREATE INDEX ON my_table USING GIST (my_inet_column inet_ops);
```
