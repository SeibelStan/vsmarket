function creoleParse(el) {
	el = el
		//Заголовки
		.replace(/### (.+)/g, '<h2>$1</h2>')
		.replace(/## (.+)/g, '<h3>$1</h3>')
		.replace(/# (.+)/g, '<h1>$1</h1>')

		//Списки
		.replace(/^\d+\. *(.+)/gm, '<oli>$1</oli>')
		.replace(/^\*\ *(.+)/gm, '<uli>$1</uli>')
		.replace(/((<oli>.+<\/oli>\s*)+)/gm, '<ol>$1</ol>\n').replace(/oli>/g, 'li>')
		.replace(/((<uli>.+<\/uli>\s*)+)/gm, '<ul>$1</ul>\n').replace(/uli>/g, 'li>')

		//Структурные элементы
		.replace(/> (.+)/g, '<blockquote>$1</blockquote>')
		.replace(/^([А-яЁёA-z" -])(.+)\n/gm, '<p>$1$2</p>')

		//Строчные элементы
		.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
		.replace(/!\[(.+?)\](\((.+?)(,\s*(.+))*\))*/g, '<img src="$1" style="width: $3" alt="$5">')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>');

	return typo(el);
}

function typo(el) {
	return el
		//кавычки
		.replace(/([\(> ])"([A-z].*?[A-z.?!])"/g, '$1“$2”')
		.replace(/([\(> ])("|<<)([ЁёА-я].*?[ЁёА-я.?!])("|>>)/g, '$1«$3»')

		//дефисы, тире, математика
		.replace(/\s-+\s/g, '&nbsp;— ') // тире
		.replace(/(\s{0,1})-+(\s)/g, '$1—$2')
		.replace(/'(.)'/g, '$1\u0301') // ударение
		.replace(/(\d+)[xх*](\d+)/g, '$1×$2')
		.replace(/(\d+)\/(\d+)/g, '$1÷$2')
		.replace(/(\d+)-(\d+)/g, '$1−$2')
		.replace(/(\d+)\+-(\d+)/g, '$1±$2')
		.replace(/(\d+)--(\d+)*/g, '$1—$2')

		.trim()
}