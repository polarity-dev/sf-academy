output "db_connect_string" {
  description = "MySQL database connection string"
  value       = "HOST=${aws_db_instance.database.address}:${var.DB_PORT}; DATABASE=${var.DB_NAME}; USER=${var.DB_USERNAME}; PASS=${var.DB_PASSWORD}"
  sensitive = true
}