[#id](#SPI-SPI-ROLLBACK)

## SPI_rollback

SPI_rollback, SPI_rollback_and_chain — abort the current transaction

## Synopsis

```
void SPI_rollback(void)
```

```
void SPI_rollback_and_chain(void)
```

[#id](#id-1.8.12.11.5.6)

## Description

`SPI_rollback` rolls back the current transaction. It is approximately equivalent to running the SQL command `ROLLBACK`. After the transaction is rolled back, a new transaction is automatically started using default transaction characteristics, so that the caller can continue using SPI facilities.

`SPI_rollback_and_chain` is the same, but the new transaction is started with the same transaction characteristics as the just finished one, like with the SQL command `ROLLBACK AND CHAIN`.

These functions can only be executed if the SPI connection has been set as nonatomic in the call to `SPI_connect_ext`.
