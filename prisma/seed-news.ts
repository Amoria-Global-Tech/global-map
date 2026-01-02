import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleNews = [
  {
    title: "Introducing Amoria Connect - Our New Collaboration Platform",
    slug: "introducing-amoria-connect",
    excerpt: "We're excited to announce the launch of Amoria Connect, a powerful collaboration platform designed to streamline team communication and project management.",
    content: `<p>We're thrilled to introduce <strong>Amoria Connect</strong>, our latest innovation in team collaboration and project management.</p>
    <h2>Key Features</h2>
    <ul>
      <li>Real-time messaging and video calls</li>
      <li>Project tracking with Kanban boards</li>
      <li>File sharing and document collaboration</li>
      <li>Integration with popular tools</li>
    </ul>
    <p>Amoria Connect is designed to help teams work more efficiently, whether in the office or remote. Start your free trial today!</p>`,
    category: "product",
    tags: ["product launch", "collaboration", "productivity"],
    author: "Amoria Team",
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date(),
  },
  {
    title: "New Feature: AI-Powered Analytics Dashboard",
    slug: "ai-powered-analytics-dashboard",
    excerpt: "Our analytics dashboard now includes AI-powered insights to help you make data-driven decisions faster than ever.",
    content: `<p>We've enhanced our analytics dashboard with cutting-edge AI capabilities that provide actionable insights from your data.</p>
    <h2>What's New</h2>
    <ul>
      <li>Predictive analytics for business forecasting</li>
      <li>Automated anomaly detection</li>
      <li>Natural language queries</li>
      <li>Custom report generation</li>
    </ul>
    <p>These features are available to all Pro and Enterprise users starting today.</p>`,
    category: "feature",
    tags: ["AI", "analytics", "data"],
    author: "Product Team",
    isPublished: true,
    isFeatured: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Amoria Tech Global Expands to East Africa",
    slug: "amoria-expands-east-africa",
    excerpt: "We're proud to announce our expansion into the East African market with new offices in Kenya and Tanzania.",
    content: `<p>Amoria Tech Global continues its growth journey with the opening of new offices in Nairobi, Kenya and Dar es Salaam, Tanzania.</p>
    <p>This expansion allows us to better serve our growing client base in the East African region and provide localized support.</p>
    <h2>What This Means for Our Clients</h2>
    <ul>
      <li>Local support teams in your timezone</li>
      <li>Faster response times</li>
      <li>Regional partnerships and integrations</li>
    </ul>`,
    category: "announcement",
    tags: ["expansion", "East Africa", "growth"],
    author: "Corporate Communications",
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Security Update: Enhanced Two-Factor Authentication",
    slug: "enhanced-two-factor-authentication",
    excerpt: "We've upgraded our security infrastructure with improved two-factor authentication options for all users.",
    content: `<p>Security is our top priority. We've rolled out enhanced two-factor authentication (2FA) options across all our platforms.</p>
    <h2>New 2FA Options</h2>
    <ul>
      <li>Authenticator app support (Google, Microsoft, Authy)</li>
      <li>Hardware security keys (YubiKey, etc.)</li>
      <li>Biometric authentication on mobile</li>
      <li>Backup codes for recovery</li>
    </ul>
    <p>We strongly recommend enabling 2FA on your account for maximum security.</p>`,
    category: "update",
    tags: ["security", "2FA", "authentication"],
    author: "Security Team",
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Partnership with Rwanda ICT Chamber",
    slug: "partnership-rwanda-ict-chamber",
    excerpt: "Amoria Tech Global partners with Rwanda ICT Chamber to support digital innovation in Rwanda.",
    content: `<p>We're honored to announce our strategic partnership with the Rwanda ICT Chamber to advance digital transformation initiatives in Rwanda.</p>
    <p>This partnership will focus on:</p>
    <ul>
      <li>Supporting local tech startups</li>
      <li>Providing training and mentorship programs</li>
      <li>Collaborating on government digital initiatives</li>
      <li>Hosting tech events and hackathons</li>
    </ul>`,
    category: "news",
    tags: ["partnership", "Rwanda", "ICT"],
    author: "Partnerships Team",
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

async function main() {
  console.log("Seeding news data...");

  for (const news of sampleNews) {
    const existing = await prisma.newsUpdate.findUnique({
      where: { slug: news.slug },
    });

    if (!existing) {
      await prisma.newsUpdate.create({
        data: news,
      });
      console.log(`Created: ${news.title}`);
    } else {
      console.log(`Skipped (exists): ${news.title}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
