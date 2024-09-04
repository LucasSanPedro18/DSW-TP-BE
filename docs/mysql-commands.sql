create database if not exists GEEV;

use GEEV;

## uncomment if you are not using docker
 create user if not exists dsw@'%' identified by 'dsw';
 grant select, update, insert, delete on GEEV.* to dsw@'%';


create table if not exists `GEEV`.`eventos` (
  `idEvento` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NULL,
  `cuposGral` INT UNSIGNED NULL,
  `descripcion` VARCHAR(255) NULL,
  `fotoEvento` BOOL NULL,
  `fecha` DATE NULL,
  `hora` INT  NULL,
  PRIMARY KEY (`id`));

create table if not exists `GEEV`.`eventoCategoria` (
  `characterId` INT UNSIGNED NOT NULL,
  `categoriaNombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`characterId`, `itemName`),
  CONSTRAINT `fk_characterItem_character`
    FOREIGN KEY (`characterId`)
    REFERENCES `eventos`.`characters` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

insert into eventos.eventos values(1,'festichola',200,'que se yo',101,11,22);
insert into eventos.eventoCategoria values(1,'Techno');
