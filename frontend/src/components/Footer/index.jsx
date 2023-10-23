import React from "react";
import parse from "html-react-parser";

const Footer = () => {
	return (
		<div className="flex justify-center py-10">
			<div className="flex flex-col items-center justify-center text-gray-250 px-8 py-0 max-w-4xl mx-auto text-xs">
				<span className="text-center">Copyright &copy; 2023 by <a href="https://willgcr.me" target="_blank">ImageSense by Willian Rocha</a>. All Rights Reserved.</span>
				<span className="text-center text-gray-500"><a href="https://https://huggingface.co/nlpconnect/vit-gpt2-image-captioning" target="_blank">ViT + GPT2 Model</a> by Ankur Kumar</span>
				<span className="text-center text-gray-500">Icons by <a href="https://heroicons.com/" target="_blank">Heroicons</a></span>
			</div>
		</div>
	);
}

export default Footer;