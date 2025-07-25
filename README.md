# Top-Down Multiplayer Game

This is a simple 2D top-down tilemap game built with Next.js and Supabase.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

2. Install dependencies:
   ```
   npm install
   ```

3. In your Supabase project, create a table named `players` with columns:
   - `id` (text, primary key)
   - `x` (integer)
   - `y` (integer)

4. Run the development server:
   ```
   npm run dev
   ```

   Visit http://localhost:3000 to play.

## Multiplayer

This game uses Supabase Realtime to sync player positions in real-time.

## Deployment to Vercel

1. Push your code to GitHub.

2. Import your repository into Vercel.

3. In the Vercel Dashboard, set the environment variables matching `.env.local`.

4. Deploy the project.

5. Your live game will be available at `https://your-vercel-app.vercel.app`. 