# AI Video Platform

An AI-powered video content platform built with Django REST Framework, featuring semantic search, personalized recommendations, adaptive streaming, and automated content moderation — inspired by the core ideas behind platforms like YouTube and Netflix.

## Features

- **Video upload & storage** — videos and thumbnails stored on Cloudinary
- **Semantic search** — find videos by meaning, not just keyword matching, using local sentence embeddings
- **AI-powered recommendations** — "more like this" suggestions based on embedding similarity
- **Personalized recommendations** — a "for you" feed built from a user's aggregated watch history
- **Watch history tracking** — records what users watch and for how long
- **Analytics dashboard (API)** — most-watched videos, total watch time, and per-user activity, powered by Pandas
- **Async thumbnail generation** — thumbnails are automatically extracted from uploaded video via a Celery background task and FFmpeg
- **Adaptive streaming (HLS)** — videos are served through Cloudinary's adaptive bitrate streaming
- **Content moderation** — uploads are automatically screened and flagged for review
- **JWT authentication** — secure, token-based API access

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Storage & Streaming:** Cloudinary (storage + HLS adaptive streaming)
- **Task Queue:** Celery + Redis (async thumbnail generation)
- **Media Processing:** FFmpeg
- **AI/ML:** Sentence-Transformers (`all-MiniLM-L6-v2`) for free, local text embeddings — no external API required
- **Content Moderation:** local profanity/content screening
- **Data Analysis:** Pandas
- **Auth:** JWT (djangorestframework-simplejwt)

## Why local embeddings?

Instead of relying on a paid or rate-limited third-party API for AI features, this project generates embeddings locally using Sentence-Transformers. This keeps the AI-powered search, recommendation, and moderation features fully free to run and self-contained.

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/videos/` | GET | List all videos |
| `/api/videos/` | POST | Upload a new video (triggers embedding, moderation check, and async thumbnail generation) |
| `/api/videos/search/?q=<query>` | GET | Semantic search across videos |
| `/api/videos/<id>/watch/` | POST | Record a watch event |
| `/api/videos/<id>/recommendations/` | GET | Get videos similar to a given video |
| `/api/videos/for_you/` | GET | Get personalized recommendations based on watch history |
| `/api/analytics/summary/` | GET | Get aggregated watch analytics |
| `/api/token/` | POST | Obtain JWT access/refresh tokens |

Each video's serialized data also includes an `hls_url` field for adaptive streaming playback and a `moderation_status` field (`pending` / `approved` / `flagged`).

## Project Structure

Built in phases, tracked across branches:
- `phase-1-setup` — Django project setup, models, Cloudinary storage, core API
- `phase-2-embeddings` — Local embedding generation and semantic search
- `phase-3-recommendations` — Watch tracking, recommendations, and analytics
- `phase-4-async-processing` — Celery-based async thumbnail generation and HLS adaptive streaming
- `phase-5-moderation` — Automated content moderation and admin review
- `phase-6-personalized-recommendations` — Watch-history-aware personalized recommendations

## Setup

```bash
# Clone and enter the project
git clone https://github.com/Ihtes-ham/ai-video-platform.git
cd ai-video-platform

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up your .env file with database and Cloudinary credentials

# Run migrations
python manage.py migrate

# Start Redis (required for Celery)
sudo service redis-server start

# Start the Celery worker (in a separate terminal)
celery -A core worker --loglevel=info

# Start the Django server
python manage.py runserver
```

## Author

Muhammad Ihtesham Ul Haq
- [LinkedIn](https://linkedin.com/in/m-ihtesham480)
- [GitHub](https://github.com/Ihtes-ham)