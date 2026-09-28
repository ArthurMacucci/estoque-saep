BEGIN TRANSACTION;
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);
INSERT INTO "categorias" VALUES(1,'Smartphone');
INSERT INTO "categorias" VALUES(2,'Notebook');
INSERT INTO "categorias" VALUES(3,'Smart TV');
INSERT INTO "categorias" VALUES(4,'Acessório');
CREATE TABLE movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA')),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  data_hora TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  observacao TEXT
);
INSERT INTO "movimentacoes" VALUES(1,1,1,'ENTRADA',20,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(2,1,2,'SAIDA',12,'2026-09-28 01:35:12','Vendas da semana');
INSERT INTO "movimentacoes" VALUES(3,2,1,'ENTRADA',10,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(4,2,2,'SAIDA',7,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(5,3,1,'ENTRADA',30,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(6,3,2,'SAIDA',5,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(7,4,1,'ENTRADA',8,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(8,4,2,'SAIDA',2,'2026-09-28 01:35:12','Venda corporativa');
INSERT INTO "movimentacoes" VALUES(9,5,1,'ENTRADA',6,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(10,5,2,'SAIDA',3,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(11,6,1,'ENTRADA',4,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(12,6,2,'SAIDA',3,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(13,7,1,'ENTRADA',12,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(14,7,2,'SAIDA',2,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(15,8,1,'ENTRADA',6,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(16,8,2,'SAIDA',1,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(17,9,1,'ENTRADA',15,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(18,9,2,'SAIDA',4,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(19,10,1,'ENTRADA',40,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(20,10,2,'SAIDA',25,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(21,11,1,'ENTRADA',25,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(22,11,2,'SAIDA',8,'2026-09-28 01:35:12','Vendas');
INSERT INTO "movimentacoes" VALUES(23,12,1,'ENTRADA',3,'2026-09-28 01:35:12','Compra inicial');
INSERT INTO "movimentacoes" VALUES(24,12,2,'SAIDA',1,'2026-09-28 01:35:12','Venda');
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  especificacoes TEXT,
  preco REAL NOT NULL CHECK (preco >= 0),
  quantidade INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  estoque_minimo INTEGER NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0)
);
INSERT INTO "produtos" VALUES(1,'Galaxy S24 128GB',1,'6.2" AMOLED; 128GB; 5G; Bivolt',4299.9,8,5);
INSERT INTO "produtos" VALUES(2,'iPhone 15 256GB',1,'6.1" OLED; 256GB; 5G; USB-C',6499.0,3,4);
INSERT INTO "produtos" VALUES(3,'Moto G54 256GB',1,'6.5" LCD 120Hz; 256GB; 5G',1399.0,25,8);
INSERT INTO "produtos" VALUES(4,'Notebook Dell Inspiron 15',2,'i5 13ª ger.; 16GB RAM; SSD 512GB; 15.6" FHD; 19V',3899.0,6,3);
INSERT INTO "produtos" VALUES(5,'Notebook Lenovo IdeaPad 3',2,'Ryzen 5; 8GB RAM; SSD 256GB; 15.6" FHD',2799.0,3,3);
INSERT INTO "produtos" VALUES(6,'MacBook Air M2',2,'M2; 8GB; SSD 256GB; 13.6" Retina',8999.0,1,2);
INSERT INTO "produtos" VALUES(7,'Smart TV LG 50" 4K',3,'50"; 3840x2160; WebOS; 3 HDMI; 110-240V',2599.0,10,4);
INSERT INTO "produtos" VALUES(8,'Smart TV Samsung 55" QLED',3,'55"; 4K QLED; Tizen; Wi-Fi/Bluetooth',3799.0,5,3);
INSERT INTO "produtos" VALUES(9,'Smart TV TCL 32" HD',3,'32"; 1366x768; Google TV',1099.0,11,5);
INSERT INTO "produtos" VALUES(10,'Carregador USB-C 65W',4,'65W; GaN; Bivolt',149.9,15,10);
INSERT INTO "produtos" VALUES(11,'Fone Bluetooth JBL Tune',4,'Bluetooth 5.3; 40h bateria',249.0,17,10);
INSERT INTO "produtos" VALUES(12,'Mouse sem fio Logitech',4,'2.4GHz; 1000dpi',89.9,2,6);
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  login TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL
);
INSERT INTO "usuarios" VALUES(1,'Administrador','admin','scrypt:32768:8:1$d2Q2Z1npG5FSZNNc$45e56f8aafc4c1d467b675c06f93b85fa830b72f2512fb46a29b92d384dec9b4ff8be13084555f6a14f2bdd32d1291ca4f418af3ab3de207cf566c1c79978b62');
INSERT INTO "usuarios" VALUES(2,'Maria Souza','maria','scrypt:32768:8:1$l9dHn69hl5LhHzXE$02623f999e628b4a1a9c715ff2b1e038c983f5056ba1d03aee244e5f6855698979916556a8cd22c02f9766b96224b435a32cc9ce1e576f66d5338067e0275d60');
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('usuarios',2);
INSERT INTO "sqlite_sequence" VALUES('categorias',4);
INSERT INTO "sqlite_sequence" VALUES('produtos',12);
INSERT INTO "sqlite_sequence" VALUES('movimentacoes',24);
COMMIT;