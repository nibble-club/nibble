output regions {
  value = [
    module.qa_bootstrap_default.region,
    module.qa_bootstrap_us_west_1.region,
    module.qa_bootstrap_us_east_1.region,
    module.qa_bootstrap_us_east_2.region
  ]
}

output states {
  value = [
    module.qa_bootstrap_default.state,
    module.qa_bootstrap_us_west_1.state,
    module.qa_bootstrap_us_east_1.state,
    module.qa_bootstrap_us_east_2.state
  ]
}

output tables {
  value = [
    module.qa_bootstrap_default.table,
    module.qa_bootstrap_us_west_1.table,
    module.qa_bootstrap_us_east_1.table,
    module.qa_bootstrap_us_east_2.table
  ]
}
