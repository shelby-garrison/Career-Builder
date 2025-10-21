# Agent Development Log

- I used AI mostly as a fast pair-programmer to sanity‑check ideas and spot gaps.
- Prompts were concrete: “Fix OverwriteModelError in Next.js + Mongoose,” “Hydration error on homepage,” “Middleware fails in Edge runtime.”
- I iterated by pasting actual errors/logs and asking for minimal diffs instead of generic advice.
- Biggest refinement: replaced `jsonwebtoken` in middleware with a lightweight JWT payload decode (Edge‑safe) after I encountered the runtime limitation.
- I kept AI suggestions grounded by verifying against the codebase and trimming anything that didn’t match the files, routes or schema.
