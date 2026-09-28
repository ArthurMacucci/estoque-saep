# Requisitos Funcionais

## Requisitos Funcionais (RF)
| ID | Requisito |
|----|-----------|
| RF01 | O sistema deve autenticar usuários por login e senha (senha armazenada com hash). |
| RF02 | O sistema deve bloquear o acesso às telas e à API para usuários não autenticados. |
| RF03 | O sistema deve permitir cadastrar produtos com nome, categoria, especificações, preço e estoque mínimo. |
| RF04 | O sistema deve listar todos os produtos com categoria, quantidade atual e estoque mínimo. |
| RF05 | O sistema deve permitir pesquisar produtos por nome, categoria ou especificação. |
| RF06 | O sistema deve permitir editar os dados de um produto. |
| RF07 | O sistema deve permitir excluir produtos; produtos com movimentações não podem ser excluídos (rastreabilidade). |
| RF08 | O sistema deve registrar entradas de estoque, aumentando a quantidade do produto. |
| RF09 | O sistema deve registrar saídas de estoque, diminuindo a quantidade, e impedir saída maior que o saldo. |
| RF10 | O sistema deve emitir alerta automático quando a quantidade de um produto ficar abaixo do estoque mínimo (na tela inicial, na lista e ao movimentar). |
| RF11 | O sistema deve registrar cada movimentação com produto, tipo, quantidade, responsável (usuário logado), data/hora e observação. |
| RF12 | O sistema deve exibir o histórico completo de movimentações, da mais recente para a mais antiga. |
| RF13 | O sistema deve permitir encerrar a sessão (logout). |

## Requisitos Não Funcionais (RNF)
- RNF01: Interface web simples e intuitiva, funcionando em navegadores atuais.
- RNF02: Validação de dados no servidor (campos obrigatórios, valores não negativos, quantidade > 0).
- RNF03: Banco de dados relacional com integridade referencial (chaves estrangeiras e CHECKs).
- RNF04: Senhas nunca armazenadas em texto puro.

## Regras de Negócio
- RN01: Quantidade em estoque nunca pode ser negativa.
- RN02: Alerta quando `quantidade < estoque_minimo`.
- RN03: O saldo do produto só é alterado por meio de movimentações.
