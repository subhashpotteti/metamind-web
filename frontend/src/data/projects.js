import { images } from './images'

export const projects = [
  {
    id: 1,
    title: 'FinFlow Analytics Platform',
    category: 'FinTech',
    description: 'A real-time financial analytics dashboard processing millions of transactions with sub-second latency.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    gradient: 'from-blue-600/80 to-indigo-900/80',
    image: images.fintech,
  },
  {
    id: 2,
    title: 'HealthConnect Mobile App',
    category: 'Healthcare',
    description: 'Cross-platform patient engagement app connecting healthcare providers with patients seamlessly.',
    technologies: ['React Native', 'Firebase', 'Node.js'],
    gradient: 'from-emerald-600/80 to-teal-900/80',
    image: images.healthcare,
  },
  {
    id: 3,
    title: 'SmartRetail Commerce Suite',
    category: 'E-Commerce',
    description: 'Omnichannel retail platform with AI-powered inventory management and personalized shopping experiences.',
    technologies: ['Next.js', 'Python', 'MongoDB', 'Azure'],
    gradient: 'from-purple-600/80 to-violet-900/80',
    image: images.retail,
  },
  {
    id: 4,
    title: 'LogiTrack Supply Chain',
    category: 'Logistics',
    description: 'End-to-end supply chain visibility platform with predictive analytics and route optimization.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Docker'],
    gradient: 'from-orange-600/80 to-red-900/80',
    image: images.logistics,
  },
]
