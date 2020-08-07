# Nibble Frontend

This is the frontend for [Nibble](nibble.club).

To start a development version:

```shell
    yarn start
```

To use Storybook (UI development tool, allows you to see components in isolation):

```shell
    yarn storybook
```

## Environment Variables

There are three kinds of environment variables:

1. Simple config, e.g. a boolean flag that is different in dev, qa, and prod environments. For these type of environment variables, simply set its value in `environments/{environment}.env`. Make sure to set it in all pertinent environments!
2. Backend location, e.g. the URL for the GraphQL endpoint. These should be set as an SSM parameter in the backend deployment, and will automatically be pulled in, capitalized, prefixed with `"REACT_APP_"`, and added to the environment.
3. Secret, e.g. Mapbox API key. Use the command `python3 scripts/set_secret_env_var [name1]=[value1] [name2]=[value2]`. Note this will be environment global, so setting this in dev will set it for all developers, not just you. Use a lowercase, underscored name scheme without `REACT_APP_` prefixed (e.g. `mapbox_api_key`). These will be automatically pulled into the environment.
