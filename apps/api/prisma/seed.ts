import 'dotenv/config'; // <-- Charge automatiquement le fichier .env
import { PrismaClient, ReviewStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Utilise la variable DATABASE_URL définie dans ton fichier .env
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Nettoyage de la base de données...');
  await prisma.reply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.source.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Création d’un utilisateur de test...');
  const user = await prisma.user.create({
    data: {
      email: 'commercant@wafizo.fr',
      name: 'Boulangerie Louise',
      googleId: 'google-mock-id-12345',
    },
  });

  console.log('🏪 Création d’une fiche commerce...');
  const business = await prisma.business.create({
    data: {
      name: 'Boulangerie Louise - Paris 11',
      slug: 'boulangerie-louise-paris-11',
      userId: user.id,
    },
  });

  console.log('🔗 Création d’une source Google...');
  await prisma.source.create({
    data: {
      type: 'GOOGLE',
      externalId: 'place-id-mock-67890',
      businessId: business.id,
    },
  });

  console.log('⭐ Création des avis de test...');
  const mockReviews = [
    {
      authorName: 'Sophie Martin',
      rating: 5,
      content:
        'Excellentes baguettes tradition et accueil toujours très chaleureux !',
      status: ReviewStatus.PUBLISHED,
      businessId: business.id,
    },
    {
      authorName: 'Thomas Dubois',
      rating: 1,
      content: 'Viennoiseries pas fraîches ce matin et service trop lent.',
      status: ReviewStatus.PENDING,
      businessId: business.id,
    },
    {
      authorName: 'Claire Bernard',
      rating: 4,
      content:
        'Très bons gâteaux, dommage qu’il y ait souvent la queue à midi.',
      status: ReviewStatus.PENDING,
      businessId: business.id,
    },
    {
      authorName: 'Lucas Petit',
      rating: 5,
      content: 'Le meilleur pain au chocolat du quartier, sans hésitation !',
      status: ReviewStatus.PUBLISHED,
      businessId: business.id,
    },
    {
      authorName: 'Amélie Roux',
      rating: 2,
      content: 'Erreur dans ma commande et vendeuse désagréable.',
      status: ReviewStatus.PENDING,
      businessId: business.id,
    },
  ];

  for (const reviewData of mockReviews) {
    await prisma.review.create({ data: reviewData });
  }

  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
