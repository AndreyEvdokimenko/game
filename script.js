// Memory Game
// © 2014 Nate Wiley
// License -- MIT

// весь скрипт — это одна большая функция
(function(){
	
	//  объявляем объект, внутри которого будет происходить основная механика игры
	var Memory = {

		// создаём карточку
		init: function(cards){
			//  получаем доступ к классам
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			// собираем из карточек массив — игровое поле
			this.cardsArray = $.merge(cards, cards);
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// и раскладываем их
			this.setup();
		},

		// как перемешиваются карточки
		shuffleCards: function(cardsArray){
			// используем встроенный метод .shuffle
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		// раскладываем карты
		setup: function(){
			// подготавливаем код с карточками на страницу
			this.html = this.buildHTML();
			// добавляем код в блок с игрой
			this.$game.html(this.html);
			// получаем доступ к сформированным карточкам
			this.$memoryCards = $(".card");
			// на старте мы не ждём переворота второй карточки
			this.paused = false;
			// на старте у нас нет перевёрнутой первой карточки
     		this.guess = null;
     		// добавляем элементам на странице реакции на нажатия
			this.binding();
		},

		// как элементы будут реагировать на нажатия
		binding: function(){
			// обрабатываем нажатие на карточку
			this.$memoryCards.on("click", this.cardClicked);
			// и нажатие на кнопку перезапуска игры
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		// что происходит при нажатии на карточку
		cardClicked: function(){
			// получаем текущее состояние родительской переменной
			var _ = Memory;
			// и получаем доступ к карточке, на которую нажали
			var $card = $(this);
			// если карточка уже не перевёрнута и мы не нажимаем на ту же самую карточку второй раз подряд
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				// переворачиваем её
				$card.find(".inside").addClass("picked");
				// если мы перевернули первую карточку
				if(!_.guess){
					// то пока просто запоминаем её
					_.guess = $(this).attr("data-id");
				// если мы перевернули вторую и она совпадает с первой
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					// оставляем обе на поле перевёрнутыми и показываем анимацию совпадения
					$(".picked").addClass("matched");
					// обнуляем первую карточку
					_.guess = null;
						// если вторая не совпадает с первой
						} else {
							// обнуляем первую карточку
							_.guess = null;
							// не ждём переворота второй карточки
							_.paused = true;
							// ждём полсекунды и переворачиваем всё обратно
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.paused = false;
							}, 600);
						}
				// если мы перевернули все карточки
				if($(".matched").length == $(".card").length){
					// показываем победное сообщение
					_.win();
				}
			}
		},

		// показываем победное сообщение
		win: function(){
			// не ждём переворота карточек
			this.paused = true;
			// плавно показываем модальное окно с предложением сыграть ещё
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		// показываем модальное окно
		showModal: function(){
			// плавно делаем блок с сообщением видимым
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		// прячем модальное окно
		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		// перезапуск игры
		reset: function(){
			// прячем модальное окно с поздравлением
			this.hideModal();
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// раскладываем их на поле
			this.setup();
			// показываем игровое поле
			this.$game.show("slow");
		},

		// Тасование Фишера–Йетса - https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
		   	while (counter > 0) {
	        	index = Math.floor(Math.random() * counter);
	        	counter--;
	        	temp = array[counter];
	        	array[counter] = array[index];
	        	array[index] = temp;
		    	}
		    return array;
		},

		// код, как добавляются карточки на страницу
		buildHTML: function(){
			// сюда будем складывать HTML-код
			var frag = '';
			// перебираем все карточки подряд
			this.$cards.each(function(k, v){
				// добавляем HTML-код для очередной карточки
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="https://likes.ru/uploads/event/image/22559/super_medium_90d5a0cfe85c4b23492a9860bd43d8f5.jpg"\
				alt="Codepen" /></div></div>\
				</div>';
			});
			// возвращаем собранный код
			return frag;
		}
	};

	// карточки
	var cards = [
		{	
			// название
			name: "php",
			// адрес картинки
			img: "https://www.moldcell.md/files/events/unplugget%20web%20events%202-2.png",
			// порядковый номер пары
			id: 1,
		},
		{
			name: "css3",
			img: "https://assets.bananastreet.ru/unsafe/2498x2498/https://bananastreet.ru/system/release/cover/1/14/14818/748f0fac51.jpg",
			id: 2
		},
		{
			name: "html5",
			img: "https://sun6-21.userapi.com/impf/5-k-ip2IFf3LDzKh-fxb4iadLhuo0l_E_f6RQw/hofmwsW9ilM.jpg?size=270x0&quality=90&sign=a6ecb3ca8aa254c29ebeb750c2cc15c1&c_uniq_tag=iQf8dECyMrpqNie3TcryVX-5kB_tIOH2rVODIbPZIp0",
			id: 3
		},
		{
			name: "jquery",
			img: "troll.jpg",
			id: 4
		}, 
		{
			name: "javascript",
			img: "https://ae04.alicdn.com/kf/H1f29a7681db6408792f93fceecb88022B.jpg",
			id: 5
		},
		{
			name: "node",
			img: "pompilius.jpg",
			id: 6
		},
		{
			name: "photoshop",
			img: "https://images-na.ssl-images-amazon.com/images/I/71Pob5f4nPL._SL1200_.jpg",
			id: 7
		},
		{
			name: "python",
			img: "https://avatars.dzeninfra.ru/get-zen_doc/3976017/pub_5f3fc29ffc228c5964b9a67d_5f3fce42b291c329eb95e9ce/scale_1200",
			id: 8
		},
		{
			name: "rails",
			img: "https://nebo-trk.com/wp-content/uploads/2017/03/umaturman.jpg",
			id: 9
		},
		{
			name: "sass",
			img: "https://avatars.dzeninfra.ru/get-zen_doc/3384412/pub_60d1d2876f4f14791e196116_60d1d32dd4596758d51b4326/scale_1200",
			id: 10
		},
		{
			name: "sublime",
			img: "ddt.jpg",
			id: 11
		},
		{
			name: "wordpress",
			img: "time.jpg",
			id: 12
		},
	];
    
	// запускаем игру
	Memory.init(cards);


})();
