Backend (Django + Django Ninja)
================================

What you get:
- Django project with Django Ninja for a FastAPI-like DX
- Three example routes:
  - `POST /api/chat`: proxy to chatbot/LLM (stream-ready placeholder)
  - `POST /api/analyze`: send a conversation summary back to LLM for scoring
  - `POST /api/save`: persist an analysis record in Postgres
- Postgres-ready settings via environment variables, falls back to SQLite for local quick runs

Quick start (local)
-------------------
1) Create and activate a virtualenv
   - Windows: `python -m venv venv && venv\Scripts\activate`
   - macOS/Linux: `python -m venv venv && source venv/bin/activate`

2) Install deps
   - `pip install -r requirements.txt`

3) Configure environment
   - Copy `.env.example` to `.env` and fill values (at least `SECRET_KEY` and DB creds)
   - For a quick SQLite run, you only need `SECRET_KEY`

4) Run migrations
   - `python manage.py migrate`

5) Start server
   - `python manage.py runserver 8000`
   - Swagger docs at: `http://localhost:8000/api/docs`

Environment variables
---------------------
- SECRET_KEY (required)
- DEBUG (default: False)
- ALLOWED_HOSTS (comma-separated, default: *)
- DATABASE_URL (e.g. `postgres://user:pass@host:5432/dbname`)
- OPENAI_API_KEY (if you wire real LLM calls)

Notes on routes
---------------
- `POST /api/chat` expects `{ "message": "..." }` and returns a stubbed chatbot reply.
  Wire your LLM client in `chatbot/services.py -> chat_with_llm`.
- `POST /api/analyze` expects `{ "summary": "...", "score_hint": 0-100 }`
  and returns a stubbed analysis/score. Wire real scoring in `analyze_with_llm`.
- `POST /api/save` expects `{ "patient_id": "...", "conversation_id": "...", "summary": "...", "score": 0-100, "metadata": { ... } }`
  Saves to `chatbot_analysis` table.

Streaming
---------
The `chat_with_llm` stub is structured so you can replace it with a streaming generator
and return a `StreamingHttpResponse` if needed.

Production tips
---------------
- Use Postgres (set DATABASE_URL).
- Set DEBUG=False and configure ALLOWED_HOSTS.
- Run `python manage.py collectstatic` if you add static files.
- Add proper auth/permission for patient/therapist roles before real use.

