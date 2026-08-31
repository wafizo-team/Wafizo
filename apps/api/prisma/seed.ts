import { PrismaClient, ReviewStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Nettoyage basique (optionnel selon vos besoins)
  await prisma.review.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  // Création d'un utilisateur de test
  const user = await prisma.user.create({
    data: {
      email: 'owner@wafizo.com',
      name: 'Wafa Owner',
    },
  });

  // Création d'un business de test
  const business = await prisma.business.create({
    data: {
      name: 'Wafizo Bistro',
      slug: 'wafizo-bistro', // <-- Ajoutez cette ligne ici
      userId: user.id,
    },
  });
  // Liste de ~30 avis mockés
  const reviewsData = [
    {
      rating: 5,
      content: 'Service incroyable, personnel très accueillant !',
      authorName: 'Alice Martin',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 1,
      content: 'Attente interminable et plat froid. Très déçu.',
      authorName: 'Marc Durand',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 4,
      content: 'Très bon rapport qualité-prix, je recommande.',
      authorName: 'Sophie Bernard',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 3,
      content: "Correct, sans plus. Peut mieux faire sur l'accueil.",
      authorName: 'Thomas Petit',
      status: 'pending',
      sentiment: 'neutral',
    },
    {
      rating: 5,
      content: 'Une magnifique découverte, tout était parfait !',
      authorName: 'Julie Leroy',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 2,
      content: 'Bruyant et service trop lent un samedi soir.',
      authorName: 'David Moreau',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 5,
      content: 'Le meilleur de la ville, foncez les yeux fermés.',
      authorName: 'Emma Simon',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 4,
      content: 'Très propre et rapide. Rien à dire.',
      authorName: 'Lucas Laurent',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 1,
      content: 'Erreur dans la commande et aucun geste commercial.',
      authorName: 'Chloé Michel',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 3,
      content: "Un peu cher pour la quantité, mais c'est bon.",
      authorName: 'Hugo Garcia',
      status: 'pending',
      sentiment: 'neutral',
    },
    {
      rating: 5,
      content: 'Personnel au top et ambiance chaleureuse.',
      authorName: 'Manon David',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 4,
      content: "Très bien situé, facile d'accès.",
      authorName: 'Nathan Bertrand',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 2,
      content: "La qualité a baissé par rapport à l'année dernière.",
      authorName: 'Camille Roux',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 5,
      content: 'Exceptionnel ! Bravo à toute l’équipe.',
      authorName: 'Louis Vincent',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 3,
      content: 'Correct mais un peu bruyant.',
      authorName: 'Zoé Fourcade',
      status: 'pending',
      sentiment: 'neutral',
    },
    {
      rating: 4,
      content: 'Service rapide même en heure de pointe.',
      authorName: 'Gabriel Lefebvre',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 1,
      content: 'Fuyez, mauvaise expérience du début à la fin.',
      authorName: 'Sarah Mercier',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 5,
      content: 'Superbe décoration et plats succulents.',
      authorName: 'Jules Bonnet',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 4,
      content: 'Très bon accueil, je reviendrai.',
      authorName: 'Léa Dupont',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 3,
      content: 'Moyen, j’attendais un peu mieux.',
      authorName: 'Antoine Lambert',
      status: 'pending',
      sentiment: 'neutral',
    },
    {
      rating: 5,
      content: 'Rien à redire, tout est parfait.',
      authorName: 'Inès Faure',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 2,
      content: 'Déçu par la fraîcheur des produits.',
      authorName: 'Mathis Girard',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 5,
      content: 'Une vraie réussite, bravo !',
      authorName: 'Clara Clement',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 4,
      content: 'Très satisfaite de ma visite.',
      authorName: 'Sarah Renard',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 3,
      content: 'Passable, personnel distant.',
      authorName: 'Paul Chevalier',
      status: 'pending',
      sentiment: 'neutral',
    },
    {
      rating: 5,
      content: 'Absolument parfait, merci pour tout !',
      authorName: 'Rose Gauthier',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 1,
      content: 'Inadmissible, commande jamais reçue.',
      authorName: 'Tom Perrot',
      status: 'pending',
      sentiment: 'negative',
    },
    {
      rating: 4,
      content: 'Très bien, belle surprise.',
      authorName: 'Louise Lemaire',
      status: 'replied',
      sentiment: 'positive',
    },
    {
      rating: 3,
      content: 'Correct sans plus.',
      authorName: 'Arthur Masson',
      status: 'pending',
      sentiment: 'neutral',
    },
    {
      rating: 5,
      content: 'Je recommande vivement cet endroit !',
      authorName: 'Alice Marchand',
      status: 'replied',
      sentiment: 'positive',
    },
  ];

  // Insertion des avis reliés au business
  for (const review of reviewsData) {
    await prisma.review.create({
      data: {
        rating: review.rating,
        content: review.content,
        authorName: review.authorName,
        status: ReviewStatus.PENDING, // Utilisation d'un statut valide de l'enum
        businessId: business.id,
      },
    });
  }
  console.log(`✅ Seeding finished. Inserted ${reviewsData.length} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
