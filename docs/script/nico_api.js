/**
 * 動画情報取得.
 * @param {string} content_id ニコニコ動画のコンテンツID(sm..., so... など)
 * @param {function} callback 通信成功/失敗後のコールバック.getthumbinfo API で取得できるxmlをDOMで引数に渡す.
 */
function getNicoVideoInfoDocAsync(content_id, callback) {
    console.log("getNicoVideoInfoDocAsync enter");

    var url = "http://ext.nicovideo.jp/api/getthumbinfo/" + content_id;
    var xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        console.log("非同期通信によるコンテンツデータ取得成功.");
        console.log(this.response);
        callback(this.response);
    }
    xhr.onerror = function(e) {
        console.log("readyState:" + xhr.readyState);
        console.log("response:" + xhr.response);
        console.log("status:" + xhr.status);
        console.log("statusText:" + xhr.statusText);
        console.log("非同期通信によるコンテンツデータ取得失敗.");
        callback(this.response);
    }
    xhr.open("GET"
    , url
    , true);
    xhr.responseType = "document";
    xhr.send();

    console.log("getNicoVideoInfoDocAsync leave");
}

/**
 * 動画情報取得.
 * @param {Any} data コンテンツデータ.
 * @return {Promise} 非同期処理.
 */
function getNicoVideoInfoJsonAsync(data) {
    return new Promise(function(resolve, reject) {
        console.log("getNicoVideoInfoJsonAsync enter");

        if (!Object.isEmpty(data)) {
            getNicoVideoInfoDocAsync(data["content_id"],  function(dom){
                console.log("getNicoVideoInfoJsonAsync doc callback enter");

                if (!Object.isEmpty(dom)) {
                    // DOMから情報抽出.
                    var title = getElementText(dom.querySelector("title"));
                    var description = getElementText(dom.querySelector("description"));
                    var url = getElementText(dom.querySelector("watch_url"));
                    var thumb_url = getElementText(dom.querySelector("thumbnail_url"));
                    var tags = [];
                    console.log(dom.querySelectorAll("tags tag"));
                    dom.querySelectorAll("tags tag").forEach(function(value) {
                        tags.push(getElementText(value));
                    });

                    // コンテンツに取得した情報を追加.
                    data["title"] = title;
                    data["description"] = description;
                    data["url"] = url;
                    data["thumb_url"] = thumb_url;
                    data["tags"] =tags;
                    console.log(data);
                }
                resolve(data);

                console.log("getNicoVideoInfoJsonAsync doc callback leave");
            });
        } else {
            resolve(data);
        }

        console.log("getNicoVideoInfoJsonAsync leave");
    });
}