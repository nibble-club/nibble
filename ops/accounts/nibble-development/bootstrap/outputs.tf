output regions {
  value = [
    module.dev_bootstrap_default.region,
    module.dev_bootstrap_us_west_1.region,
    module.dev_bootstrap_us_east_1.region,
    module.dev_bootstrap_us_east_2.region
  ]
}

output states {
  value = [
    module.dev_bootstrap_default.state,
    module.dev_bootstrap_us_west_1.state,
    module.dev_bootstrap_us_east_1.state,
    module.dev_bootstrap_us_east_2.state
  ]
}

output tables {
  value = [
    module.dev_bootstrap_default.table,
    module.dev_bootstrap_us_west_1.table,
    module.dev_bootstrap_us_east_1.table,
    module.dev_bootstrap_us_east_2.table
  ]
}
