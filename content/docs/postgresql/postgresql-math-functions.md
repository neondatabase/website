---
title: 'PostgreSQL Math Functions'
tableOfContents: true
---


This page provides the most commonly used PostgreSQL Math functions that help you perform various math operations quickly and effectively.  

| Function                                                                                              | Description                                                                                    | Example                | Result  |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------- | ------- |
| [ABS](/docs/postgresql/postgresql-abs)                   | Calculate the absolute value of a number.                                                      | ABS(-10)               | 10      |
| [CBRT](/docs/postgresql/postgresql-cbrt)                 | Calculate the cube root of a number.                                                           | CBRT(8)                | 2       |
| [CEIL](/docs/postgresql/postgresql-ceil)                 | Round a number to the nearest integer greater than or equal to a specified number.             | CEIL(-12.8)            | -12     |
| [CEILING](/docs/postgresql/postgresql-ceil)              | Same as CEIL                                                                                   |                        |         |
| [DEGREES](/docs/postgresql/postgresql-degrees)           | Convert radians to degrees.                                                                    | DEGREES(PI())          | 180     |
| [DIV](/docs/postgresql/postgresql-div)                   | Return the integer quotient of two numeric values.                                             | DIV(8,3)               | 2       |
| [EXP](/docs/postgresql/postgresql-exp)                   | Return the exponential of a number.                                                            | EXP(1)                 | 2.71    |
| [FACTORIAL](/docs/postgresql/postgresql-factorial)       | Calculate the factorial of a number.                                                           | FACTORIAL(5)           | 120     |
| [FLOOR](/docs/postgresql/postgresql-floor)               | Round a number down to the nearest integer, which is less than or equal to the number.         | FLOOR(10.6)            | 10      |
| [GCD](/docs/postgresql/postgresql-gcd)                   | Calculate the greatest common divisor of two numbers.                                          | GCD(8,12)              | 4       |
| [LCM](/docs/postgresql/postgresql-lcm)                   | Calculate the least common multiples of two numbers.                                           | LCM(8,12)              | 24      |
| [LN](/docs/postgresql/postgresql-ln)                     | Return the natural logarithm of a numeric value.                                               | LN(3)                  | 1.0986  |
| [LOG](/docs/postgresql/postgresql-log)                   | Return the base 10 logarithms of a numeric value.                                              | LOG(1000)              | 3       |
| [LOG](/docs/postgresql/postgresql-log)                   | Return the logarithm of a numeric value to a specified base.                                   | LOG(2, 64)             | 6       |
| [MIN_SCALE](/docs/postgresql/postgresql-min_scale)       | Return the minimum scale of a number.                                                          | MIN_SCALE(12.300)      | 2       |
| [MOD](/docs/postgresql/postgresql-mod)                   | Divide the first parameter by the second one and return the remainder.                         | MOD(10,4)              | 2       |
| [PI](/docs/postgresql/postgresql-pi-function)            | Return the value of PI.                                                                        | PI()                   | 3.14159 |
| [POWER](/docs/postgresql/postgresql-power)               | Raise a number to a specific power.                                                            | POWER(5, 3)            | 125     |
| [RADIANS](/docs/postgresql/postgresql-radians)           | Convert degrees to radians                                                                     | RADIANS(180)           | 3.14159 |
| [ROUND](/docs/postgresql/postgresql-round)               | Round a number to the nearest integer with the number of decimal places.                       | ROUND(10.3)            | 10      |
| [SCALE](/docs/postgresql/postgresql-scale)               | Return the count of decimal digits in the fractional part of a number, which is a scale.       | SCALE(1.234)           | 3       |
| [SIGN](/docs/postgresql/postgresql-sign)                 | Return -1 if the number is negative, 0 if the number is zero, and 1 if the number is positive. | SIGN(-1)               | -1      |
| [SQRT](/docs/postgresql/postgresql-sqrt)                 | Return the square root of a numeric value.                                                     | SQRT(3.0)              | 1.73205 |
| [TRIM_SCALE](/docs/postgresql/postgresql-trim_scale)     | Reduce the scale of a number by removing trailing zeroes.                                      | TRIM_SCALE(12.300)     | 12.3    |
| [TRUNC](/docs/postgresql/postgresql-trunc)               | Truncate a numeric value to a whole number of the specified decimal places                     | TRUNC(12.3)            | 12      |
| [WIDTH_BUCKET](/docs/postgresql/postgresql-width_bucket) | Assign a numeric value to a bucket in an equiwidth histogram.                                  | WIDTH_BUCKET(1,1,10,5) | 1       |
| [RANDOM](/docs/postgresql/postgresql-random)             | Generate a random number between 0 and 1                                                       | RANDOM()               | 0.9684  |
