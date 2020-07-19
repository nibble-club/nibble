output region {
  value = data.aws_region.current.name
}

output state {
  value = aws_s3_bucket.state.bucket
}

output table {
  value = aws_dynamodb_table.state_lock.name
}