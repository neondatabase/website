---
title: 'PostgreSQL Math Functions'
page_title: 'PostgreSQL Math Functions'
page_description: 'Provide the most commonly used PostgreSQL Match functions that help you perform various math operations quickly and effectively.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/'
ogImage: 'https://www.postgresqltutorial.com//postgresqltutorial/math-functions.png'
updatedOn: '2024-05-19T04:18:23+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL TO_NUMBER() Function'
  slug: 'postgresql-string-functions/postgresql-to_number'
nextLink:
  title: 'PostgreSQL ABS() Function'
  slug: 'postgresql-math-functions/postgresql-abs'
---

This page provides the most commonly used PostgreSQL Math functions that help you perform various math operations quickly and effectively.

| Function                                                          | Description                                                                                     | Example                 | Result   |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------- | -------- |
| [ABS](postgresql-math-functions/postgresql-abs)                   | Calculate the absolute value of a number.                                                       | ABS(\-10\)              | 10       |
| [CBRT](postgresql-math-functions/postgresql-cbrt)                 | Calculate the cube root of a number.                                                            | CBRT(8\)                | 2        |
| [CEIL](postgresql-math-functions/postgresql-ceil)                 | Round a number to the nearest integer greater than or equal to a specified number.              | CEIL(\-12\.8\)          | \-12     |
| [CEILING](postgresql-math-functions/postgresql-ceil)              | Same as CEIL                                                                                    |                         |          |
| [DEGREES](postgresql-math-functions/postgresql-degrees)           | Convert radians to degrees.                                                                     | DEGREES(PI())           | 180      |
| [DIV](postgresql-math-functions/postgresql-div)                   | Return the integer quotient of two numeric values.                                              | DIV(8,3\)               | 2        |
| [EXP](postgresql-math-functions/postgresql-exp)                   | Return the exponential of a number.                                                             | EXP(1\)                 | 2\.71    |
| [FACTORIAL](postgresql-math-functions/postgresql-factorial)       | Calculate the factorial of a number.                                                            | FACTORIAL(5\)           | 120      |
| [FLOOR](postgresql-math-functions/postgresql-floor)               | Round a number down to the nearest integer, which is less than or equal to the number.          | FLOOR(10\.6\)           | 10       |
| [GCD](postgresql-math-functions/postgresql-gcd)                   | Calculate the greatest common divisor of two numbers.                                           | GCD(8,12\)              | 4        |
| [LCM](postgresql-math-functions/postgresql-lcm)                   | Calculate the least common multiples of two numbers.                                            | LCM(8,12\)              | 24       |
| [LN](postgresql-math-functions/postgresql-ln)                     | Return the natural logarithm of a numeric value.                                                | LN(3\)                  | 1\.0986  |
| [LOG](postgresql-math-functions/postgresql-log)                   | Return the base 10 logarithms of a numeric value.                                               | LOG(1000\)              | 3        |
| [LOG](postgresql-math-functions/postgresql-log)                   | Return the logarithm of a numeric value to a specified base.                                    | LOG(2, 64\)             | 6        |
| [MIN_SCALE](postgresql-math-functions/postgresql-min_scale)       | Return the minimum scale of a number.                                                           | MIN_SCALE(12\.300\)     | 2        |
| [MOD](postgresql-math-functions/postgresql-mod)                   | Divide the first parameter by the second one and return the remainder.                          | MOD(10,4\)              | 2        |
| [PI](postgresql-math-functions/postgresql-pi-function)            | Return the value of PI.                                                                         | PI()                    | 3\.14159 |
| [POWER](postgresql-math-functions/postgresql-power)               | Raise a number to a specific power.                                                             | POWER(5, 3\)            | 125      |
| [RADIANS](postgresql-math-functions/postgresql-radians)           | Convert degrees to radians                                                                      | RADIANS(180\)           | 3\.14159 |
| [ROUND](postgresql-math-functions/postgresql-round)               | Round a number to the nearest integer with the number of decimal places.                        | ROUND(10\.3\)           | 10       |
| [SCALE](postgresql-math-functions/postgresql-scale)               | Return the count of decimal digits in the fractional part of a number, which is a scale.        | SCALE(1\.234\)          | 3        |
| [SIGN](postgresql-math-functions/postgresql-sign)                 | Return \-1 if the number is negative, 0 if the number is zero, and 1 if the number is positive. | SIGN(\-1\)              | \-1      |
| [SQRT](postgresql-math-functions/postgresql-sqrt)                 | Return the square root of a numeric value.                                                      | SQRT(3\.0\)             | 1\.73205 |
| [TRIM_SCALE](postgresql-math-functions/postgresql-trim_scale)     | Reduce the scale of a number by removing trailing zeroes.                                       | TRIM_SCALE(12\.300\)    | 12\.3    |
| [TRUNC](postgresql-math-functions/postgresql-trunc)               | Truncate a numeric value to a whole number of the specified decimal places                      | TRUNC(12\.3\)           | 12       |
| [WIDTH_BUCKET](postgresql-math-functions/postgresql-width_bucket) | Assign a numeric value to a bucket in an equiwidth histogram.                                   | WIDTH_BUCKET(1,1,10,5\) | 1        |
| [RANDOM](postgresql-math-functions/postgresql-random)             | Generate a random number between 0 and 1                                                        | RANDOM()                | 0\.9684  |
