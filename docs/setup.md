# Setup e Desenvolvimento

## Pré-requisitos
- Node.js 20+
- Docker 24+ e Docker Compose
- Terraform 1.6+
- AWS CLI (para LocalStack e/ou AWS real)
- Credenciais AWS (para uso real) e Stripe (opcional)

## Passos
1. Instalar dependências
   - `npm ci`
2. Configurar `.env`
   - Copie `/.env.example` para `.env` e preencha variáveis
3. Rodar em desenvolvimento
   - `npm run start:dev`
4. Testar endpoints
   - `POST /webhooks/register` body `{"url":"http://localhost:4000/hook","secret":"segredo"}`
   - `POST /pix/charges` body `{"amount": 100, "description": "Teste"}`
   - `POST /pix/webhook` body livre
5. Verificar saúde
   - `GET /health` deve retornar `{"ok":true,...}`

## LocalStack (SQS)
1. Subir serviços
   - `docker compose up -d --build`
2. Criar filas
   - `aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name webhooks-queue`
   - `aws --endpoint-url http://localhost:4566 sqs create-queue --queue-name webhooks-dlq`
3. Configurar `.env`
   - `AWS_SQS_QUEUE_URL=http://localhost:4566/000000000000/webhooks-queue`
   - `AWS_SQS_DLQ_URL=http://localhost:4566/000000000000/webhooks-dlq`

## Stripe (opcional)
- `STRIPE_SECRET_KEY` e `STRIPE_SIGNING_SECRET` para validação de assinatura
- O endpoint `POST /stripe/webhook` usa corpo raw para `constructEvent`

## Build e Produção
- `npm run typecheck`
- `npm run build`
- `npm run start:prod`

## Docker
- Build:
  - `docker build -t checkout-pix-webhooks:latest .`
- Run:
  - `docker run -p 3000:3000 --env-file .env checkout-pix-webhooks:latest`

## Postgres com Docker Compose
- Subir tudo com LocalStack e Postgres:
  - `docker compose up -d --build`
- O serviço `api` usa `WEBHOOK_TARGETS_STORAGE=db` e `DB_URL=postgres://postgres:postgres@postgres:5432/checkout_pix`
- Para conectar localmente:
  - Host: `localhost`, Porta: `5432`, DB: `checkout_pix`, User: `postgres`, Pass: `postgres`
