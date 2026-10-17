# Verificação da apresentação PTE

Rodada de 17/10/2026, em ambiente local. Dados fictícios, sem executar transportes.

- Computador: navegação, cinco categorias de veículos, imagens carregadas, cartões e diálogos, formulário público, perfil, criação de pedido dentro da conta, busca, filtros, acompanhamento, conversa com a equipe, notas internas e cancelamento.
- Celular (390 × 844): menu, serviços, categorias, SW4 com transparência, imagem da experiência, formulário público, agendamento dentro da conta, confirmação com protocolo, conversa nos dois sentidos, atualização administrativa, agenda, cancelamento, busca e estado vazio.
- Pedidos desta rodada encerrados: PTE-E55B1820, PTE-8642446B, PTE-3280944F e PTE-1B04F302.
- Testes de API: autenticação obrigatória; origem inválida bloqueada; pedidos e mensagens de outro usuário invisíveis; tentativa de alterar pedido alheio retorna 404; notas administrativas ausentes da resposta ao cliente; datas, horários, categorias e passageiros inválidos rejeitados; cancelamento repetido retorna 409.

As verificações responsivas usam emulação de tamanho no navegador, não aparelhos físicos. O envio de um pedido registra uma solicitação; a reserva depende da confirmação da equipe.
