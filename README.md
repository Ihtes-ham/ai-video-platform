# AI Video Platform

An AI-powered video content platform built with Django REST Framework, featuring semantic search, embedding-based recommendations, and watch analytics — inspired by the core ideas behind platforms like YouTube and Netflix.

## Features

- **Video upload & storage** — videos and thumbnails stored on Cloudinary
- **Semantic search** — find videos by meaning, not just keyword matching, using local sentence embeddings
- **AI-powered recommendations** — "more like this" suggestions based on embedding similarity
- **Watch history tracking** — records what users watch and for how long
- **Analytics dashboard (API)** — most-watched videos, total watch time, and per-user activity, powered by Pandas
- **JWT authentication** — secure, token-based API access

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Storage:** Cloudinary
- **AI/ML:** Sentence-Transformers (`all-MiniLM-L6-v2`) for free, local text embeddings — no external API required
- **Data Analysis:** Pandas
- **Auth:** JWT (djangorestframework-simplejwt)

## Why local embeddings?

Instead of relying on a paid or rate-limited third-party API for AI features, this project generates embeddings locally using Sentence-Transformers. This keeps the AI-powered search and recommendation features fully free to run and self-contained.

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/videos/` | GET | List all videos |
| `/api/videos/` | POST | Upload a new video |
| `/api/videos/search/?q=<query>` | GET | Semantic search across videos |
| `/api/videos/<id>/watch/` | POST | Record a watch event |
| `/api/videos/<id>/recommendations/` | GET | Get similar videos |
| `/api/analytics/summary/` | GET | Get aggregated watch analytics |
| `/api/token/` | POST | Obtain JWT access/refresh tokens |

## Project Structure

Built in phases, tracked across branches:
- `phase-1-setup` — Django project setup, models, Cloudinary storage, core API
- `phase-2-embeddings` — Local embedding generation and semantic search
- `phase-3-recommendations` — Watch tracking, recommendations, and analytics

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
# (see .env.example if provided)

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

## Author

Muhammad Ihtesham Ul Haq
- [LinkedIn](https://linkedin.com/in/m-ihtesham480)
- [GitHub](https://github.com/Ihtes-ham)