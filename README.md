# ImageSense

ImageSense is a versatile prototype application designed for image analysis using a pre-trained Machine Learning model, with built-in support for future translation into various languages. Please note that the current prototype utilizes the [ViT + GPT2](https://huggingface.co/nlpconnect/vit-gpt2-image-captioning) model for basic image descriptions, and it is not well-trained for production environments. It is intended for study and design purposes.

## Overview

- **Demo:** Explore a functional demo version of the application hosted on my personal server. [**Check it out here!**](https://willgcr.me/imagesense)

- **Frontend:**
  - Developed with React.js.
  - Enables users to intuitively select images, crop specific parts, and send them for further processing using a Machine Learning model.

- **Backend:**
  - Implemented in Python using Flask.
  - Consumes a pre-trained machine learning model.
  - Offers flexibility to replace the model with other image processing machine learning models.

- **Design:**
  - Features a straightforward design.
  - Utilizes Heroicons and TailwindCSS for styling components.
  - Mostly uses CSS flexbox.

- **Language Support:**
  - Built with future translation in mind, allowing seamless integration of additional languages. (Note: There is a known bug in the translation function that triggers a warning but still works.)

- **Deployment:**
  - Frontend hosted on a personal server.
  - Backend hosted on [Google Cloud Platform Compute Engine](https://cloud.google.com/compute), adaptable to any available Virtual Machine.
  - The Flask app runs using Supervisor and Gunicorn. Configuration details are available in the deployment environment and are not provided here for simplicity.
  - Nginx was used as a reverse proxy to route external traffic to the Gunicorn server.
  - HTTPS traffic was enabled using a self-signed certificate for added security.

## Credits

All Rights Reserved.
- **Model:** [ViT + GPT2 Model](https://huggingface.co/nlpconnect/vit-gpt2-image-captioning) by Ankur Kumar.
- **Icons:** [Heroicons](https://heroicons.com