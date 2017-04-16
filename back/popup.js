new Vue({
    el: '#popupAliGoods',

    // данные
    data: {
        simpleUrl: undefined,
        images: [], // список изображений
        selectImg: {}, // выбранное изображение
        tag: [
            'аксессуа',
            'гаджеты',
            'обувь',
            'одежда',
            'пляж',
            'сумки',
            'хранение',
            'kids',
            'men',
            'woman'
        ],

        curTab: undefined, // текущая закладка
        backgroud: chrome.extension.getBackgroundPage() // фоновая страница
    },

    methods: {
        // Копирем текст в буфер обмена
        copyClipboard: function(str, mimetype) {

            if (typeof mimetype == "undefined") {
                mimetype = "text/plain";
            }

            document.oncopy = function(event) {
                event.clipboardData.setData(mimetype, str);
                event.preventDefault();
            };

            document.execCommand("Copy", false, null);
        },

        // Нажатие на кнопку "копировать урл"
        onClickCopyUrl: function() {
            this.copyClipboard(this.simpleUrl);
        },

        // Нажатие на кнопку "копировать изображение"
        onClickCopyImg: function() {
            this.copyClipboard(this.selectImg.url);
        },

        onClickOpenImg: function(url) {
            chrome.tabs.create({ 'url': url });
        },

        // Обработать список изображений
        readImage: function(imgs) {
            this.images = [];
            for (var i = 0, len = imgs.length; i < len; i++) {
                this.images.push({
                    thumb: imgs[i],
                    url: imgs[i].split('_50x')[0]
                });
            }
        },

        // Выбрана картинка
        onSelectImg: function(img) {
            this.selectImg = img;
        },

        // Установить URL
        setUrl: function(url) {
            this.simpleUrl = this.curTab.url.split('?')[0];
        },

        // Прочиатть данные по текущйе закдаке 
        readTab: function(tab) {
            this.curTab = tab;
            this.setUrl();
            chrome.tabs.sendMessage(tab.id, { text: 'searchImages' }, this.readImage);
        },
    },

    // Иницилизиурем 
    mounted: function() {
        this.$nextTick(function() {
            var self = this;
            // Выесняем закладку
            chrome.tabs.getSelected(null, this.readTab);
        });
    }
})