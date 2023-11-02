## Appendix O. `syncfs()` Caveats

On Linux `syncfs()` may be specified for some configuration parameters (e.g., [recovery\_init\_sync\_method](runtime-config-error-handling#GUC-RECOVERY-INIT-SYNC-METHOD)), server applications (e.g., pg\_upgrade), and client applications (e.g., pg\_basebackup) that involve synchronizing many files to disk. `syncfs()` is advantageous in many cases, but there are some trade-offs to keep in mind.

Since `syncfs()` instructs the operating system to synchronize a whole file system, it typically requires many fewer system calls than using `fsync()` to synchronize each file one by one. Therefore, using `syncfs()` may be a lot faster than using `fsync()`. However, it may be slower if a file system is shared by other applications that modify a lot of files, since those files will also be written to disk.

Furthermore, on versions of Linux before 5.8, I/O errors encountered while writing data to disk may not be reported to the calling program, and relevant error messages may appear only in kernel logs.