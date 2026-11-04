# Echo’s Garden

Next.js portfolio. Projects and Music are migrated from [the original portfolio](https://sites.google.com/view/helloecho/home), with source links, performer credits and local copies of the original images.

Migration inventory, missing materials and validation notes: [docs/portfolio-migration.md](docs/portfolio-migration.md).

```sh
npx --yes pnpm@10 install --frozen-lockfile
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Preview [Projects](http://127.0.0.1:3000/projects) and [Music](http://127.0.0.1:3000/music). Google Fonts require network access on the first build. The public portfolio works without database credentials. Live sound specimens and visitor messages use the existing Supabase configuration (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`); admin and upload integrations retain their existing configuration.

The template currently ignores TypeScript build errors. A separate `tsc --noEmit` check reports seven pre-existing errors documented in the migration notes. Browser and real mobile visual checks remain pending because browser tooling was unavailable in the migration session.
