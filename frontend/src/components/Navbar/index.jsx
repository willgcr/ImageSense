import React from "react";
import parse from "html-react-parser";
import { Link } from 'react-router-dom';
import __, { LangSelector } from "/src/lang";

const Navbar = () => {
	return (
		<div className="flex justify-center py-10">
			<div className="grid">
				<div className="px-8 py-0 max-w-4xl mx-auto flex">
					<ul className="flex space-x-4">
						<h1 id="app-title" className="flex text-3xl md:text-6xl sm:text-4xl justify-center items-center"><span className="text-[#16a085]">Image</span><span>Sense</span></h1>
					</ul>
				</div>
			</div>
			<LangSelector/>
		</div>
	);
}

export default Navbar;