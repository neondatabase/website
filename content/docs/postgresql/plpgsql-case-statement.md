---
title: 'PL/pgSQL CASE Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/plpgsql-case-statement/
ogImage: /postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-simple-case-statement.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PL/pgSQL `case` that executes statements based on a certain condition.

## Introduction to PL/pgSQL CASE Statment

Besides the [if statement](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-if-else-statements/), PostgreSQL provides the `case` statements that allow you to execute a block of code based on conditions.

The `case` statement selects a `when` section to execute from a list of `when` sections based on a condition.

The `case` statement has two forms:

- Simple `case` statement
- Searched `case` statement

Notice that you should not be confused about the `case` statement and [case expression](/docs/postgresql/postgresql-case). The `case` expression evaluates to a value while the `case` statement selects a section to execute based on conditions.

## 1) Simple case statement

Here's the basic syntax of the simple `case` statement:

```
case search-expression
   when expression_1 [, expression_2, ...] then
      when-statements
  [ ... ]
  [else
      else-statements ]
END case;
```

The `search-expression` is an expression that evaluates to a result.

The `case` statement compares the result of the `search-expression` with the `expression` in each `when` branch using equal operator ( `=`) from top to bottom.

If the `case` statement finds a match, it will execute the corresponding `when` section. Additionally, it stops checking the remaining `when` sections

If the `case` statement cannot find any match, it will execute the `else` section.

The `else` section is optional. If the result of the `search-expression` does not match `expression` in the `when` sections and the `else` section does not exist, the `case` statement will raise a `case_not_found` exception.

The following example shows how to use a simple `case` statement:

```
do $$
declare
 rate film.rental_rate%type;
 price_segment varchar(50);
begin
    -- get the rental rate
    select rental_rate into rate
    from film
    where film_id = 100;

 -- assign the price segment
 if found then
  case rate
     when 0.99 then
              price_segment =  'Mass';
     when 2.99 then
              price_segment = 'Mainstream';
     when 4.99 then
              price_segment = 'High End';
     else
        price_segment = 'Unspecified';
     end case;

  raise notice '%', price_segment;
 else
  raise notice 'film not found';
    end if;
end; $$
```

Output:

```
NOTICE:  High End
```

How it works.

First, select the rental rate of the film with id 100.

Second, assign price segment to the price_segment variable if the film id 100 exists or a message otherwise.

Based on the rental rates 0.99, 2.99, or 4.99, the case statement assigns mass, mainstream, or high-end to the `price_segment` variable. If the rental rate is not one of these values, the `case` statement assigns the string Unspecified to the `price_segment` variable.

The following flowchart illustrates the simple `case` statement in this example:

![PL/pgSQL simple case statement](/postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-simple-case-statement.png)

## 2) Searched case statement

The following syntax shows the basic syntax of the searched `case` statement:

```
case
    when boolean-expression-1 then
      statements
  [ when boolean-expression-2 then
      statements
    ... ]
  [ else
      statements ]
end case;
```

In this syntax, the `case` statement evaluates the boolean expressions sequentially from top to bottom until it finds an expression that evaluates to `true`

Subsequently, the case statement executes the corresponding `when` section and immediately stops searching for the remaining expressions.

If no expression evaluates to true, the `case` statement will execute the `else` section.

The `else` section is optional. If you omit the `else` section and there is no expression evaluated to `true`, the `case` statement will raise the `case_not_found` exception.

The following example illustrates how to use a simple `case` statement:

```
do $$
declare
    total_payment numeric;
    service_level varchar(25) ;
begin
     select sum(amount) into total_payment
     from Payment
     where customer_id = 100;

  if found then
     case
     when total_payment > 200 then
               service_level = 'Platinum' ;
           when total_payment > 100 then
            service_level = 'Gold' ;
           else
               service_level = 'Silver' ;
        end case;
  raise notice 'Service Level: %', service_level;
     else
     raise notice 'Customer not found';
  end if;
end; $$
```

How it works:

- First, select the total payment paid by the customer id 100 from the `payment` table.
- Then, assign the service level to the customer based on the total payment

The following diagram illustrates the logic:

![PL/pgSQL searched case statement](/postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-searched-case-statement.png)

Notice that the searched `case` statement is similar to the [if then elsif statement](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-if-else-statements/).

## Summary

- Use the `case` statement to execute a section based on certain conditions.
- Use a simple `case` statement to compare a value with a list of values and if a match is found, execute a section.
- Use a searched `case` statement to evaluate a list of conditions and execute a section if the condition is true.
