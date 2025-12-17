# Visão Geral e Arquitetura

## Objetivo
API para cobranças Pix com recebimento de webhooks resiliente, retries, DLQ, integração opcional com Stripe e infraestrutura automatizada.

## Módulos
- `AppModule` carrega os módulos principais (Config, Pix, Webhooks, Stripe, Health).
- `PixModule` expõe criação/consulta de cobranças Pix e entrada de webhooks Pix.
- `WebhooksModule` gerencia destinos de webhooks, enfileira eventos e realiza a entrega.
- `StripeModule` recebe webhooks da Stripe (com verificação de assinatura quando configurada).
- `HealthModule` expõe métricas simples da fila e dos destinos.

## Fluxo de Webhooks
- Enfileiramento: `WebhooksService` empilha eventos em SQS (`SqsQueue`) ou memória (`InMemoryQueue`).
- Consumo: worker interno processa mensagens e entrega via HTTP (`axios`) com timeout.
- Resiliência:
  - SQS: usa `visibility timeout` e `redrive policy` para DLQ.
  - Memória: retries exponenciais com `WEBHOOK_MAX_RETRIES` e DLQ interno.
- Assinatura: entrega com `x-webhook-signature` via HMAC `sha256` quando o destino tem `secret`.

## Referências no Código
- `src/webhooks/webhooks.service.ts:1` serviço de webhooks (targets, enqueue, consumo e HMAC).
- `src/common/queue/sqs-queue.ts:1` integração com SQS e DLQ.
- `src/common/queue/inmemory-queue.ts:1` fila em memória com backoff e DLQ.
- `src/stripe/stripe.controller.ts:1` webhook Stripe com raw body e validação de assinatura.
- `src/pix/pix.controller.ts:1` endpoints Pix.
- `src/pix/pix.service.ts:1` integra provider Pix com enfileiramento de eventos.

## Segurança e Confiabilidade
- `helmet` e `express-rate-limit` habilitados.
- `app.enableShutdownHooks()` para desligamento limpo (interrompe consumo de fila).
- `POST /stripe/webhook` recebe `raw body` para verificar assinatura da Stripe.

## Endpoints Principais
- `POST /webhooks/register` registrar destinos `{ url, secret? }`.
- `GET /webhooks` listar destinos.
- `POST /pix/charges` criar cobrança `{ amount, description? }`.
- `GET /pix/charges/:id` consultar cobrança.
- `POST /pix/webhook` receber eventos Pix.
- `POST /stripe/webhook` receber eventos Stripe.
- `GET /health` métricas simples: targets e estatísticas da fila.

## Variáveis de Ambiente
- `PORT` porta HTTP
- `AWS_REGION` região AWS
- `AWS_SQS_QUEUE_URL` URL da fila SQS
- `AWS_SQS_DLQ_URL` URL da DLQ
- `STRIPE_SECRET_KEY` chave da API Stripe (opcional)
- `STRIPE_SIGNING_SECRET` segredo de assinatura do webhook Stripe (opcional)
- `WEBHOOK_MAX_RETRIES` retries na fila em memória
- `WEBHOOK_DEFAULT_TARGETS` JSON com destinos iniciais
