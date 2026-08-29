import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wafizo';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  let business = await prisma.business.findFirst();

  if (!business) {
    console.log("Aucun business trouvé. Création d'un utilisateur et business de test...");
    const user = await prisma.user.create({
      data: {
        email: 'test@wafizo.com',
        name: 'Test User',
      },
    });

    business = await prisma.business.create({
      data: {
        name: 'Mon Commerce Test',
        slug: 'mon-commerce-test',
        userId: user.id,
      },
    });
  }

  const businessId = business.id;
  console.log('Génération de 30 avis mockés...');

  for (let i = 1; i <= 30; i++) {
    await prisma.review.create({
      data: {
        businessId: businessId,
        authorName: `Client ${i}`,
        rating: (i % 5) + 1,
        content: `Ceci est le commentaire de test numéro ${i} pour valider la pagination et les filtres de la B8.`,
        status: i % 3 === 0 ? 'PENDING' : 'PUBLISHED',
        createdAt: new Date(Date.now() - i * 3600000 * 24),
        reply: i % 2 === 0 ? {
          create: {
            content: `Merci pour votre retour client ${i} !`,
          }
        } : undefined,
      },
    });
  }

  console.log('Seed terminé avec succès (30 avis créés) !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
