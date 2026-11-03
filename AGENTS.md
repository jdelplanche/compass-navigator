<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Source import
- Preserve the imported ROUT TanStack Start structure and MDX catalog plugin; the full repository is retained for subsequent service setup.
- Never import source environment files, generated route trees, or repository metadata; credentials and connected-service data are not transferred with source code.
- Omni ingestion results enter the existing private Studio draft before publication; use the shared ready-job mapper to reject remote media and keep a single published profile source of truth.
- Omni web handlers only persist/read jobs in public.omni_jobs; scraping, conversion, claims and recovery belong exclusively to the standalone worker/ daemon. Why: request lifetime must never determine job completion.
- The webapp uses the existing Neon HTTP connector; the separately deployed daemon needs its own least-privilege unpooled PostgreSQL connection provisioned outside Lovable. Why: LISTEN requires a persistent session unavailable through the HTTP connector.
- Studio subscribes to the daemon's authenticated SSE using short-lived HMAC owner tickets; notifications trigger authenticated readback and reconnect reconciliation, not public job payloads. Why: realtime must not leak tenant data or depend on webserver longevity.
- Keep pending/accepted Omni cards outside the authoritative query cache until readback contains their IDs; coalesce SSE readbacks with one trailing reconciliation. Why: stale reads and event bursts must not erase accepted work or lose completion.
- Omni media is private Scaleway S3 under users/<uid>/ with lease-specific immutable keys, served through the existing first-party gallery handler only after owner/published-snapshot authorization. Why: prevent stale-worker overwrites, third-party visitor tracking and draft leaks.
- The semantic Omni catalog is an owner-only projection of revisioned profile drafts; grid_items and ingest_tokens expose compatibility views, never a parallel public feed or plaintext tokens. Why: keep published snapshots authoritative and secrets hashed.
- Social-grid normalization rejects all remote media/proxy URLs; gallery dialogs retain legacy external URLs only outside social grids. Why: every grid cover must be persisted rather than depend on expiring external CDNs.
- Optional SPA rendering lives only in the standalone daemon, intercepting network through DNS-pinned transport with a blocked browser proxy and exact approved source hosts. Why: browser rendering must not reopen SSRF or introduce a third-party renderer.
- Manual grid covers are browser-reencoded to WebP, validated server-side and stored in the private client bucket with a ready owner job record. Why: manual overrides follow the same first-party media authorization as ingested covers without webserver native processing.
