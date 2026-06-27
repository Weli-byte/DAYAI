export const siteConfig = {
  name: 'Decentralized AI Marketplace',
  description:
    'Publish, discover, and trade AI models as NFTs on Monad blockchain. Earn crypto rewards for data contributions. Governed by the community.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://dayai.vercel.app',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/your-org/decentralized-ai-marketplace',
    docs: '/docs',
    monad: 'https://monad.xyz',
  },
} as const;
