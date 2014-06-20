function currencyBuild(price) {
	var res = '';
	for(var i in currency) {
		res += (price * currency[i].value).toFixed(2) + ' ' + currency[i].title + '\n';
	}
	return res;
}

function getById(source, id, result) {
	for(var i in source) {
		if(source[i].id == id)
			return source[i][result];
	}
	return null;
}

function listFilter() {
	$('main').html(
		'<nav class="home">' +
			'<section><ul id="items"></ul></section>' +
		'</nav>'
	);

	$('#items').html(listBuild(items, 'item'));
	$('#nav-main').html(navBuild(pages, 'page'));

	var $home = $('.home');

	$home.find('section').each(function () {
		if($(this).html().match(/\*\*\*\*\*/)) {
			$(this).remove();
		}
	});

	if(!$home.html()) {
		$home.html('<article class="page-wrapper"><h1>Такого у нас нет</h1></article>');
	}

	$('#items a').click(function () {
		itemRender($(this), 'main')
	});

	$('#nav-main a').click(function () {
		$(document).click();
		pageRender($(this), 'main');
	});

	$('.item-tag').click(function () {
		$('#search')
			.val(
				$(this).html()
			)
			.keyup();
	});

	if(location.hash) {
		$('[href*="' + decodeURIComponent(location.hash) + '"]').click();
	}
}

function listBuild(source, type) {
	var query = $('#search').val(),
		parsedQuery = '',
		res = '';

	for(var i in query) {
		parsedQuery += query[i] + '.*';
	}

	var searchReg = new RegExp('.*' + parsedQuery, 'gi');

	for(var i in source) {
		var si = source[i];

		if((si.title + si.tags).match(searchReg)) {
			var linkBuild = 'data-' + type + '="data/items/' + si.id + '.md" href="#' + si.title + '"';

			res +='<li class="item">' +
				'<div class="item-wrapper">' +
				'<a id="' + si.id + '" ' + linkBuild + '>' +
				'<img class="item-thumb" src="img/small/' + si.id + '.jpg">' +
				'<div class="item-title">' + si.title + '</div>' +
				'<div class="item-price info" title="' + currencyBuild(si.price) + '">' + si.price + ' руб.</div></a>' +
				'<div class="item-tags">';

			itemTags = si.tags.split(' ');

			for(var i in itemTags) {
				res += '<a class="item-tag pointer">' + itemTags[i] + '</a>';
			}

			res += '</div></div>';
		}
	}

	return (res) ? res : '*****';
}

function navBuild(source, type) {
	var res = '<li class="nav-link"><a href="/">Главная</a>';

	for(var i in source) {
		var si = source[i];

		var linkBuild = 'data-' + type + '="data/pages/' + si.id + '.md" href="#' + si.title + '"';

		res += '<li class="nav-link">' +
			'<a id="' + si.id + '" ' + linkBuild + '>' + si.title + '</a>';
	}

	return res;
}

function itemRender(el, target) {
	var itemTitle = getById(items, el.attr('id'), 'title');
	var itemPrice = getById(items, el.attr('id'), 'price');

	$(target).html(
		'<article class="page-wrapper">' +
			'<header>' +
				'<h1>' + itemTitle + '<a class="pointer pull-left new-data-header">&larr;</a>' + '</h1>' +
			'</header>' +
			'<section id="new-data">' +
				'<div id="ajax-loading"><h2>Гружу...</h2></div>' +
			'</section>' +
			'<footer>' +
				'<div class="payment-price info" title="' + currencyBuild(itemPrice) + '">' + itemPrice + ' руб.</div>' +
				'<iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/small.xml?account=410011989523131&quickpay=small&any-card-payment-type=on&button-text=02&button-size=s&button-color=orange&targets=' + itemTitle + '&default-sum=' + itemPrice + '&fio=on&mail=on&phone=on&address=on" width="114" height="31"></iframe>' +
			'</footer>' +
		'</article>'
	);

	$('.new-data-header').click(function () {
		location.hash = null;
		listFilter();
	});

	$.get(el.attr('data-item'), function (data) {
		$('#new-data').html(
			'<img src="' + el.find('img').attr('src') + '" class="pull-left ill">' +
			creoleParse(data)
		);
	});
}

function pageRender(el, target) {
	var pageTitle = getById(pages, el.attr('id'), 'title') || 'Главная';

	$(target).html(
		'<article class="page-wrapper">' +
			'<header>' +
				'<h1>' + pageTitle + '<a class="pointer pull-left new-data-header">&larr;</a>' + '</h1>' +
			'</header>' +
			'<section id="new-data">' +
			'<div id="ajax-loading"><h2>Гружу...</h2></div>' +
			'</section>' +
		'</article>'
	);

	$('.new-data-header').click(function () {
		location.hash = null;
		listFilter();
	});

	$.get(el.attr('data-page'), function (data) {
		$('#new-data').html(creoleParse(data));
	});
}

$(function () {
	var sidebarShow = false;

	$('.sidebar-toggle').click(function () {
		$('.sidebar').show('fast', function () {
			sidebarShow = true;
		});
	});

	$(document).click(function(event) {
		if(sidebarShow == true) {
			if($(event.target).closest('.sidebar').length) return;
			$('.sidebar').hide();
			event.stopPropagation();
			sidebarShow = false;
		}
	});

	$('#search')
		.keyup(function () {
			location.hash = '';
			listFilter();
		})
		.click(function () {
			$(this).val('');
		});

	listFilter();
});