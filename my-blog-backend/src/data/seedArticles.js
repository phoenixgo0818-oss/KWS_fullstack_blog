/** Seed posts — same shape as the React app; loaded into MongoDB via npm run seed. */
const seedArticles = [
  {
    id: 'learn-react',
    slug: 'learn-react',
    title: 'The Fastest Way to Learn React',
    author: 'KWS Phoenix',
    createdAt: '2026-01-10T10:00:00.000Z',
    content: [
      'React powers most modern frontends. Start with components, props, state, and events—then build a small project before reaching for advanced libraries.',
      'A to-do app or notes UI teaches lists, forms, and state updates. Add routing when you are ready to split the UI into real pages.',
    ],
  },
  {
    id: 'learn-node',
    slug: 'learn-node',
    title: 'Node.js for Full-Stack Developers',
    author: 'KWS Phoenix',
    createdAt: '2026-01-12T10:00:00.000Z',
    content: [
      'Node lets you run JavaScript on the server. Learn modules, npm, async/await, and how to read environment variables before you framework-hop.',
      'Build a tiny JSON API or CLI tool first. That foundation makes Express and database work much easier.',
    ],
  },
  {
    id: 'learn-express',
    slug: 'learn-express',
    title: 'Building REST APIs with Express',
    author: 'KWS Phoenix',
    createdAt: '2026-01-14T10:00:00.000Z',
    content: [
      'Express maps HTTP methods and paths to handler functions. Master routes, middleware, and error handling on a small CRUD API.',
      'Keep controllers thin and validate input early. Your future self will thank you when the frontend starts sending real user data.',
    ],
  },
  {
    id: 'mongodb-basics',
    slug: 'mongodb-basics',
    title: 'MongoDB Basics for MERN Apps',
    author: 'KWS Phoenix',
    createdAt: '2026-01-16T10:00:00.000Z',
    content: [
      'MongoDB stores documents as JSON-like BSON. Learn collections, queries, and how Mongoose schemas map to your Express models.',
      'Model your data around how the app reads it, not every theoretical relation. Start simple, index when queries slow down.',
    ],
  },
  {
    id: 'connect-frontend-backend',
    slug: 'connect-frontend-backend',
    title: 'Connecting React to Your API',
    author: 'KWS Phoenix',
    createdAt: '2026-01-18T10:00:00.000Z',
    content: [
      'Use fetch or axios from React to call your Express API. Handle loading and error states in the UI—users always notice when you skip them.',
      'During development, proxy requests or enable CORS deliberately. Know which environment uses which approach.',
    ],
  },
  {
    id: 'deploy-mern',
    slug: 'deploy-mern',
    title: 'Deploying a MERN App (Overview)',
    author: 'KWS Phoenix',
    createdAt: '2026-01-20T10:00:00.000Z',
    content: [
      'Split concerns: static React build on a CDN or static host, API on a Node host, database on MongoDB Atlas.',
      'Use environment variables for secrets everywhere. Never commit API keys—wire them in at deploy time.',
    ],
  },
];

module.exports = seedArticles;
