## Chapter 73. Database Physical Storage

**Table of Contents**

  * *   [73.1. Database File Layout](storage-file-layout.html)
  * [73.2. TOAST](storage-toast.html)

    

  * *   [73.2.1. Out-of-Line, On-Disk TOAST Storage](storage-toast.html#STORAGE-TOAST-ONDISK)
    * [73.2.2. Out-of-Line, In-Memory TOAST Storage](storage-toast.html#STORAGE-TOAST-INMEMORY)

  * *   [73.3. Free Space Map](storage-fsm.html)
  * [73.4. Visibility Map](storage-vm.html)
  * [73.5. The Initialization Fork](storage-init.html)
  * [73.6. Database Page Layout](storage-page-layout.html)

    

  * [73.6.1. Table Row Layout](storage-page-layout.html#STORAGE-TUPLE-LAYOUT)

* [73.7. Heap-Only Tuples (HOT)](storage-hot.html)

This chapter provides an overview of the physical storage format used by PostgreSQL databases.