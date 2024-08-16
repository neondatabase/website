[#id](#SPGIST-BUILTIN-OPCLASSES)

## 69.2. Built-in Operator Classes [#](#SPGIST-BUILTIN-OPCLASSES)

The core PostgreSQL distribution includes the SP-GiST operator classes shown in [Table 69.1](spgist-builtin-opclasses#SPGIST-BUILTIN-OPCLASSES-TABLE).

[#id](#SPGIST-BUILTIN-OPCLASSES-TABLE)

**Table 69.1. Built-in SP-GiST Operator Classes**

| Name                       | Indexable Operators     | Ordering Operators    |
| -------------------------- | ----------------------- | --------------------- |
| `box_ops`                  | `<< (box,box)`          | `<-> (box,point)`     |
| `&< (box,box)`             |                         |                       |
| `&> (box,box)`             |                         |                       |
| `>> (box,box)`             |                         |                       |
| `<@ (box,box)`             |                         |                       |
| `@> (box,box)`             |                         |                       |
| `~= (box,box)`             |                         |                       |
| `&& (box,box)`             |                         |                       |
| `<<\| (box,box)`           |                         |                       |
| `&<\| (box,box)`           |                         |                       |
| `\|&> (box,box)`           |                         |                       |
| `\|>> (box,box)`           |                         |                       |
| `inet_ops`                 | `<< (inet,inet)`        |                       |
| `<<= (inet,inet)`          |                         |                       |
| `>> (inet,inet)`           |                         |                       |
| `>>= (inet,inet)`          |                         |                       |
| `= (inet,inet)`            |                         |                       |
| `<> (inet,inet)`           |                         |                       |
| `< (inet,inet)`            |                         |                       |
| `<= (inet,inet)`           |                         |                       |
| `> (inet,inet)`            |                         |                       |
| `>= (inet,inet)`           |                         |                       |
| `&& (inet,inet)`           |                         |                       |
| `kd_point_ops`             | `\|>> (point,point)`    | `<-> (point,point)`   |
| `<< (point,point)`         |                         |                       |
| `>> (point,point)`         |                         |                       |
| `<<\| (point,point)`       |                         |                       |
| `~= (point,point)`         |                         |                       |
| `<@ (point,box)`           |                         |                       |
| `poly_ops`                 | `<< (polygon,polygon)`  | `<-> (polygon,point)` |
| `&< (polygon,polygon)`     |                         |                       |
| `&> (polygon,polygon)`     |                         |                       |
| `>> (polygon,polygon)`     |                         |                       |
| `<@ (polygon,polygon)`     |                         |                       |
| `@> (polygon,polygon)`     |                         |                       |
| `~= (polygon,polygon)`     |                         |                       |
| `&& (polygon,polygon)`     |                         |                       |
| `<<\| (polygon,polygon)`   |                         |                       |
| `&<\| (polygon,polygon)`   |                         |                       |
| `\|>> (polygon,polygon)`   |                         |                       |
| `\|&> (polygon,polygon)`   |                         |                       |
| `quad_point_ops`           | `\|>> (point,point)`    | `<-> (point,point)`   |
| `<< (point,point)`         |                         |                       |
| `>> (point,point)`         |                         |                       |
| `<<\| (point,point)`       |                         |                       |
| `~= (point,point)`         |                         |                       |
| `<@ (point,box)`           |                         |                       |
| `range_ops`                | `= (anyrange,anyrange)` |                       |
| `&& (anyrange,anyrange)`   |                         |                       |
| `@> (anyrange,anyelement)` |                         |                       |
| `@> (anyrange,anyrange)`   |                         |                       |
| `<@ (anyrange,anyrange)`   |                         |                       |
| `<< (anyrange,anyrange)`   |                         |                       |
| `>> (anyrange,anyrange)`   |                         |                       |
| `&< (anyrange,anyrange)`   |                         |                       |
| `&> (anyrange,anyrange)`   |                         |                       |
| `-\|- (anyrange,anyrange)` |                         |                       |
| `text_ops`                 | `= (text,text)`         |                       |
| `< (text,text)`            |                         |                       |
| `<= (text,text)`           |                         |                       |
| `> (text,text)`            |                         |                       |
| `>= (text,text)`           |                         |                       |
| `~<~ (text,text)`          |                         |                       |
| `~<=~ (text,text)`         |                         |                       |
| `~>=~ (text,text)`         |                         |                       |
| `~>~ (text,text)`          |                         |                       |
| `^@ (text,text)`           |                         |                       |

Of the two operator classes for type `point`, `quad_point_ops` is the default. `kd_point_ops` supports the same operators but uses a different index data structure that may offer better performance in some applications.

The `quad_point_ops`, `kd_point_ops` and `poly_ops` operator classes support the `<->` ordering operator, which enables the k-nearest neighbor (`k-NN`) search over indexed point or polygon data sets.
