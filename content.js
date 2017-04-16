chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    console.log('request ', request.text);
    // Получить список изображений
    if (request.text === 'getListImage') {
        let result = [],
            listImg = $('img');

        for (var i = 0, len = listImg.length; i < len; i++) {
            var s = listImg[i].src;
            if (result.indexOf(s) == -1) {
                result.push(s);
            }
        }

        callback(result);
        return;
    }

    // Получить описание страницы
    if (request.text === 'getInfoDocuments') {
        result = {
            'title': $('title').text(),
            'description': $('meta[name=description]')[0].content
        };
        callback(result);
        return;
    }
});