---
title: Postgres DENSE_RANK function
subtitle: "Returns the rank of the current row, without gaps."
enableTableOfContents: true
---


Use `dense_rank` to assign a rank to each distinct row within a result set. It provides a non-gapped ranking of values which is particularly useful when dealing with datasets where ties need to be acknowledged without leaving gaps in the ranking sequence.




Function signature:


```sql
DENSE_RANK() OVER (
   [PARTITION BY partition_expression, ... ]
   ORDER BY sort_expression [ASC | DESC], ...
)
```


## `DENSE_RANK` example


Let’s say we have a table of students along with their name and score:


**student_scores**

```text
| student_id | student_name | score |
|------------|--------------|-------|
| 1          | Alice        | 85    |
| 2          | Bob          | 92    |
| 3          | Charlie      | 78    |
| 4          | David        | 92    |
| 5          | Eve          | 85    |
| 6          | Frank        | 78    |
```



```sql
CREATE TABLE student_scores (
   student_id SERIAL PRIMARY KEY,
   student_name VARCHAR(50) NOT NULL,
   score INT NOT NULL
);


INSERT INTO student_scores (student_name, score) VALUES
   ('Alice', 85),
   ('Bob', 92),
   ('Charlie', 78),
   ('David', 92),
   ('Eve', 85),
   ('Frank', 78);
```


Use `DENSE_RANK`:




```sql
SELECT
   student_id,
   student_name,
   score,
   DENSE_RANK() OVER (ORDER BY score DESC) AS rank
FROM
   student_scores;
```


This query returns the following values:

```text
| student_id | student_name | score | rank |
|------------|--------------|-------|------|
| 2          | Bob          | 92    | 1    |
| 4          | David        | 92    | 1    |
| 1          | Alice        | 85    | 2    |
| 5          | Eve          | 85    | 2    |
| 3          | Charlie      | 78    | 3    |
| 6          | Frank        | 78    | 3    |
```



## Advanced examples


### Use with `PARTITION BY` and `ORDER BY` clause


Let's modify the previous example to include a `class_id` column to represent different classes:


**student_scores_by_class**

```text
| student_id | student_name | score | class_id |
|------------|--------------|-------|----------|
| 1          | Alice        | 85    | 1        |
| 2          | Bob          | 92    | 1        |
| 3          | Charlie      | 78    | 1        |
| 4          | David        | 92    | 2        |
| 5          | Eve          | 85    | 2        |
| 6          | Frank        | 78    | 2        |
```



```sql
CREATE TABLE student_scores_by_class (
   student_id SERIAL PRIMARY KEY,
   student_name VARCHAR(50) NOT NULL,
   score INT NOT NULL,
   class_id INT NOT NULL
);


INSERT INTO student_scores_by_class (student_name, score, class_id) VALUES
   ('Alice', 85, 1),
   ('Bob', 92, 1),
   ('Charlie', 78, 1),
   ('David', 92, 2),
   ('Eve', 85, 2),
   ('Frank', 78, 2);
```


The `PARTITION BY` clause is used in conjunction with ranking functions to divide the result set into partitions based on one or more columns. Within each partition, the ranking functions operate independently.


```sql
SELECT
   student_id,
   student_name,
   score,
   class_id,
   DENSE_RANK() OVER (PARTITION BY class_id ORDER BY score DESC) AS rank_within_class
FROM
   student_scores_by_class;
```


This query returns the following values:

```text
| student_id | student_name | score | class_id | rank_within_class |
|------------|--------------|-------|----------|-------------------|
| 2          | Bob          | 92    | 1        | 1                 |
| 1          | Alice        | 85    | 1        | 2                 |
| 3          | Charlie      | 78    | 1        | 3                 |
| 4          | David        | 92    | 2        | 1                 |
| 5          | Eve          | 85    | 2        | 2                 |
| 6          | Frank        | 78    | 2        | 3                 |
```



This partitions the result set into two groups based on the `class_id` column, and the ranking is performed independently within each class. As a result, students are ranked within their respective classes, and the ranking starts fresh for each class.


