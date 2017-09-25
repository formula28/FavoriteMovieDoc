/** コンテンツデータ. */
var mContentsData;

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
            //var mContentsData = JSON.parse(this.response);
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
            appendContent(elem, value);
        })
    } else if (typeof data == "object") {
        appendContent(elem, data);
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

    var html1 = `
    <div class="content" id="{id}">
        <div class="title">
            <a href="{url}">
                {title}
            </a>
            <div class="btn_area">
                <div class="open_preview_btn normal"
                    onmouseover="toggleMouseOverState(this);"
                    onmouseout ="toggleMouseOverState(this);"
                    onclick="appendPreviewLayer(document.body, '{id}')"
                >
                    <span>preview</span>
                </div>
            </div>
        </div>
        <div class="b">
            <div class="thumb">
                <a href="{url}">
                    <img src="{thumb}" />
                </a>
            </div><!-- 余白消しのコメント
         --><div class="br">
                <ul class="tags">`
    .format(data);

    var html2 = "";
    data["tags"].forEach(function(value){
        html2 += `
                    <li class="tag normal"
                        onmouseover="toggleMouseOverState(this);"
                        onmouseout ="toggleMouseOverState(this);"
                        ><a href="http://www.nicovideo.jp/tag/{0}">{0}</a></li>`
        .format(value);
    });

    var html3 = `
                </ul><!-- 余白消しのコメント
             --><div class="desc">
                    {description}
                </div>
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
 * @param {string} content_id コンテンツID.
 */
function appendPreviewLayer(parent, content_id) {
    console.log("appendPreviewLayer enter");
    console.log(parent);
    console.log(content_id);

    if (parent instanceof Element) {
        var elem = parent.querySelector("#movie_preview_layer");
        if (elem != null) {
            parent.removeChild(elem);
        }
        // レイヤー追加.
        mContentsData.some(function(value){
            if (value["id"] == content_id) {
                var html = `
                <div id="movie_preview_layer">
                    <!-- ニコニコ動画外部プレイヤー. -->
                    <iframe id="nicovideo_player"
                            src="http://embed.nicovideo.jp/watch/{watch_id}"
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