# Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    USUARIOS ||--o{ MOVIMENTACOES : realiza
    PRODUTOS ||--o{ MOVIMENTACOES : possui
    CATEGORIAS ||--o{ PRODUTOS : classifica

    USUARIOS {
        int id PK
        text nome
        text login UK
        text senha_hash
    }
    CATEGORIAS {
        int id PK
        text nome UK
    }
    PRODUTOS {
        int id PK
        text nome
        int categoria_id FK
        text especificacoes
        real preco
        int quantidade
        int estoque_minimo
    }
    MOVIMENTACOES {
        int id PK
        int produto_id FK
        int usuario_id FK
        text tipo "ENTRADA ou SAIDA"
        int quantidade
        text data_hora
        text observacao
    }
```

Versão em texto (para desenhar à mão na prova):

```
CATEGORIAS 1 ────< N PRODUTOS 1 ────< N MOVIMENTACOES N >──── 1 USUARIOS
```

Cardinalidades: uma categoria tem vários produtos; um produto tem várias movimentações; um usuário realiza várias movimentações.
Para visualizar o diagrama Mermaid: cole o bloco em https://mermaid.live ou abra este arquivo no VS Code/GitHub.
