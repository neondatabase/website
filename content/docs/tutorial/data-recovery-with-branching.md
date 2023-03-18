---
title: Data recovery with branching
enableTableOfContents: true
---

Suppose that you asked a fellow developer, Albert Einstein III, to finish populating the `elements` table with data. Being rather absent minded, Albert inserted a few duplicate rows. You noticed the duplicates when running the following query:

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

You decide to write a query to remove the duplicate rows, but your `DELETE` statement has an error in it that deletes a majority of your data. Somehow you've ended up with only the duplicate rows left in your database.

With Neon, you can recover from a data loss scenario like this very easily.

## Recover the lost data

You can use Neon branching to recover the lost data in seconds. All you need to do is to check on the SQL Editor for the time you performed the `DELETE` operation.

![image6](https://user-images.githubusercontent.com/13738772/213742652-05006170-1274-4cf9-8e8a-69dcc28d0065.png)

Now, let’s move to the Branches page and click on New Branch

![image4](https://user-images.githubusercontent.com/13738772/213742714-1f1a5b24-d04c-469c-b9fe-cdbe9b92ff9c.png)

You can optionally give a name to your branch. Make sure that the parent branch is `main` and scroll down to the `Time` option.

![image8](https://user-images.githubusercontent.com/13738772/213742797-5ebbdd65-5927-4113-8e40-cc4c65a6db34.png)

You should see a message similar to the one below to indicate that you successfully have created a new branch.

![image1](https://user-images.githubusercontent.com/13738772/213742922-df6b0e88-5e89-4f21-a169-3871df8f293c.png)

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
