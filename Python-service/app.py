import warnings
import json
import joblib
from sentence_transformers import SentenceTransformer
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS  

from RAG import scrape_kmit, scrape_kmit_aboutus, scrape_kmit_management, scrape_kmit_principal_academic_director, scrape_kmit_placements, get_relevant_contexts

with warnings.catch_warnings():
    warnings.simplefilter("ignore", FutureWarning)
    warnings.simplefilter("ignore", UserWarning)

app = Flask(__name__)

CORS(app)

model = SentenceTransformer('all-MiniLM-L6-v2')

tag_mapping = {
    'GENERAL_TOOL': 0, 'IMPACT': 1, 'ATTACK_PATTERN': 2, 'CAMPAIGN': 3,
    'VICTIM_IDENTITY': 4, 'ATTACK_TOOL': 5, 'GENERAL_IDENTITY': 6,
    'MALWARE': 7, 'COURSE_OF_ACTION': 8, 'OBSERVED_DATA': 9,
    'INTRUSION_SET': 10, 'THREAT_ACTOR': 11, 'VULNERABILITY': 12,
    'INFRASTRUCTURE': 13, 'MALWARE_ANALYSIS': 14, 'INDICATOR': 15,
    'LOCATION': 16, 'ATTACK_MOTIVATION': 17, 'O': 18
}

reverse_tag_mapping = {v: k for k, v in tag_mapping.items()}

model_filename = r"dt_model.pkl"
kn_classifier = joblib.load(model_filename)

def predict(input_sentence):
    words = input_sentence.split()
    results = []
    for word in words:
        word_vector = model.encode(word).reshape(1, -1)
        tag_number = kn_classifier.predict(word_vector)[0]
        tag_name = reverse_tag_mapping.get(tag_number, 'Unknown')
        results.append((word, tag_name))
    return results

def count_words(input_sentence):
    words = input_sentence.split()
    word_counts = Counter(words)
    return word_counts

@app.route('/annotate', methods=['POST'])
def annotate():
    try:
        data = request.get_json()

        input_sentence = data.get('input_sentence', '').strip()
        
        if not input_sentence:
            return jsonify({"error": "No input text provided"}), 400

        word_counts = count_words(input_sentence)

        predicted_tags = predict(input_sentence)

        combined_result = []
        for word, tag in predicted_tags:
            count = word_counts[word]
            combined_result.append({
                "word": word,
                "count": count,
                "tag": tag
            })

        return jsonify(combined_result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/query', methods=['POST'])
def scrape():
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        scraped_text = scrape_kmit()
        scraped_text += scrape_kmit_aboutus()
        scraped_text += scrape_kmit_management()
        scraped_text += scrape_kmit_principal_academic_director()
        scraped_text += scrape_kmit_placements()

        relevant_contexts = get_relevant_contexts(query, scraped_text)

        return jsonify(relevant_contexts)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
