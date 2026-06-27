/**
 * Prisma seed — populates the database with initial categories, tags, demo
 * users with profiles, sample AI models with NFT assets, reviews, ratings,
 * and inference execution history for a premium Hackathon Demo state.
 *
 * Run: pnpm prisma:seed
 */
import { PrismaClient } from '../node_modules/.prisma/client';
import { Framework, ModelStatus } from '../src/modules/common/types/enums';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱  Starting Hackathon Demo Database Seeding…');

  // ── 1. Clear Existing Data (Clean State Guarantee) ──────────────────────────
  console.log('🧹  Cleaning old database records...');
  await prisma.inferenceLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.rating.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.modelVersion.deleteMany({});
  await prisma.aIModel.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});

  // ── 2. Create Categories ───────────────────────────────────────────────────
  console.log('📂  Seeding Categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Classification',
        slug: 'classification',
        description: 'Image, text, and multi-modal classification models.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'NLP & LLMs',
        slug: 'nlp',
        description: 'Natural language processing — LLMs, tokenizers, and word embeddings.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Computer Vision',
        slug: 'vision',
        description: 'Object detection, segmentation, and advanced image generation.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Health & Bio',
        slug: 'health',
        description: 'Medical imaging diagnostic assistants and bioinformatics models.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Finance',
        slug: 'finance',
        description: 'Fraud detection, algorithmic trading, and credit risk models.',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Generative AI',
        slug: 'generative',
        description: 'Text-to-image generators, audio synthesis, and diffusion models.',
      },
    }),
  ]);

  // ── 3. Create Tags ─────────────────────────────────────────────────────────
  console.log('🏷️  Seeding Tags...');
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
    'quantized',
    'open-source',
    'medical',
  ];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.create({
        data: { name, slug: name },
      }),
    ),
  );

  // ── 4. Create Demo Users & Profiles ────────────────────────────────────────
  console.log('👥  Seeding Demo Users and Web3 Profiles...');
  const usersData = [
    {
      username: 'alice_dev',
      email: 'alice@monad.academy',
      bio: 'Lead AI Engineer at Monad Labs. Building decentralized vision architectures.',
      profile: {
        fullName: 'Alice Smith',
        website: 'https://alice.ai',
        twitter: 'https://twitter.com/alice_ai',
        github: 'https://github.com/alice-dev',
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      },
    },
    {
      username: 'bob_researcher',
      email: 'bob@pluralis.network',
      bio: 'Distributed learning researcher. Specializing in NLP security and BERT models.',
      profile: {
        fullName: 'Bob Johnson',
        website: 'https://bob-research.io',
        twitter: 'https://twitter.com/bob_research',
        github: 'https://github.com/bob-johnson',
        walletAddress: '0x2506B22221b2d07A58db7DFBD8912e75D9183424',
      },
    },
    {
      username: 'charlie_hack',
      email: 'charlie@hackathon.org',
      bio: 'Fullstack Web3 & ML developer. Enthusiast for edge deployments and ONNX pipelines.',
      profile: {
        fullName: 'Charlie Lee',
        website: 'https://charlie.codes',
        twitter: 'https://twitter.com/charlie_web3',
        github: 'https://github.com/charlie-codes',
        walletAddress: '0xCD2345a557b45A87f891A9C682A45C3F0eE7264a',
      },
    },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        bio: u.bio,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${u.username}`,
        profile: {
          create: u.profile,
        },
      },
      include: { profile: true },
    });
    users.push(user);
  }

  // ── 5. Create Sample Models & Versions (Minted NFTs) ──────────────────────
  console.log('🤖  Seeding Sample AI Models & Minted NFT Versions...');
  const sampleModels = [
    {
      title: 'CIFAR-10 ResNet Classifier',
      description:
        'Lightweight ResNet-20 trained on CIFAR-10 achieving 92.4% accuracy. Highly optimized for resource-constrained edge devices.',
      framework: Framework.PYTORCH,
      status: ModelStatus.PUBLISHED,
      license: 'MIT',
      categorySlug: 'classification',
      tagNames: ['pytorch', 'resnet', 'edge', 'open-source'],
      owner: users[0], // Alice
      version: '1.0.0',
      nft: {
        nftTokenId: '1',
        fileCid: 'QmYwAPJzv5CZ1sA5xKVrncu86dFn28xx95U6575Y1bA',
        metadataCid: 'QmPChg2biF11ju91B86KGrNtzJGw1E4i1i3A2C87bA',
        txHash: '0x3ef0c78a9c8b7454f7620bc1290da2583fc86ec45bdf4129b01abc3985cd61ef',
        ownerAddress: users[0].profile?.walletAddress,
        fileSize: 48592034,
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      },
    },
    {
      title: 'Sentiment Analysis BERT',
      description:
        'Fine-tuned DistilBERT model for binary sentiment classification on e-commerce and product reviews. Macro F1 = 0.94.',
      framework: Framework.TENSORFLOW,
      status: ModelStatus.PUBLISHED,
      license: 'Apache-2.0',
      categorySlug: 'nlp',
      tagNames: ['bert', 'transformers', 'open-source'],
      owner: users[1], // Bob
      version: '2.1.0',
      nft: {
        nftTokenId: '2',
        fileCid: 'QmR82Hw1y5CZ1sA5xKVrncu86dFn28xx95U6575Y2bB',
        metadataCid: 'QmQKg2biF11ju91B86KGrNtzJGw1E4i1i3A2C87bB',
        txHash: '0x7df0c78a9c8b7454f7620bc1290da2583fc86ec45bdf4129b01abc3985cd72ab',
        ownerAddress: users[1].profile?.walletAddress,
        fileSize: 268435456,
        sha256: 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
      },
    },
    {
      title: 'YOLOv8 Medical Chest Detector',
      description:
        'Custom YOLOv8 object detection model trained on chest X-ray scans for rapid pneumonia and abnormality identification.',
      framework: Framework.PYTORCH,
      status: ModelStatus.PUBLISHED,
      license: 'CC-BY-4.0',
      categorySlug: 'health',
      tagNames: ['yolo', 'pytorch', 'medical'],
      owner: users[0], // Alice
      version: '0.9.0',
      nft: {
        nftTokenId: '3',
        fileCid: 'QmN83Hw1y5CZ1sA5xKVrncu86dFn28xx95U6575Y3cC',
        metadataCid: 'QmRKg2biF11ju91B86KGrNtzJGw1E4i1i3A2C87cC',
        txHash: '0x9ef0c78a9c8b7454f7620bc1290da2583fc86ec45bdf4129b01abc3985cd83cd',
        ownerAddress: users[0].profile?.walletAddress,
        fileSize: 84591032,
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    },
    {
      title: 'Real-time Credit Scorer',
      description:
        'Scikit-learn tree-based ensemble classifier mapping user parameters to credit risk profiles in milliseconds. AUC = 0.89.',
      framework: Framework.SKLEARN,
      status: ModelStatus.PUBLISHED,
      license: 'MIT',
      categorySlug: 'finance',
      tagNames: ['sklearn', 'open-source'],
      owner: users[2], // Charlie
      version: '1.2.0',
      nft: {
        nftTokenId: '4',
        fileCid: 'QmZ84Hw1y5CZ1sA5xKVrncu86dFn28xx95U6575Y4dD',
        metadataCid: 'QmSKg2biF11ju91B86KGrNtzJGw1E4i1i3A2C87dD',
        txHash: '0xbef0c78a9c8b7454f7620bc1290da2583fc86ec45bdf4129b01abc3985cd94de',
        ownerAddress: users[2].profile?.walletAddress,
        fileSize: 12590240,
        sha256: '5d4e3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d',
      },
    },
    {
      title: 'Decentralized Anime Diffuser',
      description:
        'Stable Diffusion 1.5 weights fine-tuned on Anime portrait datasets, serving lightweight generation tasks over edge environments.',
      framework: Framework.PYTORCH,
      status: ModelStatus.DRAFT,
      license: 'CreativeML-OpenRAIL-M',
      categorySlug: 'generative',
      tagNames: ['diffusion', 'pytorch', 'quantized'],
      owner: users[2], // Charlie
      version: '0.5.0',
      nft: null,
    },
  ];

  const models = [];
  for (const m of sampleModels) {
    const category = categories.find((c) => c.slug === m.categorySlug);
    if (!category) continue;

    const modelTags = tags.filter((t) => m.tagNames.includes(t.slug));

    const model = await prisma.aIModel.create({
      data: {
        title: m.title,
        description: m.description,
        framework: m.framework,
        status: m.status,
        license: m.license,
        ownerId: m.owner.id,
        categoryId: category.id,
        tags: {
          create: modelTags.map((t) => ({ tagId: t.id })),
        },
      },
    });

    await prisma.modelVersion.create({
      data: {
        modelId: model.id,
        version: m.version,
        changelog: 'Initial release for Hackathon demo.',
        isLatest: true,
        fileCid: m.nft?.fileCid ?? null,
        metadataCid: m.nft?.metadataCid ?? null,
        nftTokenId: m.nft?.nftTokenId ?? null,
        txHash: m.nft?.txHash ?? null,
        ownerAddress: m.nft?.ownerAddress ?? null,
        fileSize: m.nft?.fileSize ?? null,
        sha256: m.nft?.sha256 ?? null,
      },
    });

    models.push(model);
  }

  // ── 6. Seed Ratings & Reviews ──────────────────────────────────────────────
  console.log('⭐️  Seeding Yorum ve Puanlamaları (Reviews & Ratings)...');
  const reviewPool = [
    {
      content:
        'Inference latency is extremely low on Monad! Took only 45ms. Accuracy is exactly 92.4% as advertised.',
      rating: 5,
    },
    {
      content:
        'Using this in our medical visualization dashboard. The IPFS weights load quickly. Highly recommended!',
      rating: 5,
    },
    {
      content:
        'Clean architecture, weight hashes match the on-chain SHA-256 metadata perfectly. Great open-source release.',
      rating: 4,
    },
    {
      content:
        'Well-formed classification weights. We fine-tuned it on additional target data, gas prices were minimal.',
      rating: 4,
    },
  ];

  // Distribute reviews across published models
  const publishedModels = models.filter((m) => m.status === ModelStatus.PUBLISHED);
  for (let i = 0; i < publishedModels.length; i++) {
    const model = publishedModels[i];
    const user = users[(i + 1) % users.length]; // reviewer

    const reviewData = reviewPool[i % reviewPool.length];

    await prisma.review.create({
      data: {
        modelId: model.id,
        userId: user.id,
        content: reviewData.content,
      },
    });

    await prisma.rating.create({
      data: {
        modelId: model.id,
        userId: user.id,
        value: reviewData.rating,
      },
    });
  }

  // ── 7. Seed Inference Logs ─────────────────────────────────────────────────
  console.log('💻  Seeding Demo Inference logs...');
  const logsPool = [
    {
      prompt: 'Classify this input image: image_url://car.jpg',
      output: 'Prediction: sports_car (confidence: 97.4%)',
      time: 55,
      tokens: 45,
    },
    {
      prompt:
        'Summarize: The decentralized AI marketplace uses Monad chain for EVM state matching.',
      output: 'AI Marketplace matches ML model weights on IPFS with Monad ERC-721 token bounds.',
      time: 145,
      tokens: 92,
    },
    {
      prompt: 'Predict risk metrics for credit ledger ID 48190.',
      output: 'Risk Score: LOW (Prob: 0.12, Decision: APPROVED)',
      time: 32,
      tokens: 38,
    },
  ];

  for (let i = 0; i < publishedModels.length; i++) {
    const model = publishedModels[i];
    const user = users[i % users.length];
    const logData = logsPool[i % logsPool.length];

    await prisma.inferenceLog.create({
      data: {
        modelId: model.id,
        walletAddress: user.profile?.walletAddress || '0x0000000000000000000000000000000000000000',
        prompt: logData.prompt,
        output: logData.output,
        inferenceTimeMs: logData.time,
        tokensUsed: logData.tokens,
        status: 'COMPLETED',
      },
    });
  }

  // ── 8. Seed Analytics Events ───────────────────────────────────────────────
  console.log('📈  Seeding Analytics events...');
  const eventTypes = ['VIEW_MODEL', 'RUN_INFERENCE'];
  for (const model of publishedModels) {
    for (let j = 0; j < 5; j++) {
      const et = eventTypes[j % eventTypes.length];
      const user = users[j % users.length];
      await prisma.analyticsEvent.create({
        data: {
          eventType: et,
          modelId: model.id,
          userId: user.id,
        },
      });
    }
  }

  console.log('✅  Hackathon Database Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
