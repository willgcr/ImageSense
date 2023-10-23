from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import torch
from PIL import Image, UnidentifiedImageError
from io import BytesIO
import logging
from logging.handlers import RotatingFileHandler  # Import RotatingFileHandler
import warnings

# Ignore all warnings
warnings.simplefilter ("ignore")

app = Flask (__name__)

# Set a secret key for session security
app.secret_key = "0c3ad3149f9e2102d7cb9f4a1d18d9c980d093d0098c7769b6f88b5509b75941"

# Load pre-trained models and tokenizer
model = VisionEncoderDecoderModel.from_pretrained ("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained ("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained ("nlpconnect/vit-gpt2-image-captioning")

# Move model to the appropriate device  (GPU or CPU)
device = torch.device ("cuda" if torch.cuda.is_available () else "cpu")
model.to (device)

# Configuration for caption generation
max_length = 32
num_beams = 8
gen_kwargs = {"max_length": max_length, "num_beams": num_beams}

# Setup logging with log rotation
log_handler = RotatingFileHandler ('app.log', maxBytes = 10 * 1024 * 1024, backupCount=3)  # Rotate logs with a maximum size of 10 MB, keep 3 backups
log_handler.setLevel (logging.ERROR)
app.logger.addHandler (log_handler)

# Set up rate limiting
limiter = Limiter (app)

# Set the key_func separately
limiter.key_func = get_remote_address

# Function to process the image from bytes
def process_image (image_bytes):
	try:
		# Open the image using PIL
		i_image = Image.open (image_bytes)
		
		# Convert to RGB if not already in that format
		if i_image.mode != "RGB":
			i_image = i_image.convert (mode="RGB")

		return i_image
	except UnidentifiedImageError as e:
		raise ValueError ("Invalid image format") from e

# Function to generate captions using the pre-trained model
def predict_step (images):
	# Extract pixel values from images and move to the device
	pixel_values = feature_extractor (images=images, return_tensors="pt").pixel_values
	pixel_values = pixel_values.to (device)

	# Generate captions using the model
	output_ids = model.generate (pixel_values, **gen_kwargs)

	# Decode token IDs into text captions
	preds = tokenizer.batch_decode (output_ids, skip_special_tokens=True)
	preds = [pred.strip () for pred in preds]

	return preds

# Route for generating captions with rate limiting
@app.route ("/", methods=["POST"])
@limiter.limit ("60 per minute")
def generate_caption ():
	# Check if the request has a file in the "image" field
	if "image" not in request.files:
		return jsonify ({"error": "No image provided"}), 400

	uploaded_file = request.files["image"]

	if uploaded_file.filename == "":
		return jsonify ({"error": "No image file selected"}), 400

	# Read the image into memory as bytes
	image_bytes = BytesIO (uploaded_file.read ())

	# Check if the image size is greater than 10MB
	if len (image_bytes.getvalue ()) > 10 * 1024 * 1024:
		return jsonify ({"error": "Image size exceeds 10MB limit"}), 400

	try:
		# Process the image
		processed_image = process_image (image_bytes)

		# Make predictions
		output = predict_step ([processed_image])

		# Return only the caption in the response
		return jsonify ({"caption": output[0]})
	except ValueError as e:
		return jsonify ({"error": str (e)}), 400
	except Exception as e:
		logging.error (f"Error processing image: {str (e)}")
		return jsonify ({"error": "Internal server error"}), 500

# Run the application
if __name__ == "__main__":
	app.run (debug=False)