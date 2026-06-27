/**
 * Prisma seed — populates the database with initial categories, tags, a demo
 * user, and sample AI models for local development and CI.
 *
 * Run: pnpm prisma:seed
 */
import { PrismaClient } from '../node_modules/.prisma/client';
import { Framework, ModelStatus } from '../src/modules/common/types/enums';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱  Seeding database…');

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'classification' },
      update: {},
      create: {
        name: 'Classification',
        slug: 'classification',
        description: 'Image, text, and multi-modal classification models.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'nlp' },
      update: {},
      create: {
        name: 'NLP',
        slug: 'nlp',
        description: 'Natural language processing — LLMs, tokenizers, embeddings.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vision' },
      update: {},
      create: {
        name: 'Computer Vision',
        slug: 'vision',
        description: 'Object detection, segmentation, and image generation.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'health' },
      update: {},
      create: {
        name: 'Health & Bio',
        slug: 'health',
        description: 'Medical imaging, drug discovery, and bioinformatics models.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'finance' },
      update: {},
      create: {
        name: 'Finance',
        slug: 'finance',
        description: 'Fraud detection, time-series forecasting, risk models.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'generative' },
      update: {},
      create: {
        name: 'Generative',
        slug: 'generative',
        description: 'Text-to-image, audio synthesis, and diffusion models.',
      },
    }),
  ]);

  // ── Tags ───────────────────────────────────────────────────────────────────
  const tagNames = [
    'pytorch',
    'tensorflow',
    'sklearn',
    'transformers',
    'diffusion',
    'bert',
    'resnet',
    'yolo',
    'gpt',
    'llm',
    'edge',
    'federated',
    'open-source',
    'fine-tuned',
    'quantized',
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { slug: name },
        update: {},
        create: { name, slug: name },
      }),
    ),
  );

  // ── Demo user ──────────────────────────────────────────────────────────────
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@marketplace.local',
      bio: 'Demo account — AI researcher and open-source contributor.',
    },
  });

  // ── Sample models ──────────────────────────────────────────────────────────
  const sampleModels: Array<{
    title: string;
    description: string;
    framework: Framework;
    status: ModelStatus;
    license: string;
    categorySlug: string;
    tagNames: string[];
    version: string;
  }> = [
    {
      title: 'CIFAR-10 ResNet Classifier',
      description:
        'Lightweight ResNet-20 trained on CIFAR-10 achieving 92% accuracy. Suitable for edge deployment.',
      framework: Framework.PYTORCH,
      status: ModelStatus.PUBLISHED,
      license: 'MIT',
      categorySlug: 'classification',
      tagNames: ['pytorch', 'resnet', 'open-source', 'edge'],
      version: '1.0.0',
    },
    {
      title: 'Sentiment Analysis BERT',
      description:
        'Fine-tuned DistilBERT for binary sentiment classification on product reviews. F1 = 0.94.',
      framework: Framework.TENSORFLOW,
      status: ModelStatus.PUBLISHED,
      license: 'Apache-2.0',
      categorySlug: 'nlp',
      tagNames: ['bert', 'transformers', 'fine-tuned'],
      version: '2.1.0',
    },
    {
      title: 'YOLOv8 Medical Object Detector',
      description:
        'Custom YOLOv8 trained on chest X-ray datasets for pneumonia detection. Research use only.',
      framework: Framework.PYTORCH,
      status: ModelStatus.PUBLISHED,
      license: 'CC-BY-4.0',
      categorySlug: 'health',
      tagNames: ['yolo', 'pytorch', 'quantized'],
      version: '0.9.0',
    },
    {
      title: 'Credit Risk Scorer',
      description:
        'Gradient-boosted tree ensemble for real-time credit risk scoring. AUC-ROC = 0.89.',
      framework: Framework.SKLEARN,
      status: ModelStatus.PUBLISHED,
      license: 'MIT',
      categorySlug: 'finance',
      tagNames: ['sklearn', 'open-source'],
      version: '1.2.0',
    },
    {
      title: 'Stable Diffusion Fine-tune (Anime)',
      description: 'SD 1.5 fine-tuned on curated anime artwork dataset. Community trained.',
      framework: Framework.PYTORCH,
      status: ModelStatus.DRAFT,
      license: 'CreativeML-OpenRAIL-M',
      categorySlug: 'generative',
      tagNames: ['diffusion', 'pytorch', 'fine-tuned'],
      version: '0.3.0',
    },
    {
      title: 'Federated Learning Aggregator',
      description:
        'FedAvg-based aggregator for privacy-preserving distributed training across edge clients.',
      framework: Framework.JAX,
      status: ModelStatus.PUBLISHED,
      license: 'MIT',
      categorySlug: 'classification',
      tagNames: ['federated', 'edge', 'open-source'],
      version: '1.0.1',
    },
  ];

  for (const m of sampleModels) {
    const category = categories.find((c) => c.slug === m.categorySlug);
    if (!category) continue;

    const modelTags = tags.filter((t) => m.tagNames.includes(t.slug));
    const seedId = `seed_${m.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const model = await prisma.aIModel.upsert({
      where: { id: seedId },
      update: {},
      create: {
        id: seedId,
        title: m.title,
        description: m.description,
        framework: m.framework,
        status: m.status,
        license: m.license,
        ownerId: demoUser.id,
        categoryId: category.id,
        tags: {
          create: modelTags.map((t) => ({ tagId: t.id })),
        },
      },
    });

    await prisma.modelVersion.upsert({
      where: { modelId_version: { modelId: model.id, version: m.version } },
      update: {},
      create: {
        modelId: model.id,
        version: m.version,
        changelog: 'Initial release.',
        isLatest: true,
      },
    });
  }

  console.log('✅  Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
