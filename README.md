# DSE Blog API

## Setup
1. Clone repo
2. `npm install`
3. Create `.env` (see example)
4. Create database and tables: run `database.sql` in MySQL
5. Start server: `npm start`

## Endpoints (brief)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/posts/published
- GET /api/posts/slug/:slug
- GET /api/posts?category=&tag=&author=
- (protected) POST /api/posts
- (admin) CRUD /api/categories and /api/tags
