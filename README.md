# Medusa English

The best way to learn English: Use OpenAI to learn English through sentences.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Tech Stack

- [electron-vite](https://electron-vite.org/)
- [react](https://react.dev/)
- [react-router-dom](https://reactrouter.com/en/main/start/overview)
- [typescript](https://www.typescriptlang.org/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [drizzle-orm](https://orm.drizzle.team/)
- [tailwindcss](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [framer-motion](https://www.framer.com/motion/)
- [zustand](https://github.com/pmndrs/zustand)
- [lucide-react](https://lucide.dev)
- [radash](https://radash-docs.vercel.app/docs/getting-started)

## TTS

If you want to use TTS, you need to set a proxy for Edge TTS to link "speech.platform.bing.com" if you are in mainland China.

## Local packaging

```bash
pnpm i
pnpm build:mac
```

Then open dist dir, and double click "medusa-english-xxx.dmg" to install
