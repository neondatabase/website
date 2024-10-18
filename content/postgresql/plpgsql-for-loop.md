---
title: 'PL/pgSQL For Loop'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-for-loop/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PL/pgSQL `for` loop statements to iterate over a range of integers or a result set of a query.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Using PL/pgSQL for loop to iterate over a range of integers

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `for` loop statement that iterates over integers of a range:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
[ <<label>> ]
for loop_counter in [ reverse ] from.. to [ by step ] loop
    statements
end loop [ label ];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, the `for` loop creates an integer variable `loop_counter` which is accessible only inside the loop. By default, the `for` loop increases the `loop_counter` by `step` after each iteration. However, when you use the `reverse` option, the `for` loop decreases the `loop_counter` by the `step`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, the `from` and `to` are expressions that specify the lower and upper bound of the range. The `for` loop evaluates these expressions before entering the loop.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, the `step` that follows the `by` keyword specifies the iteration step. It is optional and defaults to 1. The `for loop` evaluates the `step` expression once only.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following flowchart illustrates the `for` loop statement:

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":1393} -->

![PL/pgSQL FOR loop](https://www.postgresqltutorial.com/wp-content/uploads/2015/09/plpgsql-FOR-loop.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `for` loop statement to iterate over five numbers from 1 to 5 and display each of them in each iteration:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do
$$
begin
   for counter in 1..5 loop
	raise notice 'counter: %', counter;
   end loop;
end;
$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  Counter: 1
NOTICE:  Counter: 2
NOTICE:  Counter: 3
NOTICE:  Counter: 4
NOTICE:  Counter: 5
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example iterates over 5 numbers from 5 to 1 and shows each of them in each iteration:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$
begin
   for counter in reverse 5..1 loop
      raise notice 'counter: %', counter;
   end loop;
end; $$
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  Counter: 5
NOTICE:  Counter: 4
NOTICE:  Counter: 3
NOTICE:  Counter: 2
NOTICE:  Counter: 1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `for` loop statement to iterate over six numbers from 1 to 6. It adds 2 to the counter after each iteration:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$
begin
  for counter in 1..6 by 2 loop
    raise notice 'counter: %', counter;
  end loop;
end; $$
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  Counter 1
NOTICE:  Counter 3
NOTICE:  Counter 5
```

<!-- /wp:code -->

<!-- wp:heading -->

## Using PL/pgSQL for loop to iterate over a result set

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement shows how to use the `for` loop statement to iterate over a result set of a query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
[ <<label>> ]
for target in query loop
    statements
end loop [ label ];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `for` loop to display the titles of the top 10 longest films.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do
$$
declare
    f record;
begin
    for f in select title, length
	       from film
	       order by length desc, title
	       limit 10
    loop
	raise notice '%(% mins)', f.title, f.length;
    end loop;
end;
$$
```

<!-- /wp:code -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  Chicago North(185 mins)
NOTICE:  Control Anthem(185 mins)
NOTICE:  Darn Forrester(185 mins)
NOTICE:  Gangs Pride(185 mins)
NOTICE:  Home Pity(185 mins)
NOTICE:  Muscle Bright(185 mins)
NOTICE:  Pond Seattle(185 mins)
NOTICE:  Soldiers Evolution(185 mins)
NOTICE:  Sweet Brotherhood(185 mins)
NOTICE:  Worst Banger(185 mins)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Using PL/pgSQL for loop to iterate over the result set of a dynamic query

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following form of the `for` loop statement allows you to execute a dynamic query and iterate over its result set:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
[ <<label>> ]
for row in execute query_expression [ using query_param [, ... ] ]
loop
    statements
end loop [ label ];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `query_expression` is an SQL statement.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `using` clause is used to pass parameters to the query.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following block shows how to use the `for` loop statement to loop through a dynamic query. It has two configuration variables:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `sort_type`: 1 to sort the films by title, 2 to sort the films by release year.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `rec_count`: is the number of rows to query from the `film` table. We'll use it in the `using` clause of the `for` loop.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

This [anonymous block](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-block-structure/) composes the query based on the `sort_type` variable and uses the for loop to iterate over the row of the result set.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$
declare
    -- sort by 1: title, 2: release year
    sort_type smallint := 1;
	-- return the number of films
	rec_count int := 10;
	-- use to iterate over the film
	rec record;
	-- dynamic query
    query text;
begin

	query := 'select title, release_year from film ';

	if sort_type = 1 then
		query := query || 'order by title';
	elsif sort_type = 2 then
	  query := query || 'order by release_year';
	else
	   raise 'invalid sort type %s', sort_type;
	end if;

	query := query || ' limit $1';

	for rec in execute query using rec_count
        loop
	     raise notice '% - %', rec.release_year, rec.title;
	end loop;
end;
$$
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  2006 - Academy Dinosaur
NOTICE:  2006 - Ace Goldfinger
NOTICE:  2006 - Adaptation Holes
NOTICE:  2006 - Affair Prejudice
NOTICE:  2006 - African Egg
NOTICE:  2006 - Agent Truman
NOTICE:  2006 - Airplane Sierra
NOTICE:  2006 - Airport Pollock
NOTICE:  2006 - Alabama Devil
NOTICE:  2006 - Aladdin Calendar
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you change the `sort_type` to 2, you'll get the following output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  2006 - Grosse Wonderful
NOTICE:  2006 - Airport Pollock
NOTICE:  2006 - Bright Encounters
NOTICE:  2006 - Academy Dinosaur
NOTICE:  2006 - Ace Goldfinger
NOTICE:  2006 - Adaptation Holes
NOTICE:  2006 - Affair Prejudice
NOTICE:  2006 - African Egg
NOTICE:  2006 - Agent Truman
NOTICE:  2006 - Chamber Italian
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned various forms of the PL/pgSQL for loop statements

<!-- /wp:paragraph -->
