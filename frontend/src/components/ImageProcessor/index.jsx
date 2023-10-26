import React, { useRef, useState } from "react";
import parse from "html-react-parser";
import __, { LangSelector } from "/src/lang";

const ImageProcessor = (props) => {
	// Getting selection data from parent
	const { selectionData, setSelectionData, handleModelResult } = props;
	// To control when model is running
	const [modelIsRunning, setModelIsRunning] = useState (false);

		// Ref to the image to be shown
	const imageRef = useRef (null);

	// To prevent image drag
	const handleDragStart = (event) => {
		event.preventDefault ();
	}

	// Reset the photouploader
	const resetSelectionData = () => {
		setSelectionData (null);
	}

	// Send an HTTP request to the model
	const callModel = async () => {
		if (selectionData && selectionData.croppedImageUri) {
			setModelIsRunning (true);
			try {
				// Convert data URI to Blob
				const blob = await fetch (selectionData.croppedImageUri).then ((res) => res.blob());
				// Create a FormData object and append the Blob
				const formData = new FormData ();
				formData.append ("image", blob, "image.jpg");
				// Make a POST request using Fetch API
				const response = await fetch ("https://imagesense.cloud/", {
					method: "POST",
					body: formData
				});
				if (response.ok) {
					const result = await response.json ();
					handleModelResult (result);
					setModelIsRunning (false);
				} else {
					setModelIsRunning (false);
					console.error ("Error calling model:", response.statusText);
				}
			} catch (error) {
				setModelIsRunning (false);
				console.error ("Error:", error);
			}
		} else {
			console.error ("Selection data error!");
		}
	}

	return (
		<div>
			{modelIsRunning == false ? (
				<div className="flex flex-col w-full h-full items-center justify-center p-10">
					<div className="flex flex-col m-5">
						<h3 className="flex justify-center items-center text-md">{__('User Selected Crop (original)')}:</h3>
						<div>
							<ul className="flex flex-row space-x-2 text-xs">
								<li>X: {selectionData.x}</li>
								<li>Y: {selectionData.y}</li>
								<li>{__('WIDTH')}: {selectionData.width}</li>
								<li>{__('HEIGHT')}: {selectionData.height}</li>
							</ul>
						</div>
					</div>
					<div className="relative">
						<img src={selectionData.croppedImageUri} onDragStart={handleDragStart} className="flex w-full max-w-[700px] max-h-[400px] border-2 border-gray-500 border-dashed rounded-2xl object-contain" ref={imageRef}/>
					</div>
					<div className="flex flex-row space-x-6 mt-5">
						
						<button onClick={callModel} className="flex items-center justify-center mt-4 bg-[#16a085] text-white py-2 px-4 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>&nbsp;{__('Run Model')}</button>

						<button onClick={resetSelectionData} className="flex items-center justify-center mt-4 bg-[#d35400] text-white py-2 px-4 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>&nbsp;{__('Clear')}</button>

					</div>
				</div>
			) : (
				<div className="flex flex-col w-full h-full items-center justify-center p-10 text-sm">
					<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        			{__('Transmitting data to the server... This may take a moment, please be patient.')}
				</div>
			)}
		</div>
	)
}

export default ImageProcessor;