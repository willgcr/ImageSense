import React, { useState, useRef } from "react";
import ImageCropper from "../components/ImageCropper";
import ImageProcessor from "../components/ImageProcessor";

const Home = () => {
	// The model result
	const [modelResult, setModelResult] = useState (null);
	// The data that comes form the ImageCropper
	const [selectionData, setSelectionData] = useState (null);
	/*{
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		relativeX: 0,
		relativeY: 0,
		relativeWidth: 0,
		relativeHeight: 0,
		imageUri: null,
		croppedImageUri: null
	}*/

	// Get data from user selection
	const handleImageCropped = (data) => {
		// Create a new Image instance
		const image = new Image();
		// Set the source to the image URI
		image.src = data.imageUri;
		// When the image is loaded, perform the cropping
		image.onload = () => {
			// Crop the original image
			const canvas = document.createElement ("canvas");
			const ctx = canvas.getContext ("2d");
			canvas.width = data.width;
			canvas.height = data.height;
			// Draw the cropped portion of the image onto the canvas
			ctx.drawImage (image, data.x, data.y, data.width, data.height, 0, 0, data.width, data.height);
			// Get the data uri of the cropped image
			const croppedImageUri = canvas.toDataURL ();
			setSelectionData (() => ({
				...data,
				imageUri: data.imageUri,
				croppedImageUri: croppedImageUri,
			 }));
		}
	}

	const handleModelResult = (data) => {
		console.log (data);
	}

	if (modelResult != null) {
		return ('model output');

	} else if (selectionData == null || selectionData.height < 16 || selectionData.width < 16) {
		return (
			<div className="flex flex-col w-full h-full items-center justify-center">
				<ImageCropper handleImageCropped={handleImageCropped}/>
			</div>
		);
	} else {
		return (

			<div className="flex flex-col w-full h-full items-center justify-center">
				<ImageProcessor selectionData={selectionData} setSelectionData={setSelectionData} handleModelResult={handleModelResult}/>
			</div>
		);
	}
}

export default Home;