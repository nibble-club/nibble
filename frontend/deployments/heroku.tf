resource heroku_app frontend {
  name   = replace(var.environment_namespace, "_", "-")
  region = "us"

  sensitive_config_vars = var.heroku_sensitive_config_vars

  buildpacks = ["https://github.com/mars/create-react-app-buildpack"]
}

resource heroku_build frontend {
  app        = heroku_app.frontend.id
  buildpacks = ["https://github.com/mars/create-react-app-buildpack"]

  source = {
    path = "build/frontend.tar.gz"
  }
}

resource heroku_formation frontend {
  app      = heroku_app.frontend.id
  type     = "web"
  quantity = 1
  size     = "hobby"
}
