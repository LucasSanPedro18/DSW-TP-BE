create database if not exists sge;

use sge;

create table if not exists`eventos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NULL,
  `cuposGral` INT UNSIGNED NULL,
  `descripcion` VARCHAR(255) NULL,
  `fotoEvento` BOOL NULL,
  `fecha` DATE NULL,
  `hora` INT  NULL,
  PRIMARY KEY (`id`));

create table if not exists `eventoCategoria` (
  `id` INT UNSIGNED NOT NULL,
  `categoriaNombre` VARCHAR(255) NOT NULL,
   `eventoId` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_eventoId_evento`
    FOREIGN KEY (`eventoId`)
    REFERENCES `eventos` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

create table if not exists `cuentas` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`nombre` VARCHAR(255) NULL,
`contraseña` VARCHAR(255) NOT NULL,
`mail` VARCHAR(255) NULL,
`descripcion` VARCHAR(255) NULL,
`foto` INT NULL,
PRIMARY KEY (`id`));


insert into eventos values(100,'festichola',200,'que se yo',true,'20241224',22);
insert into GEEV.eventoCategoria values(1,'Techno',100);

docker run --name dsw-sge -v BD-SGE:/var/lib/mysql -e MYSQL_ROOT_HOST='%' -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" -e MYSQL_PASSWORD="dsw" -e MYSQL_USER="dsw" -e MYSQL_DATABASE='sge' -p 3305:3306 -d percona/percona-server


docker exec -it dsw-sge mysql -u root

GRANT ALL PRIVILEGES ON *.* TO 'dsw'@'%';
FLUSH PRIVILEGES;
