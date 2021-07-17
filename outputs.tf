output "db_connect_string" {
  description = "MySQL database connection string"
  value       = "HOST=${aws_db_instance.database.endpoint}; DATABASE=${var.MYSQL_DATABASE}; USER=${var.MYSQL_USER}; PASS=${var.MYSQL_PASSWORD}"
  sensitive = true
}

output "backend_public_dns" {
  description = "Backend server public DNS"
  value       = "${aws_instance.container.public_dns}"
}