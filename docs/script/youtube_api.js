/**
 * 動画情報取得.
 * @param {Any} data コンテンツデータ.
 * @return {Promise} 非同期処理.
 */
function getYoutubeVideoInfoJsonAsync(data) {
    return new Promise(function(resolve, reject) {
        console.log("getYoutubeVideoInfoDocAsync enter");

        if (!Object.isEmpty(data["content_id"])) {
            // コンテンツに取得した情報を追加.
            // data["title"] = title;
            data["description"] = "no description";
            data["url"] = "https://www.youtube.com/watch?v={content_id}".format(data);
            data["thumb_url"] = "https://i.ytimg.com/vi/{content_id}/default.jpg".format(data);
            // data["tags"] =tags;
            console.log(data);
            resolve(data);
        }

        console.log("getYoutubeVideoInfoDocAsync leave");
    });
}