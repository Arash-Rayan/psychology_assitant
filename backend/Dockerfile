FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port (match what uvicorn will use)
EXPOSE 8000

# Run Django with uvicorn (ASGI)
CMD ["uvicorn", "core.asgi:application", "--host", "0.0.0.0", "--port", "8000"]