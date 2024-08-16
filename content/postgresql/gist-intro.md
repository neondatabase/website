[#id](#GIST-INTRO)

## 68.1. Introduction [#](#GIST-INTRO)

GiST stands for Generalized Search Tree. It is a balanced, tree-structured access method, that acts as a base template in which to implement arbitrary indexing schemes. B-trees, R-trees and many other indexing schemes can be implemented in GiST.

One advantage of GiST is that it allows the development of custom data types with the appropriate access methods, by an expert in the domain of the data type, rather than a database expert.

Some of the information here is derived from the University of California at Berkeley's GiST Indexing Project [web site](http://gist.cs.berkeley.edu/) and Marcel Kornacker's thesis, [Access Methods for Next-Generation Database Systems](http://www.sai.msu.su/~megera/postgres/gist/papers/concurrency/access-methods-for-next-generation.pdf.gz). The GiST implementation in PostgreSQL is primarily maintained by Teodor Sigaev and Oleg Bartunov, and there is more information on their [web site](http://www.sai.msu.su/~megera/postgres/gist/).
