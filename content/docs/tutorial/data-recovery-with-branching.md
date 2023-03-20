---
title: Data recovery with branching
enableTableOfContents: true
---

Suppose that you tried to populate the `elements` table with more data but you accidentally inserted several duplicate rows:

```sql
SELECT * FROM elements ORDER BY id;
```

```text
SELECT * FROM elements ORDER BY id;
 id | elementname | atomicnumber | symbol 
----+-------------+--------------+--------
  1 | Hydrogen    |            1 | H
  2 | Helium      |            2 | He
  3 | Lithium     |            3 | Li
  4 | Beryllium   |            4 | Be
  5 | Boron       |            5 | B
  6 | Carbon      |            6 | C
  7 | Nitrogen    |            7 | N
  7 | Nitrogen    |            7 | N
  8 | Oxygen      |            8 | O
  8 | Oxygen      |            8 | O
  9 | Fluorine    |            9 | F
  9 | Fluorine    |            9 | F
 10 | Neon        |           10 | Ne
 10 | Neon        |           10 | Ne
 11 | Sodium      |           11 | Na
 11 | Sodium      |           11 | Na
 12 | Magnesium   |           12 | Mg
 13 | Aluminum    |           13 | Al
 14 | Silicon     |           14 | Si
 15 | Phosphorus  |           15 | P
 16 | Sulfur      |           16 | S
 17 | Chlorine    |           17 | Cl
 18 | Argon       |           18 | Ar
 19 | Potassium   |           19 | K
 20 | Calcium     |           20 | Ca
...
```

You write a query to remove the duplicate rows, but your `DELETE` statement had an error that deleted most of your data. With Neon, you can recover from a data loss scenario like this very easily.

## Recover lost data

You can use Neon branching to recover the lost data in seconds. The only requirement is that you know the point in time to recover to. Since you ran the `DELETE` query from the Neon SQL Editor, you can check the  **History** for the date and time you ran the problematic query.

![Find query time](/docs/get-started-with-neon/delete_query_time)

Now that you know when the data loss occurred, you can restore your data to the time just before that.

1. Navigate to the **Branches** page in the Neon Console.
![Branches page](/docs/get-started-with-neon/branches_page.png)
1. Click **New Branch** to open the branch creation dialog.

1. Enter a name for the branch.
1. Select the parent branch. The data loss occurred on your project's [primary branch](/docs/reference/glossary/#primary-branch) (`main`), so select that one.
1. Select the **Time** option to create a branch with data up to a specific date and time. You determined that the data loss occured on March 20, 2023 at 9:16AM, so you set it to the same date but at 9:15AM, just before you ran the `DELETE` query.
1. Click **Create Branch** to create your branch.

You should see a message similar to the one below to indicate that you successfully have created a new branch.

![New branch connection details](/docs/get-started-with-neon/new_branch_connection_details.png)

Let’s now get back to the SQL Editor in the Neon COnsole and run the following query:

```sql
SELECT * FROM shoes
```

Make sure you select the newly created branch (the `backup` branch in the example below).

![image7](https://user-images.githubusercontent.com/13738772/213742990-775a1c53-aa7c-412e-95cf-60262121224b.png)

```text
| # |         model        | color                                          |
|---|----------------------|------------------------------------------------|
| 1 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
| 2 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
| 3 | Air Zoom Alphafly    | Total Orange/Bright Crimson/Ghost Green/Black  |
```

You successfully recovered the lost data.

What have we seen here?

To recover the data, we introduced a powerful concept: branching

A Neon branch is a copy of your data that you can create from **Head** (the most up-to-date state of the database), **Time** (from a date and time, similar to the example above), or **Log-Sequence-Number (LSN)**.

An LSN is a unique identifier that is assigned to each transaction in the database, and is used to track the order in which transactions are committed to the database.

<Admonition type="note">
We recommend testing to your schema changes or manual data updates on a new branch rather than on the database branch you use for production, to avoid schema conflicts or unwanted behavior in your application.
</Admonition>
