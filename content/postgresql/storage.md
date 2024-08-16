[#id](#STORAGE)

## Chapter 73. Database Physical Storage

**Table of Contents**

- [73.1. Database File Layout](storage-file-layout)
- [73.2. TOAST](storage-toast)

  - [73.2.1. Out-of-Line, On-Disk TOAST Storage](storage-toast#STORAGE-TOAST-ONDISK)
  - [73.2.2. Out-of-Line, In-Memory TOAST Storage](storage-toast#STORAGE-TOAST-INMEMORY)

- [73.3. Free Space Map](storage-fsm)
- [73.4. Visibility Map](storage-vm)
- [73.5. The Initialization Fork](storage-init)
- [73.6. Database Page Layout](storage-page-layout)

* [73.6.1. Table Row Layout](storage-page-layout#STORAGE-TUPLE-LAYOUT)

- [73.7. Heap-Only Tuples (HOT)](storage-hot)

This chapter provides an overview of the physical storage format used by PostgreSQL databases.
