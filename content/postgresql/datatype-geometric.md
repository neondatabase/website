[#id](#DATATYPE-GEOMETRIC)

## 8.8. Geometric Types [#](#DATATYPE-GEOMETRIC)

- [8.8.1. Points](datatype-geometric#DATATYPE-GEOMETRIC-POINTS)
- [8.8.2. Lines](datatype-geometric#DATATYPE-LINE)
- [8.8.3. Line Segments](datatype-geometric#DATATYPE-LSEG)
- [8.8.4. Boxes](datatype-geometric#DATATYPE-GEOMETRIC-BOXES)
- [8.8.5. Paths](datatype-geometric#DATATYPE-GEOMETRIC-PATHS)
- [8.8.6. Polygons](datatype-geometric#DATATYPE-POLYGON)
- [8.8.7. Circles](datatype-geometric#DATATYPE-CIRCLE)

Geometric data types represent two-dimensional spatial objects. [Table 8.20](datatype-geometric#DATATYPE-GEO-TABLE) shows the geometric types available in PostgreSQL.

[#id](#DATATYPE-GEO-TABLE)

**Table 8.20. Geometric Types**

| Name      | Storage Size | Description                      | Representation                        |
| --------- | ------------ | -------------------------------- | ------------------------------------- |
| `point`   | 16 bytes     | Point on a plane                 | `(x,y)`                               |
| `line`    | 32 bytes     | Infinite line                    | `{A,B,C}`                             |
| `lseg`    | 32 bytes     | Finite line segment              | `((x1,y1),(x2,y2))`                   |
| `box`     | 32 bytes     | Rectangular box                  | `((x1,y1),(x2,y2))`                   |
| `path`    | 16+16n bytes | Closed path (similar to polygon) | `((x1,y1),...)`                       |
| `path`    | 16+16n bytes | Open path                        | `[(x1,y1),...]`                       |
| `polygon` | 40+16n bytes | Polygon (similar to closed path) | `((x1,y1),...)`                       |
| `circle`  | 24 bytes     | Circle                           | `<(x,y),r>` (center point and radius) |

A rich set of functions and operators is available to perform various geometric operations such as scaling, translation, rotation, and determining intersections. They are explained in [Section 9.11](functions-geometry).

[#id](#DATATYPE-GEOMETRIC-POINTS)

### 8.8.1. Points [#](#DATATYPE-GEOMETRIC-POINTS)

Points are the fundamental two-dimensional building block for geometric types. Values of type `point` are specified using either of the following syntaxes:

```

( x , y )
  x , y
```

where _`x`_ and _`y`_ are the respective coordinates, as floating-point numbers.

Points are output using the first syntax.

[#id](#DATATYPE-LINE)

### 8.8.2. Lines [#](#DATATYPE-LINE)

Lines are represented by the linear equation *`A`*x + *`B`*y + _`C`_ = 0, where _`A`_ and _`B`_ are not both zero. Values of type `line` are input and output in the following form:

```

{ A, B, C }
```

Alternatively, any of the following forms can be used for input:

```

[ ( x1 , y1 ) , ( x2 , y2 ) ]
( ( x1 , y1 ) , ( x2 , y2 ) )
  ( x1 , y1 ) , ( x2 , y2 )
    x1 , y1   ,   x2 , y2
```

where `(x1,y1)` and `(x2,y2)` are two different points on the line.

[#id](#DATATYPE-LSEG)

### 8.8.3. Line Segments [#](#DATATYPE-LSEG)

Line segments are represented by pairs of points that are the endpoints of the segment. Values of type `lseg` are specified using any of the following syntaxes:

```

[ ( x1 , y1 ) , ( x2 , y2 ) ]
( ( x1 , y1 ) , ( x2 , y2 ) )
  ( x1 , y1 ) , ( x2 , y2 )
    x1 , y1   ,   x2 , y2
```

where `(x1,y1)` and `(x2,y2)` are the end points of the line segment.

Line segments are output using the first syntax.

[#id](#DATATYPE-GEOMETRIC-BOXES)

### 8.8.4. Boxes [#](#DATATYPE-GEOMETRIC-BOXES)

Boxes are represented by pairs of points that are opposite corners of the box. Values of type `box` are specified using any of the following syntaxes:

```

( ( x1 , y1 ) , ( x2 , y2 ) )
  ( x1 , y1 ) , ( x2 , y2 )
    x1 , y1   ,   x2 , y2
```

where `(x1,y1)` and `(x2,y2)` are any two opposite corners of the box.

Boxes are output using the second syntax.

Any two opposite corners can be supplied on input, but the values will be reordered as needed to store the upper right and lower left corners, in that order.

[#id](#DATATYPE-GEOMETRIC-PATHS)

### 8.8.5. Paths [#](#DATATYPE-GEOMETRIC-PATHS)

Paths are represented by lists of connected points. Paths can be _open_, where the first and last points in the list are considered not connected, or _closed_, where the first and last points are considered connected.

Values of type `path` are specified using any of the following syntaxes:

```

[ ( x1 , y1 ) , ... , ( xn , yn ) ]
( ( x1 , y1 ) , ... , ( xn , yn ) )
  ( x1 , y1 ) , ... , ( xn , yn )
  ( x1 , y1   , ... ,   xn , yn )
    x1 , y1   , ... ,   xn , yn
```

where the points are the end points of the line segments comprising the path. Square brackets (`[]`) indicate an open path, while parentheses (`()`) indicate a closed path. When the outermost parentheses are omitted, as in the third through fifth syntaxes, a closed path is assumed.

Paths are output using the first or second syntax, as appropriate.

[#id](#DATATYPE-POLYGON)

### 8.8.6. Polygons [#](#DATATYPE-POLYGON)

Polygons are represented by lists of points (the vertexes of the polygon). Polygons are very similar to closed paths; the essential difference is that a polygon is considered to include the area within it, while a path is not.

Values of type `polygon` are specified using any of the following syntaxes:

```

( ( x1 , y1 ) , ... , ( xn , yn ) )
  ( x1 , y1 ) , ... , ( xn , yn )
  ( x1 , y1   , ... ,   xn , yn )
    x1 , y1   , ... ,   xn , yn
```

where the points are the end points of the line segments comprising the boundary of the polygon.

Polygons are output using the first syntax.

[#id](#DATATYPE-CIRCLE)

### 8.8.7. Circles [#](#DATATYPE-CIRCLE)

Circles are represented by a center point and radius. Values of type `circle` are specified using any of the following syntaxes:

```

< ( x , y ) , r >
( ( x , y ) , r )
  ( x , y ) , r
    x , y   , r
```

where `(x,y)` is the center point and _`r`_ is the radius of the circle.

Circles are output using the first syntax.
