import React, { useState, useRef } from "react";
import parse from "html-react-parser";
import __, { LangSelector } from "/src/lang";

const ImageCropper = (props) => {

	// State to store the selected image data URL
	const [imageDataUri, setImageDataUri] = useState (null);
	// Realtime mouse/image coordinates and selection variables
	const [mouseCoordinates, setMouseCoordinates] = useState ({ x: 0, y: 0 });
	const [selectionData, setSelectionData] = useState ({ x: 0, y: 0, width: 0, height: 0});
	const [mousePressed, setMousePressed] = useState (false);
	const [clickPosition, setClickPosition] = useState ({x: 0, y: 0});

	// A ref to the file input
	const fileInputRef = useRef (null);

	// A ref to the image itself
	const imageRef = useRef (null);

	// A ref to the image selection rectangle
	const imageSelectionRef = useRef (null);

	// Trigger the hidden file input just like it has been clicked
	const triggerPhotoUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click ();
		} else {
			console.error ("File Error!")
		}
	}

	// This handles the image file
	const handleImage = (event) => {
		// Verifies the file
		const file = event.target.files[0];
		if (file) {
			// Check the file size before proceeding
			if (file.size > 10 * 1024 * 1024) {
				// Display an error or handle the large file size as needed
				alert ("Image size exceeds 10MB limit");
				clearImage ();
				return;
			}
			const reader = new FileReader ();
			reader.onload = (e) => {
				// Set the data URL to the state
				setImageDataUri (e.target.result);
			};
			// Read the image file as a data URL
			reader.readAsDataURL (file);
		}
	}

	// Process the user selection on the image
	const processUserSelection = (selection, callback) => {
		if (!imageRef.current) return (null)
		const img = new Image ();
		img.src = imageDataUri;
		img.onload = () => {
			// Get the dynamically loaded original image dimensions
			const imgWidth = img.width;
			const imgHeight = img.height;
			// Calculate the ratio
			const widthRatio = imgWidth / imageRef.current.width;
			const heightRatio = imgHeight / imageRef.current.height;
			// Calculate the original coordinates
			const selectionData = {
				x: Math.round (selection.x * widthRatio),
				y: Math.round (selection.y * heightRatio),
				width: Math.round (((selection.x + selection.width)*widthRatio) - (selection.x * widthRatio)),
				height: Math.round (((selection.y + selection.height)*heightRatio) - (selection.y * heightRatio)),
				relativeX: selection.x,
				relativeY: selection.y,
				relativeWidth: selection.width,
				relativeHeight: selection.height,
				imageUri: imageDataUri
			}
			callback (selectionData);
		}
	}

	// Update the position of the selection rectangle
	const updateSelection = () => {
		imageSelectionRef.current.style.top = selectionData.y + 'px';
		imageSelectionRef.current.style.left = selectionData.x + 'px';
		imageSelectionRef.current.style.width = selectionData.width + 'px';
		imageSelectionRef.current.style.height = selectionData.height + 'px';	
	}

	// Handle mouse down on image to start selection
	const handleMouseDown = (event) => {
		setMousePressed (true);
		setClickPosition ({x: mouseCoordinates.x, y: mouseCoordinates.y});
		if (imageSelectionRef.current) {
			setSelectionData ({ 
				x: mouseCoordinates.x,
				y: mouseCoordinates.y,
				width: 0,
				height: 0
			});
		}
		updateSelection ();
	}

	// Handle mouse move to update coordinates
	const handleMouseMove = (event) => {
		const { offsetX, offsetY, target } = event.nativeEvent;
		let newSelectionX = 0;
		let newSelectionY = 0;
		let newSelectionWidth = 0;
		let newSelectionHeight = 0;
		setMouseCoordinates ({ x: offsetX, y: offsetY });
		if (clickPosition.x > offsetX) {
			newSelectionX = offsetX;
			newSelectionWidth = clickPosition.x - offsetX;
		} else {
			newSelectionX = selectionData.x;
			newSelectionWidth = offsetX - selectionData.x;
		}
		if (clickPosition.y > offsetY) {
			newSelectionY = offsetY;
			newSelectionHeight = clickPosition.y - offsetY;
		} else {
			newSelectionY = selectionData.y;
			newSelectionHeight = offsetY - selectionData.y;
		}
		if (mousePressed) {
			setSelectionData ({ 
				x: newSelectionX,
				y: newSelectionY,
				width: newSelectionWidth,
				height: newSelectionHeight
			});
		}
		updateSelection ();
	}

	// Handle mouse up on image to finish the selection
	const handleMouseUp = (event) => {
		setMousePressed (false);
		updateSelection ();
	}

	// To prevent image drag
	const handleDragStart = (event) => {
		event.preventDefault ();
	}

	// Clear the selected image and reset the selection
	const clearImage = () => {
		setImageDataUri (null);
		setSelectionData ({ x: 0, y: 0, width: 0, height: 0 });
	};

	// Submit the selection to be processed
	const cropSelection = () => {
		// The callback to send processed data
		const submitCallback = (data) => {
			props.handleImageCropped (data);
		}
		// Get selection rectangle data
		const coordinates = {
			x: selectionData.x,
			y: selectionData.y,
			width: selectionData.width,
			height: selectionData.height
		}
		if (selectionData.height < 16 || selectionData.width < 16) {
			alert ('Selection must be at least 16x16 pixels.');
		} else {
			processUserSelection (coordinates, submitCallback);
		}
	}

	return (
		<div className="flex flex-col w-full h-full justify-center items-center p-10">
			{/* <div className="text-xs py-4">Facing issues running the model? Please attempt to access and enable HTTPS at <a className="italic underline text-[#16a085]" target="_blank" href="https://35.209.131.159">https://35.209.131.159</a></div> */}
			{/* Display the selected image */}
			{imageDataUri ? (
				<div className="relative" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
					<img src={imageDataUri} onMouseMove={handleMouseMove} onDragStart={handleDragStart} className="flex w-full max-w-[700px] max-h-[400px] border-2 border-gray-500 border-dashed rounded-2xl object-contain" ref={imageRef}/>
					<div className="absolute text-white text-xs p-1">{__('Mouse Coordinates')}: {mouseCoordinates.x}, {mouseCoordinates.y}</div>
					<div ref={imageSelectionRef} className="absolute top-0 left-0 w-0 h-0 border-2 bg-[#11111166] rounded border-red-500"></div>
				</div>
			) : (
				// This is going to work just like a file input field
				<div onClick={triggerPhotoUpload} className="flex flex-col justify-center items-center text-xl w-full h-full max-w-[750px] border-2 border-gray-500 text-gray-500 hover:border-gray-400 hover:text-gray-400 hover:cursor-pointer hover:bg-[#11111110] border-dashed rounded-2xl">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
					<path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
					</svg>
					<span>{__('Click to upload')}</span>
					<span className="text-xs">({__('Max')}. 10MB)</span>
					{/* I'll keep the input field hidden just because I can better customize everything else to look better */}
					<input id="fileInput" className="hidden" type="file" accept="image/*" onChange={handleImage} ref={fileInputRef} />
				</div>
			)}
			{imageDataUri && (
				<div className="flex flex-row space-x-6 mt-5">

					<button onClick={cropSelection} className="flex items-center justify-center mt-4 bg-[#16a085] text-white py-2 px-4 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" /></svg>&nbsp;{__('Crop')}</button>

					<button onClick={clearImage} className="flex items-center justify-center mt-4 bg-[#d35400] text-white py-2 px-4 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>&nbsp;{__('Clear')}</button>
				</div>)}
		</div>
		);
}

export default ImageCropper;