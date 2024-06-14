[#id](#SPGIST-EXTENSIBILITY)

## 69.3. Extensibility [#](#SPGIST-EXTENSIBILITY)

SP-GiST offers an interface with a high level of abstraction, requiring the access method developer to implement only methods specific to a given data type. The SP-GiST core is responsible for efficient disk mapping and searching the tree structure. It also takes care of concurrency and logging considerations.

Leaf tuples of an SP-GiST tree usually contain values of the same data type as the indexed column, although it is also possible for them to contain lossy representations of the indexed column. Leaf tuples stored at the root level will directly represent the original indexed data value, but leaf tuples at lower levels might contain only a partial value, such as a suffix. In that case the operator class support functions must be able to reconstruct the original value using information accumulated from the inner tuples that are passed through to reach the leaf level.

When an SP-GiST index is created with `INCLUDE` columns, the values of those columns are also stored in leaf tuples. The `INCLUDE` columns are of no concern to the SP-GiST operator class, so they are not discussed further here.

Inner tuples are more complex, since they are branching points in the search tree. Each inner tuple contains a set of one or more _nodes_, which represent groups of similar leaf values. A node contains a downlink that leads either to another, lower-level inner tuple, or to a short list of leaf tuples that all lie on the same index page. Each node normally has a _label_ that describes it; for example, in a radix tree the node label could be the next character of the string value. (Alternatively, an operator class can omit the node labels, if it works with a fixed set of nodes for all inner tuples; see [Section 69.4.2](spgist-implementation#SPGIST-NULL-LABELS).) Optionally, an inner tuple can have a _prefix_ value that describes all its members. In a radix tree this could be the common prefix of the represented strings. The prefix value is not necessarily really a prefix, but can be any data needed by the operator class; for example, in a quad-tree it can store the central point that the four quadrants are measured with respect to. A quad-tree inner tuple would then also contain four nodes corresponding to the quadrants around this central point.

Some tree algorithms require knowledge of level (or depth) of the current tuple, so the SP-GiST core provides the possibility for operator classes to manage level counting while descending the tree. There is also support for incrementally reconstructing the represented value when that is needed, and for passing down additional data (called _traverse values_) during a tree descent.

### Note

The SP-GiST core code takes care of null entries. Although SP-GiST indexes do store entries for nulls in indexed columns, this is hidden from the index operator class code: no null index entries or search conditions will ever be passed to the operator class methods. (It is assumed that SP-GiST operators are strict and so cannot succeed for null values.) Null values are therefore not discussed further here.

There are five user-defined methods that an index operator class for SP-GiST must provide, and two are optional. All five mandatory methods follow the convention of accepting two `internal` arguments, the first of which is a pointer to a C struct containing input values for the support method, while the second argument is a pointer to a C struct where output values must be placed. Four of the mandatory methods just return `void`, since all their results appear in the output struct; but `leaf_consistent` returns a `boolean` result. The methods must not modify any fields of their input structs. In all cases, the output struct is initialized to zeroes before calling the user-defined method. The optional sixth method `compress` accepts a `datum` to be indexed as the only argument and returns a value suitable for physical storage in a leaf tuple. The optional seventh method `options` accepts an `internal` pointer to a C struct, where opclass-specific parameters should be placed, and returns `void`.

The five mandatory user-defined methods are:

- `config`

  Returns static information about the index implementation, including the data type OIDs of the prefix and node label data types.

  The SQL declaration of the function must look like this:

  ```
  CREATE FUNCTION my_config(internal, internal) RETURNS void ...
  ```

  The first argument is a pointer to a `spgConfigIn` C struct, containing input data for the function. The second argument is a pointer to a `spgConfigOut` C struct, which the function must fill with result data.

  ```
  typedef struct spgConfigIn
  {
      Oid         attType;        /* Data type to be indexed */
  } spgConfigIn;

  typedef struct spgConfigOut
  {
      Oid         prefixType;     /* Data type of inner-tuple prefixes */
      Oid         labelType;      /* Data type of inner-tuple node labels */
      Oid         leafType;       /* Data type of leaf-tuple values */
      bool        canReturnData;  /* Opclass can reconstruct original data */
      bool        longValuesOK;   /* Opclass can cope with values > 1 page */
  } spgConfigOut;
  ```

  `attType` is passed in order to support polymorphic index operator classes; for ordinary fixed-data-type operator classes, it will always have the same value and so can be ignored.

  For operator classes that do not use prefixes, `prefixType` can be set to `VOIDOID`. Likewise, for operator classes that do not use node labels, `labelType` can be set to `VOIDOID`. `canReturnData` should be set true if the operator class is capable of reconstructing the originally-supplied index value. `longValuesOK` should be set true only when the `attType` is of variable length and the operator class is capable of segmenting long values by repeated suffixing (see [Section 69.4.1](spgist-implementation#SPGIST-LIMITS)).

  `leafType` should match the index storage type defined by the operator class's `opckeytype` catalog entry. (Note that `opckeytype` can be zero, implying the storage type is the same as the operator class's input type, which is the most common situation.) For reasons of backward compatibility, the `config` method can set `leafType` to some other value, and that value will be used; but this is deprecated since the index contents are then incorrectly identified in the catalogs. Also, it's permissible to leave `leafType` uninitialized (zero); that is interpreted as meaning the index storage type derived from `opckeytype`.

  When `attType` and `leafType` are different, the optional method `compress` must be provided. Method `compress` is responsible for transformation of datums to be indexed from `attType` to `leafType`.

- `choose`

  Chooses a method for inserting a new value into an inner tuple.

  The SQL declaration of the function must look like this:

  ```
  CREATE FUNCTION my_choose(internal, internal) RETURNS void ...
  ```

  The first argument is a pointer to a `spgChooseIn` C struct, containing input data for the function. The second argument is a pointer to a `spgChooseOut` C struct, which the function must fill with result data.

  ```
  typedef struct spgChooseIn
  {
      Datum       datum;          /* original datum to be indexed */
      Datum       leafDatum;      /* current datum to be stored at leaf */
      int         level;          /* current level (counting from zero) */

      /* Data from current inner tuple */
      bool        allTheSame;     /* tuple is marked all-the-same? */
      bool        hasPrefix;      /* tuple has a prefix? */
      Datum       prefixDatum;    /* if so, the prefix value */
      int         nNodes;         /* number of nodes in the inner tuple */
      Datum      *nodeLabels;     /* node label values (NULL if none) */
  } spgChooseIn;

  typedef enum spgChooseResultType
  {
      spgMatchNode = 1,           /* descend into existing node */
      spgAddNode,                 /* add a node to the inner tuple */
      spgSplitTuple               /* split inner tuple (change its prefix) */
  } spgChooseResultType;

  typedef struct spgChooseOut
  {
      spgChooseResultType resultType;     /* action code, see above */
      union
      {
          struct                  /* results for spgMatchNode */
          {
              int         nodeN;      /* descend to this node (index from 0) */
              int         levelAdd;   /* increment level by this much */
              Datum       restDatum;  /* new leaf datum */
          }           matchNode;
          struct                  /* results for spgAddNode */
          {
              Datum       nodeLabel;  /* new node's label */
              int         nodeN;      /* where to insert it (index from 0) */
          }           addNode;
          struct                  /* results for spgSplitTuple */
          {
              /* Info to form new upper-level inner tuple with one child tuple */
              bool        prefixHasPrefix;    /* tuple should have a prefix? */
              Datum       prefixPrefixDatum;  /* if so, its value */
              int         prefixNNodes;       /* number of nodes */
              Datum      *prefixNodeLabels;   /* their labels (or NULL for
                                               * no labels) */
              int         childNodeN;         /* which node gets child tuple */

              /* Info to form new lower-level inner tuple with all old nodes */
              bool        postfixHasPrefix;   /* tuple should have a prefix? */
              Datum       postfixPrefixDatum; /* if so, its value */
          }           splitTuple;
      }           result;
  } spgChooseOut;
  ```

  `datum` is the original datum of `spgConfigIn`.`attType` type that was to be inserted into the index. `leafDatum` is a value of `spgConfigOut`.`leafType` type, which is initially a result of method `compress` applied to `datum` when method `compress` is provided, or the same value as `datum` otherwise. `leafDatum` can change at lower levels of the tree if the `choose` or `picksplit` methods change it. When the insertion search reaches a leaf page, the current value of `leafDatum` is what will be stored in the newly created leaf tuple. `level` is the current inner tuple's level, starting at zero for the root level. `allTheSame` is true if the current inner tuple is marked as containing multiple equivalent nodes (see [Section 69.4.3](spgist-implementation#SPGIST-ALL-THE-SAME)). `hasPrefix` is true if the current inner tuple contains a prefix; if so, `prefixDatum` is its value. `nNodes` is the number of child nodes contained in the inner tuple, and `nodeLabels` is an array of their label values, or NULL if there are no labels.

  The `choose` function can determine either that the new value matches one of the existing child nodes, or that a new child node must be added, or that the new value is inconsistent with the tuple prefix and so the inner tuple must be split to create a less restrictive prefix.

  If the new value matches one of the existing child nodes, set `resultType` to `spgMatchNode`. Set `nodeN` to the index (from zero) of that node in the node array. Set `levelAdd` to the increment in `level` caused by descending through that node, or leave it as zero if the operator class does not use levels. Set `restDatum` to equal `leafDatum` if the operator class does not modify datums from one level to the next, or otherwise set it to the modified value to be used as `leafDatum` at the next level.

  If a new child node must be added, set `resultType` to `spgAddNode`. Set `nodeLabel` to the label to be used for the new node, and set `nodeN` to the index (from zero) at which to insert the node in the node array. After the node has been added, the `choose` function will be called again with the modified inner tuple; that call should result in an `spgMatchNode` result.

  If the new value is inconsistent with the tuple prefix, set `resultType` to `spgSplitTuple`. This action moves all the existing nodes into a new lower-level inner tuple, and replaces the existing inner tuple with a tuple having a single downlink pointing to the new lower-level inner tuple. Set `prefixHasPrefix` to indicate whether the new upper tuple should have a prefix, and if so set `prefixPrefixDatum` to the prefix value. This new prefix value must be sufficiently less restrictive than the original to accept the new value to be indexed. Set `prefixNNodes` to the number of nodes needed in the new tuple, and set `prefixNodeLabels` to a palloc'd array holding their labels, or to NULL if node labels are not required. Note that the total size of the new upper tuple must be no more than the total size of the tuple it is replacing; this constrains the lengths of the new prefix and new labels. Set `childNodeN` to the index (from zero) of the node that will downlink to the new lower-level inner tuple. Set `postfixHasPrefix` to indicate whether the new lower-level inner tuple should have a prefix, and if so set `postfixPrefixDatum` to the prefix value. The combination of these two prefixes and the downlink node's label (if any) must have the same meaning as the original prefix, because there is no opportunity to alter the node labels that are moved to the new lower-level tuple, nor to change any child index entries. After the node has been split, the `choose` function will be called again with the replacement inner tuple. That call may return an `spgAddNode` result, if no suitable node was created by the `spgSplitTuple` action. Eventually `choose` must return `spgMatchNode` to allow the insertion to descend to the next level.

- `picksplit`

  Decides how to create a new inner tuple over a set of leaf tuples.

  The SQL declaration of the function must look like this:

  ```
  CREATE FUNCTION my_picksplit(internal, internal) RETURNS void ...
  ```

  The first argument is a pointer to a `spgPickSplitIn` C struct, containing input data for the function. The second argument is a pointer to a `spgPickSplitOut` C struct, which the function must fill with result data.

  ```
  typedef struct spgPickSplitIn
  {
      int         nTuples;        /* number of leaf tuples */
      Datum      *datums;         /* their datums (array of length nTuples) */
      int         level;          /* current level (counting from zero) */
  } spgPickSplitIn;

  typedef struct spgPickSplitOut
  {
      bool        hasPrefix;      /* new inner tuple should have a prefix? */
      Datum       prefixDatum;    /* if so, its value */

      int         nNodes;         /* number of nodes for new inner tuple */
      Datum      *nodeLabels;     /* their labels (or NULL for no labels) */

      int        *mapTuplesToNodes;   /* node index for each leaf tuple */
      Datum      *leafTupleDatums;    /* datum to store in each new leaf tuple */
  } spgPickSplitOut;
  ```

  `nTuples` is the number of leaf tuples provided. `datums` is an array of their datum values of `spgConfigOut`.`leafType` type. `level` is the current level that all the leaf tuples share, which will become the level of the new inner tuple.

  Set `hasPrefix` to indicate whether the new inner tuple should have a prefix, and if so set `prefixDatum` to the prefix value. Set `nNodes` to indicate the number of nodes that the new inner tuple will contain, and set `nodeLabels` to an array of their label values, or to NULL if node labels are not required. Set `mapTuplesToNodes` to an array that gives the index (from zero) of the node that each leaf tuple should be assigned to. Set `leafTupleDatums` to an array of the values to be stored in the new leaf tuples (these will be the same as the input `datums` if the operator class does not modify datums from one level to the next). Note that the `picksplit` function is responsible for palloc'ing the `nodeLabels`, `mapTuplesToNodes` and `leafTupleDatums` arrays.

  If more than one leaf tuple is supplied, it is expected that the `picksplit` function will classify them into more than one node; otherwise it is not possible to split the leaf tuples across multiple pages, which is the ultimate purpose of this operation. Therefore, if the `picksplit` function ends up placing all the leaf tuples in the same node, the core SP-GiST code will override that decision and generate an inner tuple in which the leaf tuples are assigned at random to several identically-labeled nodes. Such a tuple is marked `allTheSame` to signify that this has happened. The `choose` and `inner_consistent` functions must take suitable care with such inner tuples. See [Section 69.4.3](spgist-implementation#SPGIST-ALL-THE-SAME) for more information.

  `picksplit` can be applied to a single leaf tuple only in the case that the `config` function set `longValuesOK` to true and a larger-than-a-page input value has been supplied. In this case the point of the operation is to strip off a prefix and produce a new, shorter leaf datum value. The call will be repeated until a leaf datum short enough to fit on a page has been produced. See [Section 69.4.1](spgist-implementation#SPGIST-LIMITS) for more information.

- `inner_consistent`

  Returns set of nodes (branches) to follow during tree search.

  The SQL declaration of the function must look like this:

  ```
  CREATE FUNCTION my_inner_consistent(internal, internal) RETURNS void ...
  ```

  The first argument is a pointer to a `spgInnerConsistentIn` C struct, containing input data for the function. The second argument is a pointer to a `spgInnerConsistentOut` C struct, which the function must fill with result data.

  ```
  typedef struct spgInnerConsistentIn
  {
      ScanKey     scankeys;       /* array of operators and comparison values */
      ScanKey     orderbys;       /* array of ordering operators and comparison
                                   * values */
      int         nkeys;          /* length of scankeys array */
      int         norderbys;      /* length of orderbys array */

      Datum       reconstructedValue;     /* value reconstructed at parent */
      void       *traversalValue; /* opclass-specific traverse value */
      MemoryContext traversalMemoryContext;   /* put new traverse values here */
      int         level;          /* current level (counting from zero) */
      bool        returnData;     /* original data must be returned? */

      /* Data from current inner tuple */
      bool        allTheSame;     /* tuple is marked all-the-same? */
      bool        hasPrefix;      /* tuple has a prefix? */
      Datum       prefixDatum;    /* if so, the prefix value */
      int         nNodes;         /* number of nodes in the inner tuple */
      Datum      *nodeLabels;     /* node label values (NULL if none) */
  } spgInnerConsistentIn;

  typedef struct spgInnerConsistentOut
  {
      int         nNodes;         /* number of child nodes to be visited */
      int        *nodeNumbers;    /* their indexes in the node array */
      int        *levelAdds;      /* increment level by this much for each */
      Datum      *reconstructedValues;    /* associated reconstructed values */
      void      **traversalValues;        /* opclass-specific traverse values */
      double    **distances;              /* associated distances */
  } spgInnerConsistentOut;
  ```

  The array `scankeys`, of length `nkeys`, describes the index search condition(s). These conditions are combined with AND — only index entries that satisfy all of them are interesting. (Note that `nkeys` = 0 implies that all index entries satisfy the query.) Usually the consistent function only cares about the `sk_strategy` and `sk_argument` fields of each array entry, which respectively give the indexable operator and comparison value. In particular it is not necessary to check `sk_flags` to see if the comparison value is NULL, because the SP-GiST core code will filter out such conditions. The array `orderbys`, of length `norderbys`, describes ordering operators (if any) in the same manner. `reconstructedValue` is the value reconstructed for the parent tuple; it is `(Datum) 0` at the root level or if the `inner_consistent` function did not provide a value at the parent level. `traversalValue` is a pointer to any traverse data passed down from the previous call of `inner_consistent` on the parent index tuple, or NULL at the root level. `traversalMemoryContext` is the memory context in which to store output traverse values (see below). `level` is the current inner tuple's level, starting at zero for the root level. `returnData` is `true` if reconstructed data is required for this query; this will only be so if the `config` function asserted `canReturnData`. `allTheSame` is true if the current inner tuple is marked “all-the-same”; in this case all the nodes have the same label (if any) and so either all or none of them match the query (see [Section 69.4.3](spgist-implementation#SPGIST-ALL-THE-SAME)). `hasPrefix` is true if the current inner tuple contains a prefix; if so, `prefixDatum` is its value. `nNodes` is the number of child nodes contained in the inner tuple, and `nodeLabels` is an array of their label values, or NULL if the nodes do not have labels.

  `nNodes` must be set to the number of child nodes that need to be visited by the search, and `nodeNumbers` must be set to an array of their indexes. If the operator class keeps track of levels, set `levelAdds` to an array of the level increments required when descending to each node to be visited. (Often these increments will be the same for all the nodes, but that's not necessarily so, so an array is used.) If value reconstruction is needed, set `reconstructedValues` to an array of the values reconstructed for each child node to be visited; otherwise, leave `reconstructedValues` as NULL. The reconstructed values are assumed to be of type `spgConfigOut`.`leafType`. (However, since the core system will do nothing with them except possibly copy them, it is sufficient for them to have the same `typlen` and `typbyval` properties as `leafType`.) If ordered search is performed, set `distances` to an array of distance values according to `orderbys` array (nodes with lowest distances will be processed first). Leave it NULL otherwise. If it is desired to pass down additional out-of-band information (“traverse values”) to lower levels of the tree search, set `traversalValues` to an array of the appropriate traverse values, one for each child node to be visited; otherwise, leave `traversalValues` as NULL. Note that the `inner_consistent` function is responsible for palloc'ing the `nodeNumbers`, `levelAdds`, `distances`, `reconstructedValues`, and `traversalValues` arrays in the current memory context. However, any output traverse values pointed to by the `traversalValues` array should be allocated in `traversalMemoryContext`. Each traverse value must be a single palloc'd chunk.

- `leaf_consistent`

  Returns true if a leaf tuple satisfies a query.

  The SQL declaration of the function must look like this:

  ```
  CREATE FUNCTION my_leaf_consistent(internal, internal) RETURNS bool ...
  ```

  The first argument is a pointer to a `spgLeafConsistentIn` C struct, containing input data for the function. The second argument is a pointer to a `spgLeafConsistentOut` C struct, which the function must fill with result data.

  ```
  typedef struct spgLeafConsistentIn
  {
      ScanKey     scankeys;       /* array of operators and comparison values */
      ScanKey     orderbys;       /* array of ordering operators and comparison
                                   * values */
      int         nkeys;          /* length of scankeys array */
      int         norderbys;      /* length of orderbys array */

      Datum       reconstructedValue;     /* value reconstructed at parent */
      void       *traversalValue; /* opclass-specific traverse value */
      int         level;          /* current level (counting from zero) */
      bool        returnData;     /* original data must be returned? */

      Datum       leafDatum;      /* datum in leaf tuple */
  } spgLeafConsistentIn;

  typedef struct spgLeafConsistentOut
  {
      Datum       leafValue;        /* reconstructed original data, if any */
      bool        recheck;          /* set true if operator must be rechecked */
      bool        recheckDistances; /* set true if distances must be rechecked */
      double     *distances;        /* associated distances */
  } spgLeafConsistentOut;
  ```

  The array `scankeys`, of length `nkeys`, describes the index search condition(s). These conditions are combined with AND — only index entries that satisfy all of them satisfy the query. (Note that `nkeys` = 0 implies that all index entries satisfy the query.) Usually the consistent function only cares about the `sk_strategy` and `sk_argument` fields of each array entry, which respectively give the indexable operator and comparison value. In particular it is not necessary to check `sk_flags` to see if the comparison value is NULL, because the SP-GiST core code will filter out such conditions. The array `orderbys`, of length `norderbys`, describes the ordering operators in the same manner. `reconstructedValue` is the value reconstructed for the parent tuple; it is `(Datum) 0` at the root level or if the `inner_consistent` function did not provide a value at the parent level. `traversalValue` is a pointer to any traverse data passed down from the previous call of `inner_consistent` on the parent index tuple, or NULL at the root level. `level` is the current leaf tuple's level, starting at zero for the root level. `returnData` is `true` if reconstructed data is required for this query; this will only be so if the `config` function asserted `canReturnData`. `leafDatum` is the key value of `spgConfigOut`.`leafType` stored in the current leaf tuple.

  The function must return `true` if the leaf tuple matches the query, or `false` if not. In the `true` case, if `returnData` is `true` then `leafValue` must be set to the value (of type `spgConfigIn`.`attType`) originally supplied to be indexed for this leaf tuple. Also, `recheck` may be set to `true` if the match is uncertain and so the operator(s) must be re-applied to the actual heap tuple to verify the match. If ordered search is performed, set `distances` to an array of distance values according to `orderbys` array. Leave it NULL otherwise. If at least one of returned distances is not exact, set `recheckDistances` to true. In this case, the executor will calculate the exact distances after fetching the tuple from the heap, and will reorder the tuples if needed.

The optional user-defined methods are:

- `Datum compress(Datum in)`

  Converts a data item into a format suitable for physical storage in a leaf tuple of the index. It accepts a value of type `spgConfigIn`.`attType` and returns a value of type `spgConfigOut`.`leafType`. The output value must not contain an out-of-line TOAST pointer.

  Note: the `compress` method is only applied to values to be stored. The consistent methods receive query `scankeys` unchanged, without transformation using `compress`.

- `options`

  Defines a set of user-visible parameters that control operator class behavior.

  The SQL declaration of the function must look like this:

  ```
  CREATE OR REPLACE FUNCTION my_options(internal)
  RETURNS void
  AS 'MODULE_PATHNAME'
  LANGUAGE C STRICT;
  ```

  The function is passed a pointer to a `local_relopts` struct, which needs to be filled with a set of operator class specific options. The options can be accessed from other support functions using the `PG_HAS_OPCLASS_OPTIONS()` and `PG_GET_OPCLASS_OPTIONS()` macros.

  Since the representation of the key in SP-GiST is flexible, it may depend on user-specified parameters.

All the SP-GiST support methods are normally called in a short-lived memory context; that is, `CurrentMemoryContext` will be reset after processing of each tuple. It is therefore not very important to worry about pfree'ing everything you palloc. (The `config` method is an exception: it should try to avoid leaking memory. But usually the `config` method need do nothing but assign constants into the passed parameter struct.)

If the indexed column is of a collatable data type, the index collation will be passed to all the support methods, using the standard `PG_GET_COLLATION()` mechanism.
