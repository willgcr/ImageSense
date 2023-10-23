import React, { useState, useRef } from "react";
import ImageCropper from "../components/ImageCropper";
import ImageProcessor from "../components/ImageProcessor";
import parse from "html-react-parser";
import __, { LangSelector } from "/src/lang";

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
		if (data && data) {
			setModelResult (data);
		}
	}

	const resetApp = () => {
		setSelectionData (null);
		setModelResult (null);
	}

	if (navigator.maxTouchPoints !== 0 || window.innerWidth <= 768) {
		return (
			<div className="flex flex-col w-full h-full justify-center items-center p-10">
				Device not supported!
			</div>
		)

	} else if (modelResult != null) {
		return (
			<div className="flex flex-col w-full h-full justify-center items-center p-10">
			<div className="p-3">Model result:</div>
			<div className="flex bg-black p-4 rounded w-full h-[300px] sm:h-[350px] max-w-[750px] border-2 border-gray-500 overflow-y-auto">
				<pre className="flex text-white font-mono text-xs whitespace-pre-wrap">
					<code className="flex flex-wrap w-full ">
						{JSON.stringify (modelResult, null, 4)}
					</code>
				</pre>
			</div>
			<button onClick={resetApp} className="flex items-center justify-center mt-4 bg-[#d35400] text-white py-2 px-4 rounded">{__('Restart')}</button>
			</div>
		);
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