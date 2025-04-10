import os
import json
from flask import Flask, request, jsonify, send_from_directory # type: ignore
from flask_cors import CORS  # type: ignore # Import flask-cors
from werkzeug.utils import secure_filename # type: ignore
from gensim.models import Word2Vec # type: ignore
import spacy # type: ignore
from nltk.tokenize import word_tokenize # type: ignore
from nltk.corpus import stopwords # type: ignore
from nltk.stem import WordNetLemmatizer # type: ignore
from wordcloud import WordCloud # type: ignore
import matplotlib.pyplot as plt # type: ignore
from textstat import flesch_reading_ease # type: ignore
from textblob import TextBlob # type: ignore
import joblib # type: ignore
from collections import Counter
from langdetect import detect # type: ignore
import shutil
import numpy as np # type: ignore
import PyPDF2 # type: ignore
import re
from nltk.tokenize import sent_tokenize # type: ignore
from docx import Document # type: ignore
from pymongo import MongoClient # type: ignore
from datetime import datetime

app = Flask(__name__)
CORS(app)

MONGO_URI = "mongodb://localhost:27017/"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["DocumentAnalysisDB"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Path to current file
MODEL_DIR = os.path.join(BASE_DIR, 'models')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
CLASSIFIED_FOLDER = os.path.join(BASE_DIR, 'classified')
IMAGES_FOLDER = os.path.join(BASE_DIR, 'generated_images')  # Folder for saving images

# Ensure the folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CLASSIFIED_FOLDER, exist_ok=True)
os.makedirs(IMAGES_FOLDER, exist_ok=True)  # Create the images folder

# Load models
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

if 'sentencizer' not in nlp.pipe_names:
    nlp.add_pipe('sentencizer')

clf = joblib.load(MODEL_DIR + "/gutenberg/gutenberg_model.pkl", mmap_mode='r')
embd_model = Word2Vec.load(MODEL_DIR + "/gutenberg/word2vec_model.model")

# Set allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

# Check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Preprocessing function
def pre_process(text, model_index):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)

    if(model_index == 0):  # for OCR model
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        tokens = [word for word in tokens if word not in stop_words]
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(word) for word in tokens]
        return tokens
    else:  # for Yahoo and Gutenberg
        nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])
        doc = nlp(text.lower())
        tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.text.isalpha()]
        return tokens


# Predefined function for document analysis
# Predefined function for document analysis
def document_analysis_pipeline(text):
    doc = nlp(text)
    word_count = len([token for token in doc if not token.is_punct])
    char_count = len(text)
    sentence_count = len(list(doc.sents))
    language = detect(text)
    
    # Filter out stop words and empty strings
    words = [
        token.text.lower() for token in doc
        if not token.is_stop and not token.is_punct and token.text.strip() != ""
    ]
    
    # Top keywords excluding stop words and empty strings
    top_keywords = Counter(words).most_common(10)

    entities = {"persons": [], "organizations": [], "dates": []}
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["persons"].append(ent.text)
        elif ent.label_ == "ORG":
            entities["organizations"].append(ent.text)
        elif ent.label_ == "DATE":
            entities["dates"].append(ent.text)

    readability_score = flesch_reading_ease(text)
    blob = TextBlob(text)
    sentiment = blob.sentiment
    sentences = [sent.text for sent in doc.sents]
    summary = sorted(sentences, key=len, reverse=True)[:3]
    avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0

    return {
        "word_count": word_count,
        "char_count": char_count,
        "sentence_count": sentence_count,
        "language": language,
        "top_keywords": top_keywords,
        "entities": entities,
        "readability_score": readability_score,
        "avg_sentence_length": avg_sentence_length,
        "sentiment": {
            "polarity": sentiment.polarity,
            "subjectivity": sentiment.subjectivity
        },
    }


# Function to generate word cloud image and save it
def generate_word_cloud_image(text):
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    image_path = os.path.join(IMAGES_FOLDER, "wordcloud.png")
    wordcloud.to_file(image_path)
    return image_path


