FROM python:3.9-slim

WORKDIR /app

COPY app.py ./
COPY requirements.txt ./
COPY dt_model.pkl /app/dt_model.pkl
COPY RAG.py /app/RAG.py
COPY RagQA.py /app/RagQA.py
COPY NLPScraping.py /app/NLPScraping.py
COPY embeddings.json /app/embeddings.json
COPY BertTrainableDataset.csv /app/BertTrainableDataset.csv

RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

ENV TMPDIR=/home/tmp
RUN mkdir -p /home/tmp && chmod -R 777 /home/tmp

EXPOSE 5000

ENV FLASK_ENV=development

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]