---
title: Data recovery with branching
enableTableOfContents: true
---

## Remove duplicates from the elements table

Suppose that some duplicte rows have been introduced into the `elements` table.

When you run the `SELECT id, model, color FROM shoes` query, you noticed there were indeed a few duplicate rows.

```text
| # |         model        | color                                          |
|---|----------------------|------------------------------------------------|
| 1 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
| 2 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
```

To fix that issue, you write a query to remove duplicates from the `shoes` tables.

## Run the remove duplicates query on a branch

Run the following query to see the duplicates:

```sql
SELECT model, color, COUNT(*) 
FROM (select brand, model, description, color from shoes) AS s
GROUP BY brand, model, description, color
HAVING COUNT(*) > 1
```

```text
| # |         model        | color                                        | count |
|---|----------------------|----------------------------------------------|-------|
| 1 | Invincible Run 2     | Black/Summit White/Summit White              | 2     |
| 2 | Pegasus 39           | Black/Ashen Slate/Cobalt Bliss/White         | 2     |
| 3 | Air Zoom Pegasus 39  | Black/Thunder Blue/Citron Pulse/Hyper Royal  | 2     |
```

Now, suppose that you accidentally ran a DELETE state to remove duplicates, but the statement you wrote actually deleted a majority of your data. For example, the following command deletes all but one record:  

```sql
DELETE FROM shoes a USING shoes b
WHERE a.id > b.id
```

And run `SELECT * FROM shoes` to see the result:

```text
| # |         model        | color                                        |
|---|----------------------|----------------------------------------------|
| 1 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black   |
```

Now, you are in a panic because the only available shoe on your website is the `Air Zoom Alphafly`.

With Neon, you can recover from a scenario like this very easily.

## Recover the lost data

You can use Neon branching to recover the lost data in seconds. All you need to do is to check on the SQL Editor what time you performed the `DELETE` operation.

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
