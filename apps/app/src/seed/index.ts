import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";
import slugify from "slugify";

const emptyRichText: any = {
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    children: [
      {
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        children: [
          {
            type: "text",
            text: "Placeholder",
            version: 1,
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
          },
        ],
      },
    ],
    direction: "ltr",
  },
};

function generateSecurePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const all = uppercase + lowercase + numbers + special

  // Ensure at least one of each required character type
  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Fill the rest randomly to make it 16 characters
  for (let i = password.length; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

export const seed = async () => {
  const payload = await getPayload({ config });
  const seedMode = process.env.SEED_MODE || "full";

  console.log(`Seeding database (mode: ${seedMode})...`);

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  let adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    adminPassword = generateSecurePassword()
    console.warn('\n⚠️  WARNING: ADMIN_PASSWORD not set in environment variables')
    console.warn('Generated a secure password for the admin user:')
    console.warn('─'.repeat(60))
    console.warn(`Email: ${adminEmail}`)
    console.warn(`Password: ${adminPassword}`)
    console.warn('─'.repeat(60))
    console.warn('IMPORTANT: Save this password securely! It will not be shown again.\n')
  }

  const existingUsers = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: adminEmail,
      },
    },
  });

  let adminUser;
  if (existingUsers.docs.length === 0) {
    console.log("Creating admin user...");
    adminUser = await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin User",
        role: "admin",
      },
    });
  } else {
    adminUser = existingUsers.docs[0];
    console.log("Admin user already exists.");
  }

  if (seedMode === "minimal") {
    console.log("Applying minimal baseline globals...");

    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        siteTitle: process.env.NEXT_PUBLIC_SITE_NAME || "My Site",
        termsOfService: emptyRichText,
        privacyPolicy: emptyRichText,
      },
    });

    await payload.updateGlobal({
      slug: "header",
      data: {
        navItems: [],
      },
    });

    await payload.updateGlobal({
      slug: "footer",
      data: {
        navItems: [],
      },
    });

    await payload.updateGlobal({
      slug: "content-generation-settings",
      data: {
        apiConfig: {
          baseUrl: "",
          apiKey: "",
        },
        companyContext: {
          companyName: "",
          location: "",
          expertise: "",
          primaryColor: "",
          secondaryColor: "",
        },
        keywords: [],
        topicResearch: {
          prompt: "",
        },
        postGeneration: {
          prompt: "",
        },
        featuredImageStyles: [],
        infographic: {
          dataExtractionPrompt: "",
          imageGenerationPrompt: "",
        },
      },
    });

    console.log("Minimal baseline seed completed successfully.");
    return;
  }

  // Create sample media
  console.log("Creating sample media...");
  const mediaData = [
    {
      alt: "Getting Started with Our Platform",
    },
    {
      alt: "Best Practices for Modern Development",
    },
    {
      alt: "Future of Tech and Innovation",
    },
  ];

  const mediaItems = await Promise.all(
    mediaData.map(async (data, index) => {
      const response = await fetch(
        `https://picsum.photos/seed/${index + 42}/1200/630`
      );
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return payload.create({
        collection: "media",
        data,
        file: {
          data: buffer,
          mimetype: "image/jpeg",
          name: `sample-image-${index + 1}.jpg`,
          size: buffer.length,
        },
      });
    })
  );

  // Sample categories and tags
  console.log("Creating categories and tags...");
  const categoryNames = [
    "Tutorials",
    "Onboarding",
    "Development",
    "Engineering",
    "Future Tech",
    "AI",
  ];
  const tagNames = [
    "basics",
    "guide",
    "platform",
    "nextjs",
    "performance",
    "clean-code",
    "payload",
    "innovation",
    "trends",
    "artificial-intelligence",
  ];

  const categoryMap: Record<string, number> = {};
  const tagMap: Record<string, number> = {};

  await Promise.all(
    categoryNames.map(async (name) => {
      const cat = await payload.create({
        collection: "categories",
        data: {
          name,
          slug: slugify(name, { lower: true, strict: true }),
        },
      });
      categoryMap[name] = cat.id as number;
    })
  );

  await Promise.all(
    tagNames.map(async (name) => {
      const tag = await payload.create({
        collection: "tags",
        data: {
          name,
          slug: slugify(name, { lower: true, strict: true }),
        },
      });
      tagMap[name] = tag.id as number;
    })
  );

  // Sample posts data
  const postsData = [
    {
      title: "Getting Started with Our Platform",
      slug: "getting-started",
      excerpt:
        "Learn the basics of how to use our platform effectively for your next project.",
      image: mediaItems[0].id,
      categories: ["Tutorials", "Onboarding"],
      tags: ["basics", "guide", "platform"],
      publishedDate: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 5
      ).toISOString(), // 5 days ago
      meta: {
        title: "Complete Guide to Getting Started",
        description:
          "The ultimate guide for new users to master our platform in minutes.",
      },
    },
    {
      title: "Best Practices for Modern Development",
      slug: "best-practices",
      excerpt:
        "Discover the latest tips and techniques for building high-performance web applications.",
      image: mediaItems[1].id,
      categories: ["Development", "Engineering"],
      tags: ["nextjs", "performance", "clean-code", "payload"],
      publishedDate: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 2
      ).toISOString(), // 2 days ago
      meta: {
        title: "Modern Web Development Best Practices 2024",
        description:
          "Stay ahead of the curve with these essential engineering tips for modern teams.",
      },
    },
    {
      title: "Building for the Future",
      slug: "building-for-the-future",
      excerpt:
        "Explore the vision and thought leadership behind the technologies of tomorrow.",
      image: mediaItems[2].id,
      categories: ["Future Tech", "AI"],
      tags: ["innovation", "trends", "artificial-intelligence"],
      publishedDate: new Date().toISOString(),
      meta: {
        title: "The Future of Technology: What to Expect",
        description:
          "An in-depth look at the emerging technologies that will shape our world.",
      },
    },
  ];

  console.log("Creating sample posts...");
  for (const post of postsData) {
    await payload.create({
      collection: "posts",
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.image,
        author: adminUser.id,
        _status: "published",
        publishedDate: post.publishedDate,
        categories: post.categories.map((name) => categoryMap[name]),
        tags: post.tags.map((name) => tagMap[name]),
        meta: {
          ...post.meta,
          image: post.image,
        },
        content: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                direction: "ltr",
                children: [
                  {
                    type: "text",
                    text: `This is a comprehensive guide about ${post.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
                    version: 1,
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                  },
                ],
              },
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                direction: "ltr",
                children: [
                  {
                    type: "text",
                    text: `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
                    version: 1,
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                  },
                ],
              },
            ],
            direction: "ltr",
          },
        },
      },
    });
  }

  console.log("Seed completed successfully.");
};

if (process.env.PAYLOAD_SEED === "true") {
  seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}
