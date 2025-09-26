# Exercise Analysis Backend

This backend provides an Exercise Analysis API using FastAPI and MediaPipe. It exposes endpoints to create/list exercise templates, analyze webcam or uploaded videos, and fetch analysis results.

## Run locally

1. Create a Python virtual environment and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements_file.txt
```

2. Start the server (development):

```powershell
# By default ENVIRONMENT=development, which allows CORS from any origin
python exercise_analysis_backend.py
# or run with uvicorn directly
uvicorn exercise_analysis_backend:app --host 0.0.0.0 --port 8000 --reload
```

## Configuration

Configuration is centralized in `api_config.py`. Important settings:

- `cors_origins` — list of allowed origins (default `['*']` in development). Set to your frontend origin in production.
- `host`, `port`, `reload`, `log_level` — server runtime settings.

You can override settings using environment variables or an `.env` file (see `api_config.Settings`).

## Key endpoints

- `GET /` — Health / root message.
- `GET /health` — Health status with templates_count and active_sessions.

Templates:
- `POST /templates/create` — Create a new exercise template (JSON body matching `ExerciseTemplate`).
- `GET /templates` — List all in-memory templates.
- `GET /templates/{template_id}` — Get a specific template.

Analysis:
- `POST /analyze/webcam/{template_id}?duration_seconds=30` — Run webcam analysis (server attempts to read local webcam; useful for local testing).
- `POST /analyze/video/{template_id}` — Upload a video file (multipart form) and analyze it.

Sessions:
- `GET /analysis` — List saved analysis sessions (IDs).
- `GET /analysis/{session_id}` — Get analysis result for a session.
- `DELETE /analysis/{session_id}` — Delete an analysis session.

## CORS

CORS is configured via `api_config.py` and applied in `exercise_analysis_backend.py` using FastAPI's `CORSMiddleware`. In development `cors_origins` defaults to `['*']`. In production, set `ENVIRONMENT=production` and set `cors_origins` (or use an `.env` file) to the allowed frontend origin(s).

Example `.env` (production):

```
ENVIRONMENT=production
# add any custom settings; in ProductionSettings cors_origins defaults to ['https://yourdomain.com']
```

## Example frontend fetch calls

Create template (JSON):

```js
const template = { name: 'Squat', description: 'Standard squat template', landmarks: [...] };
await fetch(`${API_BASE}/templates/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(template),
});
```

Upload video for analysis:

```js
const form = new FormData();
form.append('video', fileInput.files[0]);
const res = await fetch(`${API_BASE}/analyze/video/${templateId}`, {
  method: 'POST',
  body: form
});
const json = await res.json();
```

Get analysis result:

```js
const res = await fetch(`${API_BASE}/analysis/${sessionId}`);
const result = await res.json();
```

Replace `API_BASE` with your backend host, e.g. `http://localhost:8000`.

## Notes

- The project currently stores templates and results in-memory (and writes template JSON files to `templates/`). For production, replace with a database and persistent storage.
- The webcam endpoint uses OpenCV to directly access the machine's webcam — typically not suitable for deployed server environments.
- MediaPipe and OpenCV have native dependencies; ensure correct versions and system libs are present.
