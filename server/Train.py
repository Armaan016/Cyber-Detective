import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import ast
import re
from sentence_transformers import SentenceTransformer
import joblib
import torch

# Load the SentenceTransformer model onto CUDA
model = SentenceTransformer('all-MiniLM-L6-v2').to('cuda')

# Load the data
df = pd.read_csv('word_vectors.csv')

def clean_vector_string(vector_str):
    cleaned_str = re.sub(r'(?<=\d)\s+(?=-?\d)', ',', vector_str)  
    return cleaned_str

# Clean and convert the vectors
df['Vector'] = df['Vector'].apply(lambda x: np.array(ast.literal_eval(clean_vector_string(x))))

# Stack the vectors and convert to CUDA tensors
X = np.vstack(df['Vector'].values)
X = torch.tensor(X).to('cuda')
y = df['Tag Number'].values
y = torch.tensor(y).to('cuda')

# Train the DecisionTreeClassifier (Note: scikit-learn models do not support CUDA directly)
knn = DecisionTreeClassifier()
knn.fit(X.cpu().numpy(), y.cpu().numpy())  # Move data back to CPU for training

# Save the model
model_filename = 'dt_model.pkl'
joblib.dump(knn, model_filename)

print(f"Model saved as {model_filename}")