from sentence_transformers import util
import numpy as np
import json
from sentence_transformers import SentenceTransformer
import torch

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = SentenceTransformer("msmarco-MiniLM-L-12-v3").to(device)

with open("./embeddings.json", "r") as f:
    embeddings_data = json.load(f)

def get_relevant_QAcontexts(query, embeddings_data, top_k=3):
    query_embedding = model.encode(query, convert_to_tensor=True)

    scores = []
    for entry in embeddings_data:
        context_embedding = torch.tensor(entry["context_embedding"], dtype=torch.float32, device=query_embedding.device)
        score = util.cos_sim(query_embedding, context_embedding).item()
        scores.append((entry["context"], score))
    
    scores.sort(key=lambda x: x[1], reverse=True)
    top_contexts = [context for context, _ in scores[:top_k]]
    
    top_contexts = list(set(top_contexts))
    c = " ".join(top_contexts)
    
    return c

query = "What is adware?"
top_contexts = get_relevant_QAcontexts(query, embeddings_data)
top_contexts = list(set(top_contexts))

top_contexts = " ".join(top_contexts)
print(top_contexts)

# print("Top Relevant Contexts:")
# for context in top_contexts:
#     print(context)

# unique_contexts = set()
# for context in top_contexts:
#     unique_contexts.add(context)
# print("Unique Contexts:")
# for context in unique_contexts:
#     print(context)