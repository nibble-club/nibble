resource aws_elasticache_cluster redis {
  apply_immediately        = true
  cluster_id               = replace("${var.environment_namespace}-redis", "_", "-")
  engine                   = "redis"
  engine_version           = "5.0.6"
  maintenance_window       = var.maintenance_window
  node_type                = "cache.t2.micro"
  num_cache_nodes          = 1
  parameter_group_name     = "default.redis5.0"
  port                     = 6379
  security_group_ids       = [aws_security_group.redis_security_group.id]
  snapshot_retention_limit = 5
  subnet_group_name        = aws_elasticache_subnet_group.redis_subnet_group.name
}

resource aws_elasticache_subnet_group redis_subnet_group {
  name       = replace("${var.environment_namespace}-redis", "_", "-")
  subnet_ids = var.private_subnet_ids
}
