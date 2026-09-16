# Documentation project instructions

## About this project

- Mintlify site for Pix (https://pixcode.sh), "one place for every coding agent".
- **This repository is generated.** The source of truth is the Docusaurus repo
  `thejalalorganization/pix-docs`. Every `.mdx` page here, `docs.json`, the
  logos, and the diagrams are written by `scripts/mintlify.mjs` in that repo
  (`just mintlify`). Edit there, regenerate, commit here.
- Hand edits to `.mdx` files in this repo will be overwritten on the next run.
  If a Mintlify-specific change is needed, change the generator.
- Configuration lives in `docs.json`. Navigation mirrors the three Docusaurus
  sidebars: Docs, Internals, Enterprise.

## Terminology

- "session", not "chat" or "conversation", for the unit of work.
- "agent" for Claude Code, Codex, Cursor, Pi. Pix is not an agent.
- "daemon" for the local server process; "client" for desktop, mobile, browser.
- "handoff" (same session, new agent) and "branch" (new session, same context)
  are distinct and must not be used interchangeably.
- The product name is a variable in `brand.ts` upstream. Never hardcode a new
  name here; change it there and regenerate.

## Style preferences

- Active voice, second person.
- Definition-first: the first sentence of a page says what the thing is.
- One idea per sentence. No em-dashes.
- Sentence case for headings.
- Enterprise capabilities that do not ship yet are marked with a `<Warning>`
  "Planned" callout. Never describe an unshipped feature as available.
- Internals pages describe what is observable on disk in `~/.pix` for v0.25.0.
  Do not assert behaviour that has not been verified against the daemon.

## Content boundaries

- Do not document the obfuscated application bundle or attempt to describe
  source internals; only on-disk data formats and observable behaviour.
- Product screenshots are pending; slots are marked with
  `{/* screenshot: name — caption */}` comments. See `images/screenshots/NEEDED.md`.
