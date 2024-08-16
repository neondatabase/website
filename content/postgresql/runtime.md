[#id](#RUNTIME)

## Chapter 19. Server Setup and Operation

**Table of Contents**

- [19.1. The PostgreSQL User Account](postgres-user)
- [19.2. Creating a Database Cluster](creating-cluster)

  - [19.2.1. Use of Secondary File Systems](creating-cluster#CREATING-CLUSTER-MOUNT-POINTS)
  - [19.2.2. File Systems](creating-cluster#CREATING-CLUSTER-FILESYSTEM)

- [19.3. Starting the Database Server](server-start)

  - [19.3.1. Server Start-up Failures](server-start#SERVER-START-FAILURES)
  - [19.3.2. Client Connection Problems](server-start#CLIENT-CONNECTION-PROBLEMS)

- [19.4. Managing Kernel Resources](kernel-resources)

  - [19.4.1. Shared Memory and Semaphores](kernel-resources#SYSVIPC)
  - [19.4.2. systemd RemoveIPC](kernel-resources#SYSTEMD-REMOVEIPC)
  - [19.4.3. Resource Limits](kernel-resources#KERNEL-RESOURCES-LIMITS)
  - [19.4.4. Linux Memory Overcommit](kernel-resources#LINUX-MEMORY-OVERCOMMIT)
  - [19.4.5. Linux Huge Pages](kernel-resources#LINUX-HUGE-PAGES)

  - [19.5. Shutting Down the Server](server-shutdown)
  - [19.6. Upgrading a PostgreSQL Cluster](upgrading)

    - [19.6.1. Upgrading Data via pg_dumpall](upgrading#UPGRADING-VIA-PGDUMPALL)
    - [19.6.2. Upgrading Data via pg_upgrade](upgrading#UPGRADING-VIA-PG-UPGRADE)
    - [19.6.3. Upgrading Data via Replication](upgrading#UPGRADING-VIA-REPLICATION)

  - [19.7. Preventing Server Spoofing](preventing-server-spoofing)
  - [19.8. Encryption Options](encryption-options)
  - [19.9. Secure TCP/IP Connections with SSL](ssl-tcp)

    - [19.9.1. Basic Setup](ssl-tcp#SSL-SETUP)
    - [19.9.2. OpenSSL Configuration](ssl-tcp#SSL-OPENSSL-CONFIG)
    - [19.9.3. Using Client Certificates](ssl-tcp#SSL-CLIENT-CERTIFICATES)
    - [19.9.4. SSL Server File Usage](ssl-tcp#SSL-SERVER-FILES)
    - [19.9.5. Creating Certificates](ssl-tcp#SSL-CERTIFICATE-CREATION)

- [19.10. Secure TCP/IP Connections with GSSAPI Encryption](gssapi-enc)

  - [19.10.1. Basic Setup](gssapi-enc#GSSAPI-SETUP)

  - [19.11. Secure TCP/IP Connections with SSH Tunnels](ssh-tunnels)
  - [19.12. Registering Event Log on Windows](event-log-registration)

This chapter discusses how to set up and run the database server, and its interactions with the operating system.

The directions in this chapter assume that you are working with plain PostgreSQL without any additional infrastructure, for example a copy that you built from source according to the directions in the preceding chapters. If you are working with a pre-packaged or vendor-supplied version of PostgreSQL, it is likely that the packager has made special provisions for installing and starting the database server according to your system's conventions. Consult the package-level documentation for details.
