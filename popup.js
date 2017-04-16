new Vue({
    el: '#popupTest',

    // данные
    data: {
        url: undefined,
        title: undefined,
        description: undefined,
        images: [],

        selectImg: undefined,
        selectImg: undefined,
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

        // Нажатие на кнопку "копировать описание"
        onClickCopyDescription: function() {
            this.copyClipboard(this.description);
        },

        // Открыть выбранное изображение в новом окне
        onClickOpenSelectImg: function(url) {
            chrome.tabs.create({ 'url': this.selectImg });
        },

        // Выбрана картинка
        onSelectImg: function(img) {
            this.selectImg = img;
        },

        // Обработать список изображений
        setListImage: function(listImg) {
            if (typeof listImg == "undefined") {
                listImg = [];
            }

            console.log('setListImage', listImg);
            this.images = listImg
        },

        // Получить информацию о документе
        setInfoDocuments: function(data) {
            console.log('setInfoDocuments', data);
            this.title = data.title;
            this.description = data.description;
        },

        // Прочиатть данные по текущйе закдаке 
        readTab: function(tab) {
            this.curTab = tab;
            this.url = this.curTab.url;
            chrome.tabs.sendMessage(tab.id, { text: 'getInfoDocuments' }, this.setInfoDocuments);
            chrome.tabs.sendMessage(tab.id, { text: 'getListImage' }, this.setListImage);
        },
    },

    // Иницилизиурем 
    mounted: function() {
        this.$nextTick(function() {
            chrome.tabs.getSelected(null, this.readTab); // Выесняем закладку
        });
    }
})