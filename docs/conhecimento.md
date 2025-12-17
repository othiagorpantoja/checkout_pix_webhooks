# Passagem de Conhecimento

## Objetivo
Garantir que equipe consiga operar, evoluir e resolver incidentes do Checkout Pix Webhooks.

## Agenda Sugerida
- Arquitetura e fluxos (1h)
- Setup local e testes de endpoints (1h)
- Operação em produção e runbook (1h)
- Infraestrutura com Terraform e CI/CD (1h)
- Segurança (assinaturas, rate limit, helmet) (30min)
- Roadmap e melhorias (30min)

## Materiais
- `docs/arquitetura.md` visão técnica e fluxos
- `docs/setup.md` guia passo a passo
- `docs/deploy.md` processo de implantação
- `docs/runbook.md` operação e incidentes

## Exercícios Práticos
- Criar cobrança Pix e registrar destino webhook
- Simular falha de entrega e observar DLQ
- Validar assinatura Stripe com segredo válido e inválido
- Subir LocalStack e integrar filas

## Referências no Código
- `src/webhooks/webhooks.service.ts:1`, `src/common/queue/sqs-queue.ts:1`, `src/common/queue/inmemory-queue.ts:1`
- `src/stripe/stripe.controller.ts:1`, `src/pix/pix.controller.ts:1`

## Critérios de Conclusão
- Consegue rodar localmente e em Docker
- Compreende como diagnosticar backlog e DLQ
- Consegue configurar deploy e variáveis de ambiente
