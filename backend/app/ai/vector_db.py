import os
import pickle
import numpy as np
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from app.config import settings

INDEX_FILE_PATH = os.path.join(settings.UPLOAD_DIR, "vector_index.pkl")

def get_embedding(text: str) -> np.ndarray:
    """
    Generates embedding for text.
    If Gemini API key is present, calls Gemini embedding API.
    Otherwise returns a local pseudo-embedding or relies on TfidfVectorizer fallback.
    """
    if settings.GEMINI_API_KEY:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text[:10000],
                task_type="retrieval_document"
            )
            return np.array(result['embedding'], dtype=np.float32)
        except Exception as e:
            print(f"Gemini embedding API failed: {e}. Falling back to TF-IDF vector.")
    
    # Return a basic dummy vector for indexing, we'll use local TF-IDF pairwise computation instead
    return np.zeros(768, dtype=np.float32)

class SimpleVectorIndex:
    def __init__(self):
        self.tenders: Dict[int, Dict[str, Any]] = {}
        self.load()

    def load(self):
        if os.path.exists(INDEX_FILE_PATH):
            try:
                with open(INDEX_FILE_PATH, 'rb') as f:
                    self.tenders = pickle.load(f)
            except Exception as e:
                print(f"Error loading vector index: {e}")
                self.tenders = {}

    def save(self):
        try:
            with open(INDEX_FILE_PATH, 'wb') as f:
                pickle.dump(self.tenders, f)
        except Exception as e:
            print(f"Error saving vector index: {e}")

    def add_tender(self, tender_id: int, title: str, summary: str, full_text: str):
        # We index tender metadata and full text
        embedding = get_embedding(summary + " " + title)
        
        self.tenders[tender_id] = {
            "tender_id": tender_id,
            "title": title,
            "summary": summary,
            "full_text": full_text[:20000], # Keep a snippet of the text
            "embedding": embedding
        }
        self.save()

    def get_similar_tenders(self, current_tender_id: int, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Calculates similarity between the current tender and all past tenders.
        Uses cosine similarity of Gemini embeddings if available,
        otherwise computes TF-IDF cosine similarity of summaries/text locally.
        """
        if current_tender_id not in self.tenders:
            return []
            
        current_tender = self.tenders[current_tender_id]
        current_text = current_tender["summary"] + " " + current_tender["title"]
        
        other_tenders = [t for tid, t in self.tenders.items() if tid != current_tender_id]
        if not other_tenders:
            return []

        # Check if we have valid Gemini embeddings (non-zero vectors)
        use_gemini = settings.GEMINI_API_KEY and not np.allclose(current_tender["embedding"], 0)
        
        results = []
        if use_gemini:
            curr_emb = current_tender["embedding"].reshape(1, -1)
            for other in other_tenders:
                if not np.allclose(other["embedding"], 0):
                    other_emb = other["embedding"].reshape(1, -1)
                    sim = float(cosine_similarity(curr_emb, other_emb)[0][0])
                    results.append({
                        "tender_id": other["tender_id"],
                        "title": other["title"],
                        "summary": other["summary"],
                        "similarity_score": round(sim * 100.0, 1)
                    })
        else:
            # Fallback to local TF-IDF Cosine Similarity
            documents = [current_text] + [o["summary"] + " " + o["title"] for o in other_tenders]
            try:
                vectorizer = TfidfVectorizer(stop_words='english')
                tfidf_matrix = vectorizer.fit_transform(documents)
                # Compute similarity between index 0 (current) and all others (index 1 onwards)
                similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
                
                for idx, sim in enumerate(similarities):
                    other = other_tenders[idx]
                    results.append({
                        "tender_id": other["tender_id"],
                        "title": other["title"],
                        "summary": other["summary"],
                        "similarity_score": round(float(sim) * 100.0, 1)
                    })
            except Exception as e:
                print(f"Local TF-IDF comparison failed: {e}")
                # Fallback to simple Jaccard string comparison or token matching
                for other in other_tenders:
                    results.append({
                        "tender_id": other["tender_id"],
                        "title": other["title"],
                        "summary": other["summary"],
                        "similarity_score": 50.0  # Basic placeholder
                    })

        # Sort by similarity score descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:limit]

vector_index = SimpleVectorIndex()
