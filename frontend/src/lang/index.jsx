import React, { createContext, useContext } from 'react';
import _pt from "./pt.json";

export const LanguageContext = createContext ();

export const LangSelector = () => {
	const { lang, setLang } = useContext (LanguageContext);
	const update_lang = (e) => {
		let new_lang = e.target.value;
		localStorage.setItem ('language', new_lang);
		setLang (new_lang);
	}
	return (
		<div className="flex px-5 items-center justify-center">
			<select id="lang-selector" value={lang} onChange={update_lang} className="bg-transparent border border-gray-200 p-1 rounded-lg">
				<option value="en">&#127482;&#127480;&nbsp;EN</option>
				<option value="pt">&#x1F1E7;&#x1F1F7;&nbsp;PT</option>
			</select>
		</div>
	);
}

const __ = (text) => {
	const { lang, setLang } = useContext (LanguageContext);
	if (lang == "pt") {
		// Return translated
		return _pt[text]??text;
	} else {
		// Return default
		return (text);
	}
}

export default __;