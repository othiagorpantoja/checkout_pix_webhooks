# Checkout Pix Webhooks

API NestJS para cobrança Pix com webhooks resilientes, retries e DLQ, integração opcional com Stripe, infraestrutura via Terraform e execução via Docker.

## Stack
- NestJS
- SQS com DLQ (AWS) ou LocalStack
- Axios para entrega de webhooks
- Terraform para infraestrutura
- GitHub Actions para CI

## Variáveis de ambiente
```
PORT=3000
AWS_REGION=us-east-1
AWS_SQS_QUEUE_URL=
AWS_SQS_DLQ_URL=
STRIPE_SECRET_KEY=
STRIPE_SIGNING_SECRET=
```

## Desenvolvimento local
```
npm i
npm run start:dev
```

### Via Docker + LocalStack
```
docker compose up -d --build
```
Criar as filas no LocalStack:
```
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name webhooks-queue
aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name webhooks-dlq
```
Setar `AWS_SQS_QUEUE_URL` e `AWS_SQS_DLQ_URL` conforme saída.

## Deploy de infraestrutura (AWS)
```
cd infra/terraform
terraform init
terraform apply -auto-approve
```
Use os outputs para preencher `AWS_SQS_QUEUE_URL` e `AWS_SQS_DLQ_URL`.

## Endpoints
- `POST /webhooks/register` body `{ url, secret? }`
- `GET /webhooks`
- `DELETE /webhooks/register` body `{ url }`
- `POST /pix/charges` body `{ amount, description? }`
- `GET /pix/charges/:id`
- `POST /pix/webhook` body livre
- `POST /stripe/webhook` com `stripe-signature` se configurado

## Fluxo de webhooks
- Eventos são enfileirados no SQS ou memória
- Processamento com backoff e DLQ quando configurado

## Persistência de destinos
- Por padrão, memória (`WEBHOOK_TARGETS_STORAGE=memory`)
- Em produção, habilite arquivo: `WEBHOOK_TARGETS_STORAGE=file` e `WEBHOOK_TARGETS_PATH=data/targets.json`

## CI
- Validação de build e typescript em cada push/PR

## Documentação Detalhada
- Guia de Setup: `docs/setup.md`
- Arquitetura e Fluxos: `docs/arquitetura.md`
- Processo de Implantação: `docs/deploy.md`
- Runbook de Operação: `docs/runbook.md`
- Passagem de Conhecimento: `docs/conhecimento.md`
