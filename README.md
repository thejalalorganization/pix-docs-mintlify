# Pix documentation (Mintlify)

Mintlify build of the Pix docs. **Generated. Do not edit pages here.**

Source of truth: https://github.com/thejalalorganization/pix-docs (Docusaurus).
Regenerate from that repo:

```bash
cd ../pix-docs
just mintlify          # writes ../pix-docs-mintlify
cd ../pix-docs-mintlify
mint dev               # preview at http://localhost:3000
git commit -am "Regenerate" && git push
```

What the generator does: rewrites Docusaurus Markdown to Mintlify MDX
(admonitions to callouts, card grids to `CardGroup`, diagrams to light/dark
`Frame` images, screenshots to placeholder comments), substitutes the brand
tokens, and writes `docs.json` from `sidebars.ts`.

See `AGENTS.md` for terminology and style.
