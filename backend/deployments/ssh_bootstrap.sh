#! /bin/bash

# install packages
sudo apt-get update
sudo apt-get install -y redis-tools
sudo apt-get install -y postgresql-client
sudo apt-get install -y awscli

# install Postgres client
sudo apt update
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt -y install postgresql-12 postgresql-client-12

# install Flyway
cd /home/ubuntu
wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/6.5.1/flyway-commandline-6.5.1-linux-x64.tar.gz | tar xvz && sudo ln -s `pwd`/flyway-6.5.1/flyway /usr/local/bin
echo "" | sudo tee -a flyway-6.5.1/conf/flyway.conf

# set up Flyway environment
echo "flyway.url=jdbc:postgresql://${db_address}:${db_port}/${db_name}" | sudo tee -a flyway-6.5.1/conf/flyway.conf
echo "flyway.user=${db_username}" | sudo tee -a flyway-6.5.1/conf/flyway.conf
echo "flyway.password=${db_password}" | sudo tee -a flyway-6.5.1/conf/flyway.conf

# include useful environment variables
echo "export REDIS_ADDRESS=${redis_address}" >> /home/ubuntu/.bashrc
echo "export REDIS_PORT=${redis_port}" >> /home/ubuntu/.bashrc
echo "export DB_ADDRESS=${db_address}" >> /home/ubuntu/.bashrc
echo "export DB_PORT=${db_port}" >> /home/ubuntu/.bashrc
echo "export DB_NAME=${db_name}" >> /home/ubuntu/.bashrc
echo "export DB_USERNAME=${db_username}" >> /home/ubuntu/.bashrc
echo "export DB_PASSWORD=${db_password}" >> /home/ubuntu/.bashrc