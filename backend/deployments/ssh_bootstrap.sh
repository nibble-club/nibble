#! /bin/bash

sudo apt-get update
sudo apt-get install -y redis-tools
sudo apt-get install -y postgresql-client
sudo apt-get install -y awscli
cd /home/ubuntu
wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/6.5.1/flyway-commandline-6.5.1-linux-x64.tar.gz | tar xvz && sudo ln -s `pwd`/flyway-6.5.1/flyway /usr/local/bin
echo "" | sudo tee -a flyway-6.5.1/conf/flyway.conf
echo "flyway.url=jdbc:postgresql://${db_address}:${db_port}/${db_name}" | sudo tee -a flyway-6.5.1/conf/flyway.conf
echo "flyway.user=${db_username}" | sudo tee -a flyway-6.5.1/conf/flyway.conf
echo "flyway.password=${db_password}" | sudo tee -a flyway-6.5.1/conf/flyway.conf
echo "export REDIS_ADDRESS=${redis_address}" >> /etc/profile
echo "export REDIS_PORT=${redis_port}" >> /etc/profile
echo "export DB_ADDRESS=${db_address}" >> /etc/profile
echo "export DB_PORT=${db_port}" >> /etc/profile
echo "export DB_NAME=${db_name}" >> /etc/profile
echo "export DB_USERNAME=${db_username}" >> /etc/profile
echo "export DB_PASSWORD=${db_password}" >> /etc/profile