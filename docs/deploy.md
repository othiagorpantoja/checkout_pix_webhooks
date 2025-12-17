# Processo de Implantação

## Infraestrutura (AWS)
1. Configure credenciais AWS no ambiente de CI/CD ou máquina de deploy
2. Provisionamento com Terraform
   - `cd infra/terraform`
   - `terraform init`
   - `terraform apply -auto-approve`
3. Outputs
   - Use `queue_url` e `dlq_url` nos envs `AWS_SQS_QUEUE_URL` e `AWS_SQS_DLQ_URL`

## Aplicação
1. Build
   - `npm ci && npm run typecheck && npm run build`
2. Docker (recomendado)
   - `docker build -t <repo>/checkout-pix-webhooks:<tag> .`
   - `docker push <repo>/checkout-pix-webhooks:<tag>`
   - `docker run -p 3000:3000 --env-file .env <repo>/checkout-pix-webhooks:<tag>`
3. Reverse Proxy
   - Coloque atrás de Nginx/ALB com HTTPS
   - Configure healthcheck para `GET /health`

## CI/CD
- Workflow atual (`.github/workflows/ci.yml`) valida lint, typecheck e build
- Para deploy automatizado:
  - Adicione etapa de build/push Docker e `terraform plan/apply` conforme sua estratégia
  - Armazene segredos em `GitHub Actions Secrets` (envs e credenciais AWS)

## Configuração de Ambiente
- Produção
  - `AWS_REGION`, `AWS_SQS_QUEUE_URL`, `AWS_SQS_DLQ_URL`
  - `STRIPE_SECRET_KEY`, `STRIPE_SIGNING_SECRET` (se usar Stripe)
  - `WEBHOOK_DEFAULT_TARGETS` com destinos iniciais (JSON)
- Observabilidade
  - Coletor de logs (ex.: CloudWatch Logs)
  - Métricas do health endpoint e fila (SQS `ApproximateNumberOfMessages`)

## Escala e Alta Disponibilidade
- Múltiplas réplicas podem consumir da mesma fila SQS
- Defina `visibility timeout` adequado e monitore DLQ
- Use auto-scaling baseado em backlog de mensagens
