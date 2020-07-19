output regions {
  value = [
    module.prod_bootstrap_default.region,
    module.prod_bootstrap_us_west_1.region,
    module.prod_bootstrap_us_east_1.region,
    module.prod_bootstrap_us_east_2.region
  ]
}

output states {
  value = [
    module.prod_bootstrap_default.state,
    module.prod_bootstrap_us_west_1.state,
    module.prod_bootstrap_us_east_1.state,
    module.prod_bootstrap_us_east_2.state
  ]
}

output tables {
  value = [
    module.prod_bootstrap_default.table,
    module.prod_bootstrap_us_west_1.table,
    module.prod_bootstrap_us_east_1.table,
    module.prod_bootstrap_us_east_2.table
  ]
}
