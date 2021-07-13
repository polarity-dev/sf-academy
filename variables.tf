variable "EC2_AMI" {
  description = "Amazon Machine Images (Ubuntu Server 18.04 LTS (HVM), SSD Volume Type)"
  type        = string
  default     = "ami-06602da18c878f98d"
}

variable "AWS_REGION" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "ACCESS_KEY_ID" {
  description = "AWS access key ID"
  type        = string
  sensitive = true
}

variable "SECRET_ACCESS_KEY" {
  description = "AWS access key secret"
  type        = string
  sensitive = true
}

variable "MYSQL_USER" {
  description = "AWS RDS Database username"
  type        = string
  sensitive = true
}

variable "MYSQL_ROOT_PASSWORD" {
  description = "AWS RDS Database root password"
  type        = string
  sensitive = true
}

variable "MYSQL_PASSWORD" {
  description = "AWS RDS Database user password"
  type        = string
  sensitive = true
}

variable "MYSQL_DATABASE" {
  description = "AWS RDS Database name"
  type        = string
  sensitive = true
}

variable "DB_PORT" {
  description = "AWS RDS Database port"
  type        = string
  sensitive = true
}