# Function to generate POS pie chart image and save it
def generate_pos_pie_chart_image(text):
    doc = nlp(text)
    pos_counts = doc.count_by(spacy.attrs.POS)
    labels = [nlp.vocab[i].text for i in pos_counts]
    sizes = list(pos_counts.values())
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=plt.cm.Paired.colors)
    pos_image_path = os.path.join(IMAGES_FOLDER, "pos_pie_chart.png")
    plt.savefig(pos_image_path)
    plt.close(fig)
    return pos_image_path


# Function to handle file content based on file type
def read_file(file):
    try:
        filename=file.filename.rsplit("/")[1]
    except Exception as e:
        filename=file.filename
    filename = secure_filename(filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    print("file name : ",filename)
    print("file path :",filepath)
    file.save(filepath)

    content = ''
    if filename.endswith('.txt'):
        with open(filepath, 'r', encoding='utf-8') as f:  # Ensure UTF-8 encoding
            content = f.read()
    elif filename.endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(filepath)
            for page in reader.pages:
                content += page.extract_text() or ''  # Handle None return from extract_text
        except Exception as e:
            return f"PDF read error: {str(e)}"
    elif filename.endswith('.docx'):
        try:
            doc = Document(filepath)
            for para in doc.paragraphs:
                content += para.text
        except Exception as e:
            return f"DOCX read error: {str(e)}"
    else:
        return "Unsupported file type"

    return content


# Function to get document embeddings
def get_doc_embeddings(tokens, model):
    word_vectors = [model.wv[word] for word in tokens if word in model.wv]
    if len(word_vectors) == 0:
        return np.zeros(model.vector_size)
    return np.mean(word_vectors, axis=0)



@app.route('/upload', methods=['POST'])
def upload_files():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No files uploaded"}), 400

    files = request.files.getlist('file')  # Get list of all uploaded files
    results = []
    for file in files:
        if file.filename == '':
            continue
        filnam=""

        try:
            filnam=file.filename.rsplit("/")[1]
        except Exception as e:
            filnam=file.filename

        if file and allowed_file(file.filename):
            # Read and classify the uploaded file
            content = read_file(file)
            if "error" in content:
                results.append({"filename": filnam, "error": content})
                continue

            # Process content using spacy and Word2Vec
            Spacy_tokens = pre_process(content, 1)
            doc_embedding = get_doc_embeddings(Spacy_tokens, embd_model)

            # Reshape the embedding for prediction
            doc_embedding = doc_embedding.reshape(1, -1)

            # Predict the class
            prediction = clf.predict(doc_embedding)[0]
            predict_proba = clf.predict_proba(doc_embedding)

            # Analyze document without generating images
            analysis = document_analysis_pipeline(content)
            # print(file.filename)
            # print(file.filename.rsplit("/"))
            # Return only the analysis data
            
            try:
                fn=file.filename.rsplit("/")[1]
            except Exception as e:
                fn=file.filename

            results.append({
                "filename": fn,
                "category": prediction,
                "analysis": analysis
            })
        else:
        
            results.append({"filename": fn, "error": "Invalid file type"})

        #print(results)

    return jsonify({"status": "success", "results": results})


@app.route('/save_report', methods=['POST'])
def save_report():
    from datetime import datetime  # Ensure this import is at the top of your script

    data = request.json
    username = data.get('username')
    results = data.get('results')

    if not username or not results:
        return jsonify({"status": "error", "message": "Invalid request"}), 400

    user_collection = db[username]
    today = datetime.now().strftime("%d-%m-%Y")  # Corrected usage of datetime

    existing_record = user_collection.find_one({"Date": today})
    if existing_record:
        user_collection.update_one({"Date": today}, {"$push": {"Documents": {"$each": results}}})
    else:
        user_collection.insert_one({"Date": today, "Documents": results})

    return jsonify({"status": "success", "message": "Report saved successfully"})


# View history route
@app.route('/view-history/<username>', methods=['GET'])
def view_history(username):
    user_collection = db[username]
    records = list(user_collection.find({}, {"_id": 0}))
    return jsonify({"status": "success", "history": records})


@app.route('/uploads/<filename>')
def serve_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        return {"error": "File not found"}, 404


if __name__ == '__main__':
    app.run(debug=True)

