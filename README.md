# ChadF — Minimal chat/upload demo

## Brief

Lightweight demo app demonstrating a Next.js client and a simple Node.js server with a background worker and file uploads. Intended as a small full-stack example for local development and experimentation.

## Demo
https://github.com/user-attachments/assets/a8c35bf2-4fe5-4445-a9f5-722a17731fc7

## Quick start

- Start services (uses docker-compose where available):

```bash
run docker engine
docker compose up -d
```

- Or run locally:

- Client (Next.js): install and run in `client/`
- Server (Node): install and run in `server/`

## Services required

- Redis — used by `bullmq` for the job queue (default: `localhost:6379`).
- Qdrant — vector database for embeddings (default: `http://localhost:6333`).
- Ollama — local LLM/embedding runtime used for `embeddinggemma` and `gemma4:31b` (default: `http://localhost:11434`).

## Run server & worker

From the `server/` folder:

```bash
# install deps
cd server
npm install

# run the API server
npm run dev

# run the background worker (processes uploaded PDFs into Qdrant)
npm run dev:worker
```

## Environment variables

The code currently uses the following defaults; you can replace them with env vars in your deployment:

- `REDIS_HOST` / `REDIS_PORT` — Redis connection for `bullmq` (defaults to `localhost:6379`).
- `QDRANT_URL` — Qdrant HTTP URL (defaults to `http://localhost:6333`).
- `OLLAMA_URL` / `OLLAMA_API_KEY` — Ollama base URL and API key (defaults to `http://localhost:11434` and `ollama`).

## Key implementation notes

- Queue: `bullmq` is used to enqueue upload jobs; the worker (`server/worker.js`) consumes the `file-upload-queue` and splits PDFs into chunks.
- Embeddings: `@langchain/ollama` is used with the `embeddinggemma` model to embed document chunks.
- Vector DB: `@langchain/qdrant` stores vectors in Qdrant; the collection used in examples is `langchainjs-testing`.
- Chat: The `/chat` endpoint queries Qdrant via a LangChain retriever and calls Ollama's chat completion with `gemma4:31b-cloud` (model name in code). Adjust if your Ollama setup exposes a different model name.

## Troubleshooting

- Ensure Redis, Qdrant, and Ollama are running and reachable at the configured URLs.
- Check `server` logs for worker errors; the worker outputs progress when adding docs to Qdrant.

## Project layout

- `client/` — Next.js app (UI, pages, components)
- `server/` — Node server and `worker.js` (uploads handling)
- `server/uploads/` — uploaded files storage
- `docker-compose.yml` — local compose for services

## Notes

- Check `client/package.json` and `server/package.json` for start scripts and dependencies.
- Environment variables (if needed) are configured per-service — consult respective folders.

## License

Unlicensed (change as needed).
