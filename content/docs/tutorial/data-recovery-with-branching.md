---
title: Data recovery with branching
enableTableOfContents: true
---

## Remove duplicates from the shoes table

You received an email from a colleague asking you to clean the data in the `shoes` table, because there is some some duplicate data on the front-end. 

When you ran the `SELECT id, model, color FROM shoes` query, you noticed there were indeed a few duplicate rows.

#
id
model
color
1
1
Air Zoom Alphafly
Scream Green/Bright Crimson/Honeydew/Black
2
2
Air Zoom Alphafly
Scream Green/Bright Crimson/Honeydew/Black


To fix that issue, let’s remove duplicates from the shoes tables.

## Run the remove duplicates query on a branch

Run the following query to see duplicates:

```sql
SELECT model, color, COUNT(*) 
FROM (select brand, model, description, color from shoes) AS s
GROUP BY brand, model, description, color
HAVING COUNT(*) > 1
```

| # |         model        | color                                        | count |
|---|----------------------|----------------------------------------------|-------|
| 1 | Invincible Run 2     | Black/Summit White/Summit White              | 2     |
| 2 | Pegasus 39           | Black/Ashen Slate/Cobalt Bliss/White         | 2     |
| 3 | Air Zoom Pegasus 39  | Black/Thunder Blue/Citron Pulse/Hyper Royal  | 2     |


Now run the following command to delete duplicates:

```sql
DELETE FROM shoes a USING shoes b
WHERE a.id > b.id
```

And run `SELECT * FROM shoes` to see the result:

| # |         model        | color                                        |
|---|----------------------|----------------------------------------------|
| 1 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black   |


Whoops! 😬 

It looks like we used the wrong command and accidentally deleted the majority of our data. The whole team is in a panic because you ran the command on production data and now the only available shoe on the website is the `Air Zoom Alphafly`.

But don’t worry. You got this! 

## Recover the lost data
You can use Neon branching to recover the lost data in seconds. All you need to do is to check on the SQL Editor what time you performed the `DELETE` operation.

![image6](https://user-images.githubusercontent.com/13738772/213742652-05006170-1274-4cf9-8e8a-69dcc28d0065.png)


Now, let’s move to the Branches page and click on New Branch

![image4](https://user-images.githubusercontent.com/13738772/213742714-1f1a5b24-d04c-469c-b9fe-cdbe9b92ff9c.png)


You can optionally give a name to your branch. Make sure that the parent branch is `main` and scroll down to the `Time` option.

![image8](https://user-images.githubusercontent.com/13738772/213742797-5ebbdd65-5927-4113-8e40-cc4c65a6db34.png)

You should see a message similar to the one below to indicate that you successfully have created a new branch.

![image1](https://user-images.githubusercontent.com/13738772/213742922-df6b0e88-5e89-4f21-a169-3871df8f293c.png)

Let’s now get back to the SQL Editor and run the following query:

```sql
SELECT * FROM shoes
```

Make sure you select the newly created branch (`backup` in the example below).

![image7](https://user-images.githubusercontent.com/13738772/213742990-775a1c53-aa7c-412e-95cf-60262121224b.png)


model
color
1
Air Zoom Alphafly
Scream Green/Bright Crimson/Honeydew/Black
2
Air Zoom Alphafly
Scream Green/Bright Crimson/Honeydew/Black
3
Air Zoom Alphafly
Total Orange/Bright Crimson/Ghost Green/Black

| # |         model        | color                                          |
|---|----------------------|------------------------------------------------|
| 1 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
| 2 | Air Zoom Alphafly    | Scream Green/Bright Crimson/Honeydew/Black     |
| 3 | Air Zoom Alphafly    | Total Orange/Bright Crimson/Ghost Green/Black  |


Phew 😮‍💨! You successfully recovered the data  🎉! 
What have we seen here?
To recover the data, we introduced a powerful concept: branching.

Neon Branching is a copy of your data that you can create from Head (the most up-to-date state of the database), Time (from a date and time, similar to theexample above) or Log-Sequence-Number (LSN). 

LSN is a unique identifier that is assigned to each transaction in the database, and is used to track the order in which transactions are committed to the database. 

Note: We recommend conducting tests to your schema changes or manual data updates on a new branch rather than on your main database, to avoid schema conflicts or unwanted behavior in your app.
