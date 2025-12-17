# Runbook de Operação e Incidentes

## Healthcheck
- Endpoint: `GET /health`
- Retorna `ok`, `targets` e estatísticas da fila (SQS ou memória)

## Problemas Comuns
- Falha de entrega de webhook
  - Verifique conectividade entre serviço e destino (timeout)
  - Cheque `DLQ` (SQS) ou `dlq` (InMemory) e analise payloads
- Backlog alto na fila
  - Escale réplicas da aplicação
  - Ajuste `MaxNumberOfMessages` e `VisibilityTimeout`
- Assinatura Stripe inválida
  - Confirme `STRIPE_SIGNING_SECRET`
  - Garanta que o corpo é raw (já configurado em `src/main.ts:1`)
- Rate limit excedido
  - Ajuste parâmetros de `express-rate-limit` ou relaxe para endpoints internos

## Ações
- Reprocessar mensagens da DLQ
  - SQS: mova manualmente da DLQ para a fila principal após corrigir destino
  - InMemory: não persistente; corrigir destino e reenviar eventos de origem
- Pausar consumo
  - Desligamento limpo chama `stop()` nas filas; escale réplicas para 0
- Alterar destinos
  - `POST /webhooks/register` para adicionar novos
  - `WEBHOOK_DEFAULT_TARGETS` para iniciar com defaults em boot

## Observabilidade
- Logs estruturados (configurar agregação)
- Métricas de fila (SQS `ApproximateNumberOfMessages`, DLQ size)
- Alarmes
  - Backlog acima de threshold
  - Mensagens na DLQ
  - Taxa de erros de entrega

## Recuperação
- Rollback
  - Reverter para imagem anterior do container
  - Manter compatibilidade com formato de eventos para reprocessamento
- DR
  - Infra SQS é gerenciada; mantenha Terraform state seguro
