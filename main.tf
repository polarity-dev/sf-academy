variable "SECRET_KEY" {}
variable "ACCESS_KEY" {}


provider "aws" {
  access_key = var.ACCESS_KEY
  secret_key = var.SECRET_KEY
  region     = "eu-central-1"
}
