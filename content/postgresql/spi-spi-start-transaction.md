[#id](#SPI-SPI-START-TRANSACTION)

## SPI_start_transaction

SPI_start_transaction — obsolete function

## Synopsis

```
void SPI_start_transaction(void)
```

[#id](#id-1.8.12.11.6.5)

## Description

`SPI_start_transaction` does nothing, and exists only for code compatibility with earlier PostgreSQL releases. It used to be required after calling `SPI_commit` or `SPI_rollback`, but now those functions start a new transaction automatically.
