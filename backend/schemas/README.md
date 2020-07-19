# Schemas

This directory holds schemas for databases.

## Postgres

Postgres schemas are managed with [Flyway](https://flywaydb.org/). What this means for you: each schema needs to have a higher version than the previous ones, represented by its version number in its file name. The naming schema: `V` first (to represent versioned), then the version number, then 2 underscores, then a description of the updates (e.g. `V1.2__Added_user_table.sql`).

See `deployments` for more on how to actually put these schemas on a server.
