/* login to mariadb using: sudo mysql */
/* source this script using: source init.sql */
/* source your reset file: source reset-data.sql */
DROP DATABASE IF EXISTS tattoodb;

CREATE DATABASE 'tattoodb';

DROP USER IF EXISTS 'dully' @localhost;

CREATE USER 'dully' @localhost IDENTIFIED BY '@Turtle122302';

/* SELECT User FROM mysql.user WHERE User = 'week6user'; */
GRANT ALL PRIVILEGES ON 'tattoodb'.* TO 'dully' @localhost IDENTIFIED BY '@Turtle122302';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'dully' @localhost;