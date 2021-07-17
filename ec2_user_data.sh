#!/bin/bash
set -ex
PUBLIC_DNS="$(curl http://169.254.169.254/latest/meta-data/public-hostname 2>/dev/null)"
sudo yum update -y  
sudo yum install -y amazon-linux-extras
sudo yum install -y git
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
cd /var/tmp
git clone ${repo}
cd /var/tmp/sf-academy
echo -e "MYSQL_ROOT_PASSWORD=${mysql_root_password}
MYSQL_USER=${mysql_user}
MYSQL_PASSWORD=${mysql_password}
JWT_SECRET=${jwt_secret}
MYSQL_DATABASE=${mysql_database}
DATABASE_URI=${database_uri}
API_URI=api
USERS_URI=users
EXCHANGE_URI=exchange
FRONTEND_URI=frontend
REACT_APP_NGINX_URI="$PUBLIC_DNS"\n" >> .env
docker-compose up --build