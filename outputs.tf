output "db_connect_string" {
  description = "MySQL database connection string"
  value       = "HOST=${aws_db_instance.database.endpoint}; DATABASE=${var.MYSQL_DATABASE}; USER=${var.MYSQL_USER}; PASS=${var.MYSQL_PASSWORD}"
  sensitive   = true
}

output "backend_public_dns" {
  description = "Backend server public DNS"
  value       = aws_instance.backend.public_dns
  # sensitive = true
}

# output "frontend_domain" {
#   description = "Frotend website domain"
#   value       = aws_s3_bucket.frontend.website_domain
#   sensitive   = true
# }

output "frontend_endpoint" {
  description = "Frotend website endpoint"
  value       = aws_s3_bucket.frontend.website_endpoint
  # sensitive   = true
}