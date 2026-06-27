# infra/

Bu klasör altyapı tanım kodlarını (Infrastructure as Code) barındırır.

## İçerik Planı

| Araç | Sprint | Açıklama |
|---|---|---|
| Terraform / Pulumi | İleride | Cloud kaynakları (VPC, ECS/K8s, RDS, S3, CloudFront) |
| Kubernetes manifests | İleride | Servis deployment ve scaling tanımları |
| Helm charts | İleride | Kubernetes paket yönetimi |

## Kapsam

Bu klasör yalnızca **cloud altyapısını** tanımlar. Lokal geliştirme ortamı için
`docker/` klasörüne bakın.

## Not

Sprint 1-7 arası bu klasör boş kalır. CI/CD pipeline'ı kurulduktan sonra
(Sprint 7) altyapı tanımları buraya taşınır.
