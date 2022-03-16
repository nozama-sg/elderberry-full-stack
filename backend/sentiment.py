''' https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment '''

from transformers import AutoModelForSequenceClassification
from transformers import TFAutoModelForSequenceClassification
from transformers import AutoTokenizer
import numpy as np
from scipy.special import softmax
import csv
import urllib.request

def sentimentAnalysis(text):
	# Preprocess text (username and link placeholders)
	def preprocess(text):
	    new_text = []
	 
	 
	    for t in text.split(" "):
	        t = '@user' if t.startswith('@') and len(t) > 1 else t
	        t = 'http' if t.startswith('http') else t
	        new_text.append(t)
	    return " ".join(new_text)

	task='sentiment'
	MODEL = f"cardiffnlp/twitter-roberta-base-{task}"

	tokenizer = AutoTokenizer.from_pretrained(MODEL)

	labels = ['negative', 'neutral', 'positive']

	model = AutoModelForSequenceClassification.from_pretrained(MODEL)
	model.save_pretrained(MODEL)
	tokenizer.save_pretrained(MODEL)

	text = preprocess(text)
	encoded_input = tokenizer(text, return_tensors='pt')
	output = model(**encoded_input)
	scores = output[0][0].detach().numpy()
	scores = softmax(scores)

	ranking = np.argsort(scores)
	ranking = ranking[::-1]
	'''
	POSITIVTY SCORE = NEUTRAL + 2 * POSITIVE / 2 
	'''
	positivityScore = (scores[1] + 2*scores[2]) / 2
	return round(positivityScore, 2)

