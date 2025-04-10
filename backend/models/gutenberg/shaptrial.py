import spacy
from gensim.models import Word2Vec
import joblib
import numpy as np
import shap
from collections import defaultdict
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import pandas as pd

# Load models
embd_model = Word2Vec.load("word2vec_model.model")
clf = joblib.load("gutenberg_model.pkl")
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

# Initialize SHAP explainer
explainer = shap.TreeExplainer(clf)

# Preprocess text
def preprocess_text(text):
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.text.isalpha()]
    return tokens

# Get document embeddings
def get_doc_embeddings(tokens, model):
    word_vectors = [model.wv[word] for word in tokens if word in model.wv]
    if not word_vectors:
        return np.zeros(model.vector_size)
    return np.mean(word_vectors, axis=0)

# Calculate SHAP values for tokens
def compute_token_shap(tokens, model, explainer, clf, embedding_dim):
    token_scores = {}
    for token in tokens:
        if token in model.wv:
            word_emb = model.wv[token].reshape(1, -1)
            shap_values = explainer(word_emb)
            token_score = np.sum(shap_values.values[0, :, 0])  # Sum SHAP values across dimensions
            token_scores[token] = token_score
    return token_scores

# Generate word clouds from SHAP values
def generate_word_cloud(shap_scores, title):
    wordcloud = WordCloud(width=800, height=400, background_color="white").generate_from_frequencies(shap_scores)
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.title(title, fontsize=16)
    plt.axis("off")
    plt.show()

# Bar plot for word importance
def bar_plot_word_importance(shap_scores, title, top_n=10):
    sorted_words = sorted(shap_scores.items(), key=lambda x: -abs(x[1]))[:top_n]
    words, scores = zip(*sorted_words)
    plt.figure(figsize=(8, 6))
    plt.barh(words, scores, color="skyblue")
    plt.title(title, fontsize=16)
    plt.xlabel("SHAP Score")
    plt.gca().invert_yaxis()
    plt.show()



# Visualizations for token SHAP scores
def shap_summary_table(shap_scores):
    df = pd.DataFrame.from_dict(shap_scores, orient="index", columns=["SHAP Score"])
    df = df.sort_values(by="SHAP Score", ascending=False)
    print("Top SHAP Scores:")
    print(df.head(10))


s = input("Enter text :  ")
tokens = preprocess_text(s)
embds = get_doc_embeddings(tokens, embd_model)
embds = embds.reshape(1, -1)

# Predict and explain
prediction = clf.predict(embds)[0]
print(f"Prediction: {prediction}")
shap_values = explainer(embds)
print("SHAP values computed.")

# Local SHAP token analysis
token_shap_scores = compute_token_shap(tokens, embd_model, explainer, clf, embd_model.vector_size)
print("Local SHAP Token Scores:")
for token, score in sorted(token_shap_scores.items(), key=lambda x: -x[1]):
    print(f"{token}: {score:.4f}")




# Visualizations for local analysis
generate_word_cloud(token_shap_scores, "Local SHAP Word Cloud - Token Impact")
bar_plot_word_importance(token_shap_scores, "Top Words Driving Prediction (Local)", top_n=10)



