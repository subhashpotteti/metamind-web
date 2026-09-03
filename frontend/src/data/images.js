const unsplash = (id, width = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const images = {
  heroOffice: unsplash('photo-1497366754035-f200968a6e72', 2400),
  aboutTeam: unsplash('photo-1521737711867-e3b97375f902'),
  servicesHero: unsplash('photo-1517245386807-bb43f82c33c4', 2000),
  careersHero: unsplash('photo-1556761175-b413da4baf72', 2000),
  culture: unsplash('photo-1552664730-d307ca884978'),
  contact: unsplash('photo-1551836022-d5d88e9218df'),
  homeServices: unsplash('photo-1551434678-e076c223a692', 2000),
  homePurpose: unsplash('photo-1531482615713-2afd69097998', 2000),
  homeTechnology: unsplash('photo-1518770660439-4636190af475', 2000),
  homeGlobal: unsplash('photo-1521295121783-8a321d551ad2', 2000),
  homePortfolio: unsplash('photo-1499750310107-5fef28a66643', 2000),
  homeTestimonials: unsplash('photo-1556761175-4b46a572b786', 2000),
  homeInsights: unsplash('photo-1504639725590-34d0984388bd', 2000),
  roles: unsplash('photo-1517245386807-bb43f82c33c4', 2000),
  webDevelopment: unsplash('photo-1498050108023-c5249f4df085'),
  mobileDevelopment: unsplash('photo-1512941937669-90a1b58e7e9c'),
  cloudSolutions: unsplash('photo-1451187580459-43490279c0fa'),
  aiAutomation: unsplash('photo-1535378917042-10a22c95931a'),
  analytics: unsplash('photo-1551288049-bebda4e38f71'),
  transformation: unsplash('photo-1553877522-43269d4ea984'),
  uiDesign: unsplash('photo-1545235617-9465d2a55698'),
  qaTesting: unsplash('photo-1516321318423-f06f85e504b3'),
  consulting: unsplash('photo-1556761175-5973dc0f32e7'),
  devops: unsplash('photo-1518770660439-4636190af475'),
  fintech: unsplash('photo-1551288049-bebda4e38f71'),
  healthcare: unsplash('photo-1576091160399-112ba8d25d1d'),
  retail: unsplash('photo-1556742049-0cfed4f6a45d'),
  logistics: unsplash('photo-1586528116311-ad8dd3c8310d'),
}

export const serviceImages = [
  images.webDevelopment, images.mobileDevelopment, images.cloudSolutions, images.aiAutomation,
  images.analytics, images.transformation, images.uiDesign, images.qaTesting,
  images.consulting, images.devops,
]
