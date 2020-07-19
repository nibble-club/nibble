output cloudwatch_log_group_name {
  value = aws_cloudwatch_log_group.log_group.name
}

output cloudwatch_log_group_arn {
  value = aws_cloudwatch_log_group.log_group.arn
}

output function_name {
  value = aws_lambda_function.lambda.function_name
}

output arn {
  value = aws_lambda_function.lambda.arn
}

output release_alias_name {
  value = aws_lambda_alias.release_alias.name
}

output release_alias_arn {
  value = aws_lambda_alias.release_alias.arn
}

output release_alias_invoke_arn {
  value = aws_lambda_alias.release_alias.invoke_arn
}