FROM python:3.9-slim

WORKDIR /app

COPY app.py ./
COPY requirements.txt ./
COPY dt_model.pkl /app/dt_model.pkl
COPY embeddings.json /app/embeddings.json

RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm
RUN pip install --no-cache-dir --upgrade newspaper3k requests

EXPOSE 5000

ENV FLASK_ENV=development

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]