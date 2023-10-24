<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                           40.6. A Database Login Event Trigger Example                          |                                                        |                            |                                                       |                                                   |
| :---------------------------------------------------------------------------------------------: | :----------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](event-trigger-table-rewrite-example.html "40.5. A Table Rewrite Event Trigger Example")  | [Up](event-triggers.html "Chapter 40. Event Triggers") | Chapter 40. Event Triggers | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](rules.html "Chapter 41. The Rule System") |

***

## 40.6. A Database Login Event Trigger Example [#](#EVENT-TRIGGER-DATABASE-LOGIN-EXAMPLE)

The event trigger on the `login` event can be useful for logging user logins, for verifying the connection and assigning roles according to current circumstances, or for session data initialization. It is very important that any event trigger using the `login` event checks whether or not the database is in recovery before performing any writes. Writing to a standby server will make it inaccessible.

The following example demonstrates these options.

    -- create test tables and roles
    CREATE TABLE user_login_log (
      "user" text,
      "session_start" timestamp with time zone
    );
    CREATE ROLE day_worker;
    CREATE ROLE night_worker;

    -- the example trigger function
    CREATE OR REPLACE FUNCTION init_session()
      RETURNS event_trigger SECURITY DEFINER
      LANGUAGE plpgsql AS
    $$
    DECLARE
      hour integer = EXTRACT('hour' FROM current_time at time zone 'utc');
      rec boolean;
    BEGIN
    -- 1. Forbid logging in between 2AM and 4AM.
    IF hour BETWEEN 2 AND 4 THEN
      RAISE EXCEPTION 'Login forbidden';
    END IF;

    -- The checks below cannot be performed on standby servers so
    -- ensure the database is not in recovery before we perform any
    -- operations.
    SELECT pg_is_in_recovery() INTO rec;
    IF rec THEN
      RETURN;
    END IF;

    -- 2. Assign some roles. At daytime, grant the day_worker role, else the
    -- night_worker role.
    IF hour BETWEEN 8 AND 20 THEN
      EXECUTE 'REVOKE night_worker FROM ' || quote_ident(session_user);
      EXECUTE 'GRANT day_worker TO ' || quote_ident(session_user);
    ELSE
      EXECUTE 'REVOKE day_worker FROM ' || quote_ident(session_user);
      EXECUTE 'GRANT night_worker TO ' || quote_ident(session_user);
    END IF;

    -- 3. Initialize user session data
    CREATE TEMP TABLE session_storage (x float, y integer);
    ALTER TABLE session_storage OWNER TO session_user;

    -- 4. Log the connection time
    INSERT INTO public.user_login_log VALUES (session_user, current_timestamp);

    END;
    $$;

    -- trigger definition
    CREATE EVENT TRIGGER init_session
      ON login
      EXECUTE FUNCTION init_session();
    ALTER EVENT TRIGGER init_session ENABLE ALWAYS;

***

|                                                                                                 |                                                        |                                                   |
| :---------------------------------------------------------------------------------------------- | :----------------------------------------------------: | ------------------------------------------------: |
| [Prev](event-trigger-table-rewrite-example.html "40.5. A Table Rewrite Event Trigger Example")  | [Up](event-triggers.html "Chapter 40. Event Triggers") |  [Next](rules.html "Chapter 41. The Rule System") |
| 40.5. A Table Rewrite Event Trigger Example                                                     |  [Home](index.html "PostgreSQL 17devel Documentation") |                       Chapter 41. The Rule System |
