/**
 * 動画情報取得.
 * @param {string} content_id ニコニコ動画のコンテンツID(sm..., so... など)
 * @param {function} callback 通信成功/失敗後のコールバック.getthumbinfo API で取得できるxmlをDOMで引数に渡す.
 */
function get_video_info_doc(content_id, callback) {
    console.log("get_video_info_doc enter");

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

    console.log("get_video_info_doc leave");
}

/**
 * 動画情報取得.
 * @param {Any[]} data コンテンツデータ.
 * @param {function} callback コールバック.引数に動画情報を追加したdataを渡す.
 */
function get_video_info_json(data, callback) {
    console.log("get_video_info_json enter");

    if (!Object.isEmpty(data)) {
        get_video_info_doc(data["content_id"],  function(dom){
            console.log("get_video_info_json doc callback enter");

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
            callback(data);

            console.log("get_video_info_json doc callback leave");
        });
    }

    console.log("get_video_info_json leave");
}