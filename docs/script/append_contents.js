/** コンテンツデータ. */
var mContentsData;
/** 検索結果反映済コンテンツデータ. */
var mExContentsData = [];

/**
 * コンテンツDOM追加.
 * @param {Element} elem 対象DOM要素.
 */
function appendContents(elem) {
    console.log("appendContents enter");

    if (elem instanceof Element) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            console.log("非同期通信によるコンテンツデータ取得成功.");
            console.log(this.response);
            mContentsData = this.response;
            appendContentsInner(elem, mContentsData);
        }
        xhr.onerror = function(e) {
            console.log("readyState:" + xhr.readyState);
            console.log("response:" + xhr.response);
            console.log("status:" + xhr.status);
            console.log("statusText:" + xhr.statusText);
            console.log("非同期通信によるコンテンツデータ取得失敗.");
            appendContentsInner(elem, null);
        }
        xhr.open("GET", "./data/movies.json", true);
        xhr.responseType = "json";
        xhr.send();
    }

    console.log("appendContents leave");
}

/**
 * コンテンツDOM追加.
 * @param {Element} elem 対象DOM要素.
 * @param {Any[]} data コンテンツデータ.
 */
function appendContentsInner(elem, data) {
    console.log("appendContentsInner enter");

    removeAllChildren(elem);

    if (Array.isArray(data)) {
        data.forEach(function(value) {
            get_video_info_json(value, function(extend_data){
                console.log("appendContentsInner get_video_info_json callback enter");
                mExContentsData.push(extend_data);
                appendContent(elem, extend_data);
                console.log("appendContentsInner get_video_info_json callback leave");
            });
        })
    } else if (typeof data == "object") {
        get_video_info_json(data, function(extend_data){
            console.log("appendContentsInner get_video_info_json callback enter");
            appendContent(elem, extend_data);
            console.log("appendContentsInner get_video_info_json callback leave");
        });
    } else {
        elem.insertAdjacentHTML("beforeend", "no data.");
    }

    console.log("appendContentsInner leave");
}

/**
 * コンテンツDOM1件追加.
 * @param {Element} elem 対象DOM要素.
 * @param {Any} data コンテンツデータ.
 */
function appendContent(elem, data) {
    console.log("appendContent enter");

    var html1 = `<!-- 余白消しのコメント
 --><div class="content" id="{id}">
        <div class="title" title="{title}">
            <a href="{url}">
                {title}
            </a>
        </div>
        <div>
            <div class="thumb normal"
                onmouseover="toggleMouseOverState(this);"
                onmouseout ="toggleMouseOverState(this);"
                onclick="appendPreviewLayer(document.body, '{id}')"
                >
                <div class="dl_overlay"><!-- 余白消しのコメント
                 --><button
                        class="play_btn"
                        style="display:inline-block;"
                        data-reactid="41">
                        <svg
                            class="play_icon"
                            role="img"
                            viewBox="0 0 100 100"
                            data-reactid="42">
                            <path
                                d="M95.092 42.059a8.878 8.878 0 0 1 0 15.882L12.848 99.063A8.878 8.878 0 0 1 0 91.122V8.878A8.879 8.879 0 0 1 12.848.937l82.244 41.122z"
                                data-reactid="43">
                            </path>
                        </svg>
                    </button>
                </div>
                <img class="thumb_image" src="{thumb_url}" />
            </div><!-- 余白消しのコメント
         --><div class="desc_area"><!-- 余白消しのコメント
             --><div class="desc">
                    {description}
                </div>
            </div><!-- 余白消しのコメント
         --><div class="tags_area"><!-- 余白消しのコメント
             --><ul class="tags">`
    .format(data);

    var html2 = "";
    if (data["tags"] !== undefined) {
        data["tags"].forEach(function(value){
            html2 += `
                        <li class="tag normal"
                            onmouseover="toggleMouseOverState(this);"
                            onmouseout ="toggleMouseOverState(this);"
                            ><a href="http://www.nicovideo.jp/tag/{0}">{0}</a></li>`
            .format(value);
        });
    }

    var html3 = `
                </ul>
            </div>
        </div>
    </div>`
    .format(data);
    elem.insertAdjacentHTML("beforeend", html1+html2+html3);

    console.log("appendContent leave");
}

/**
 * プレビューレイヤー追加.
 * @param {Element} parent レイヤー追加対象要素.
 * @param {string} id ID.
 */
function appendPreviewLayer(parent, id) {
    console.log("appendPreviewLayer enter");
    console.log(parent);
    console.log(id);

    if (parent instanceof Element) {
        var elem = parent.querySelector("#movie_preview_layer");
        if (elem != null) {
            parent.removeChild(elem);
        }
        // レイヤー追加.
        mExContentsData.some(function(value){
            if (value["id"] == id) {
                var html = `
                <div id="movie_preview_layer">
                    <!-- ニコニコ動画外部プレイヤー. -->
                    <iframe id="nicovideo_player"
                            src="http://embed.nicovideo.jp/watch/{content_id}"
                            frameborder="0"
                            allowfullscreen
                            >
                    </iframe>
                </div>`.format(value);
                parent.insertAdjacentHTML("beforeend", html);
                return true;
            }
        });
        var appendLayer = parent.querySelector("#movie_preview_layer");
        appendLayer.addEventListener("click",
            function(e){
                // レイヤー上の何もオブジェクトが表示されていない部分をクリックしたらレイヤー削除.
                if (e != null) {
                    console.log("onClick", e.target);
                    if (e.target.id == "movie_preview_layer") {
                        parent.removeChild(appendLayer);
                    }
                }
            },
            false
        );
    }

    console.log("appendPreviewLayer leave");
}

/**
 * マウスオーバー状態切替.
 * @param {Element} elem 対象要素.
 */
function toggleMouseOverState(elem) {
    toggleAttr(elem,'class','normal');
    toggleAttr(elem,'class','over');
}