## Implementing `KEEP`-like functionality


The `DENSE_RANK` function does not have a `KEEP` clause as in Oracle. However, you can achieve similar using another approach.


Let's say you want to find the dense rank for the top two scores within each class:


```sql
WITH RankedScores AS (
   SELECT
       student_id,
       student_name,
       score,
       class_id,
       DENSE_RANK() OVER (PARTITION BY class_id ORDER BY score DESC) AS dense_rank
   FROM
       student_scores_by_class
)
SELECT
   student_id,
   student_name,
   score,
   class_id,
   dense_rank
FROM
   RankedScores
WHERE
   dense_rank <= 2;
```


This query returns the following values:

```text
| student_id | student_name | score | class_id | dense_rank |
|------------|--------------|-------|----------|------------|
| 2          | Bob          | 92    | 1        | 1          |
| 1          | Alice        | 85    | 1        | 2          |
| 4          | David        | 92    | 2        | 1          |
| 5          | Eve          | 85    | 2        | 2          |
```

## Additional considerations


### How `dense_rank` different from the `RANK` function?


The `RANK` function assigns a unique rank to each distinct row in the result set and leaves gaps in the ranking sequence when there are ties.
If two or more rows have the same values and are assigned the same rank, the next rank will be skipped.


```sql
SELECT
   student_id,
   student_name,
   score,
   RANK() OVER (ORDER BY score DESC) AS rank
FROM
   student_scores;
```


This query returns the following values:

```text
| student_id | student_name | score | rank |
|------------|--------------|-------|------|
| 2          | Bob          | 92    | 1    |
| 4          | David        | 92    | 1    |
| 1          | Alice        | 85    | 3    |
| 5          | Eve          | 85    | 3    |
| 3          | Charlie      | 78    | 5    |
| 6          | Frank        | 78    | 5    |
```



Alice and Eve, who share the second-highest score, have ranks 3 and 5, and there is a gap in the ranking sequence. When using `DENSE_RANK`, Alice and Eve, who share the second-highest score, both have a rank of 2, and there is no gap in the ranking sequence.

### Aggregations


You can combine `DENSE_RANK` with other functions like `COUNT`, `SUM`, `AVG` for aggregations.


Use with `COUNT`:


```sql
SELECT class_id, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS student_count_rank, COUNT(*) AS student_count
FROM student_scores_by_class
GROUP BY class_id;
```


This query returns the following values:

```text
| class_id | student_count_rank | student_count |
|-----------|---------------------|---------------|
|     2     |          1          |       3       |
|     1     |          1          |       3       |
```

Use with `SUM`:


```sql
SELECT class_id, DENSE_RANK() OVER (ORDER BY SUM(score) DESC) AS total_score_rank, SUM(score) AS total_score
FROM student_scores_by_class
GROUP BY class_id;
```


This query ranks the classes based on their total scores, assigning the highest rank to the class with the highest total score.


This query returns the following values:

```text
| class_id | total_score_rank | total_score |
|-----------|-------------------|-------------|
|     2     |         1         |     255     |
|     1     |         1         |     255     |
```

Use with `AVG`:


```sql
SELECT class_id, DENSE_RANK() OVER (ORDER BY AVG(score) DESC) AS average_score_rank, AVG(score) AS average_score
FROM student_scores_by_class
GROUP BY class_id;
```


This query ranks the classes based on their average scores, assigning the highest rank to the class with the highest average score.


This query returns the following values:

```text
| class_id | average_score_rank |    average_score    |
|-----------|---------------------|---------------------|
|     2     |          1          | 85.0000000000000000|
|     1     |          1          | 85.0000000000000000|
```

### Indexing


Creating indexes on the columns specified in the `ORDER BY` (sorting) and `PARTITION BY` (partitioning) clauses can significantly improve performance. In this case, queries on the `student_scores` table would benefit from creating indexes on `class_id` and `score` columns.

## Resources

- [PostgreSQL Documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL Documentation: JSON Types](https://www.postgresql.org/docs/current/datatype-json.html)

