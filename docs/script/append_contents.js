/** 動画サイト名. */
const SITE_NAME = {
    NICOVIDEO : "nicovideo",
    YOUTUBE : "youtube"
}
/** 動画サイト情報. */
const SITE_DATA = {
    NICOVIDEO : {
        EMBED_PLAYER_URL : "http://embed.nicovideo.jp/watch/",
        TAG_URL : "http://www.nicovideo.jp/tag/",
        PLAY_ICON_SVG : `
        <svg
            class="play_icon"
            role="img"
            viewBox="0 0 100 100">
            <path
                d="M95.092 42.059a8.878 8.878 0 0 1 0 15.882L12.848 99.063A8.878 8.878 0 0 1 0 91.122V8.878A8.879 8.879 0 0 1 12.848.937l82.244 41.122z"
                >
            </path>
        </svg>`
    },
    YOUTUBE : {
        EMBED_PLAYER_URL : "https://www.youtube.com/embed/",
        TAG_URL : "https://www.youtube.com/results?search_query=",
        PLAY_ICON_SVG : `
        <svg
            class="play_icon"
            role="img"
            viewBox="0 0 68 48">
            <path
                d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                fill="#212121"
                fill-opacity="0.8"
                >
            </path>
            <path
                d="M 45,24 27,14 27,34"
                fill="#fff"
                >
            </path>
        </svg>`
    }
}

/** コンテンツデータ.
    {
        "id":<コンテンツID>, ※フォーマット：mv<number>
        "site_name":<動画サイト名>,
        "content_id":<動画サイトのもつ動画コンテンツのID>,
        "series":<シリーズ名>, ※シリーズ名に従ってグルーピングされて表示される.
        "title":<動画タイトル>,
        "description":<説明文>,
        "url":<動画URL>,
        "thumb_url":<動画サムネイルURL>,
        "tags":[<タグ>],
    },
 */
var mContentsData;
/** グループデータ.
    {
        "group_id":<グループID>, 
        "group_name":<グループ名>, ※コンテンツデータのシリーズ名を設定する.
        "contents":[<コンテンツデータ>],
    }
 */
var mGroupData;

/**
 * コンテンツDOM追加.
 * @param {Element} elem 対象DOM要素.
 */
function appendContents(elem) {
    console.log("appendContents enter");

    if (elem instanceof Element) {
        getSimpleContentsDataAsync()
        .then(getDetailContentsData)
        .then(function(detailContentsData){
            mContentsData = detailContentsData;
            mGroupData = buildGroup(detailContentsData);
            appendContentsInner(elem, mGroupData);
        })
        .catch(function(){
            // onRejected.
            appendContentsInner(elem, null);
        });
    }

    console.log("appendContents leave");
}

function getSimpleContentsDataAsync() {
    return new Promise(function(resolve, reject) {
        console.log("getSimpleContentsDataAsync enter");

        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            console.log("getSimpleContentsDataAsync 非同期通信によるコンテンツデータ取得成功.");
            console.log(this.response);
            resolve(this.response);
        }
        xhr.onerror = function(e) {
            console.log("readyState:" + xhr.readyState);
            console.log("response:" + xhr.response);
            console.log("status:" + xhr.status);
            console.log("statusText:" + xhr.statusText);
            console.log("getSimpleContentsDataAsync 非同期通信によるコンテンツデータ取得失敗.");
            reject();
        }
        xhr.open("GET", "./data/movies.json", true);
        xhr.responseType = "json";
        xhr.send();

        console.log("getSimpleContentsDataAsync leave");
    });
}
function getDetailContentsData(simpleContentsData) {
    return Promise.all(
        simpleContentsData.map(function(value) {
            return getVideoInfoJsonAsync(value);
        })
    );
}

/**
 * 動画情報取得.
 * @param {Any} data コンテンツデータ.
 * @return {Promise} 非同期処理.
 */
function getVideoInfoJsonAsync(data) {
    console.log("getVideoInfoJsonAsync enter.");

    var ret;

    if (data, data["site_name"]) {
        switch (data["site_name"]) {
        case SITE_NAME.NICOVIDEO:
            ret = getNicoVideoInfoJsonAsync(data);
            break;
        case SITE_NAME.YOUTUBE:
            ret = getYoutubeVideoInfoJsonAsync(data);
            break;
        default:
            ret = new Promise(function(resolve, reject) {
                console.log("getVideoInfoJsonAsync unknown site nop.");
                resolve(data);
            });
            break;
        }
    } else {
        ret = new Promise(function(resolve, reject) {
            console.log("getVideoInfoJsonAsync unknown site nop.");
            resolve(data);
        });
    }

    console.log("getVideoInfoJsonAsync leave.");
    return ret;
}

function buildGroup(detailContentsData) {
    console.log("buildGroup enter");

    var groupData = [];
    detailContentsData.forEach(function(value){
        // コンテンツデータのシリーズに一致するグループを探す.
        var groupIndex = groupData.findIndex(function(elem, index, array){
            if (value["series"] === elem["group_name"]) {
                return true;
            } else {
                return false;
            }
        });
        if (groupIndex > -1) {
            // グループが見つかった場合、コンテンツデータを追加.
            groupData[groupIndex]["contents"].push(value);
        } else {
            // グループが見つからなかった場合、グループを作ってコンテンツデータを追加.
            groupData.push({"group_id":groupData.length,"group_name":value["series"], "contents":[value]});
        }
    });
    groupData = groupData.sort(function(a,b){
        var ret = 0;
        if (a["group_name"] < b["group_name"]) {
            ret = -1;
        } else if (a["group_name"] > b["group_name"]) {
            ret = 1;
        }
        return ret;
    });

    console.log("buildGroup leave");
    console.log(groupData);
    return groupData;
}

/**
 * コンテンツDOM追加.
 * @param {Element} elem 対象DOM要素.
 * @param {Any[]} groupData グループデータ.
 */
function appendContentsInner(elem, groupData) {
    console.log("appendContentsInner enter");

    removeAllChildren(elem);

    if (Array.isArray(groupData)) {
        groupData.forEach(function(value) {
            appendGroup(elem, value);
        });
    } else {
        elem.insertAdjacentHTML("beforeend", "no data.");
    }

    console.log("appendContentsInner leave");
}

/**
 * グループDOM1件追加.
 * @param {Element} elem 対象DOM要素.
 * @param {Any} data グループデータ.
 */
function appendGroup(elem, data) {
    console.log("appendGroup enter");

    var html = `<!-- 余白消しのコメント
 --><div class="group" id="group_{group_id}">
        <div class="group_title"
            onclick="onClickGroupTitle(this);"
            >
            <img class="group_accordion_icon open"
                src="./image/chevron_up_circle.svg"
            />{group_name}
        </div>
        <div class="group_contents open">
        </div>
    </div>`
    .format(data);
    elem.insertAdjacentHTML("beforeend", html);

    if (Array.isArray(data["contents"])) {
        var groupNode = elem.querySelector("#group_{group_id} .group_contents".format(data));
        data["contents"].forEach(function(value){
            appendContent(groupNode, value);
        });
    }

    console.log("appendGroup leave");
}
/**
 * コンテンツDOM1件追加.
 * @param {Element} elem 対象DOM要素.
 * @param {Any} data コンテンツデータ.
 */
function appendContent(elem, data) {
    console.log("appendContent enter");

    var site_data;
    switch (data["site_name"]) {
    case SITE_NAME.NICOVIDEO:
        site_data = SITE_DATA.NICOVIDEO;
        break;
    case SITE_NAME.YOUTUBE:
        site_data = SITE_DATA.YOUTUBE;
        break;
    }

    var html1 = `<!-- 余白消しのコメント
 --><div class="content {site_name}" id="{id}">
        <div class="title" title="{title}">
            <a href="{url}">
                {title}
            </a>
        </div>
        <div>
            <div class="thumb normal"
                onmouseover="toggleMouseOverState(this);"
                onmouseout ="toggleMouseOverState(this);"
                onclick="appendPreviewLayer(document.body, '{id}')">
                <div class="dl_overlay"><!-- 余白消しのコメント
                 --><button
                        class="play_btn"
                        style="display:inline-block;">
                        {PLAY_ICON_SVG}
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
    .format(site_data)
    .format(data);

    var html2 = "";
    if (Array.isArray(data["tags"])) {
        data["tags"].forEach(function(value){
            html2 += `
                        <li class="tag normal"
                            onmouseover="toggleMouseOverState(this);"
                            onmouseout ="toggleMouseOverState(this);"
                            ><a href="{TAG_URL}{0}">{0}</a></li>`
            .format(site_data)
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
        mContentsData.some(function(value){
            if (value["id"] == id) {
                var site_data;
                switch (value["site_name"]) {
                case SITE_NAME.NICOVIDEO:
                    site_data = SITE_DATA.NICOVIDEO;
                    break;
                case SITE_NAME.YOUTUBE:
                    site_data = SITE_DATA.YOUTUBE;
                    break;
                }
                var html = `
                <div id="movie_preview_layer">
                    <span><!-- 縦中央配置用. --></span><!-- 外部プレイヤー.
                 --><iframe id="player_frame"
                            src="{EMBED_PLAYER_URL}{content_id}"
                            frameborder="0"
                            allowfullscreen
                            >
                    </iframe>
                    <button
                        id="layer_colse_btn"
                        class="normal"
                        onmouseover="toggleMouseOverState(this);"
                        onmouseout ="toggleMouseOverState(this);">
                        <svg
                            class="close_icon"
                            role="img"
                            viewBox="0 0 100 100">
                            <path
                                d="M50 32.762l31.55-31.55a4.139 4.139 0 0 1 5.851 0l11.387 11.387a4.137 4.137 0 0 1 0 5.851L67.238 50l31.55 31.55a4.139 4.139 0 0 1 0 5.851L87.401 98.788a4.137 4.137 0 0 1-5.851 0L50 67.238l-31.55 31.55a4.139 4.139 0 0 1-5.851 0L1.212 87.401a4.137 4.137 0 0 1 0-5.851L32.762 50 1.212 18.45a4.139 4.139 0 0 1 0-5.851L12.599 1.212a4.137 4.137 0 0 1 5.851 0L50 32.762z" data-reactid="116">
                            </path>
                        </svg>
                    </button>
                </div>`
                .format(site_data)
                .format(value);
                parent.insertAdjacentHTML("beforeend", html);
                return true;
            }
        });
        var appendLayer = parent.querySelector("#movie_preview_layer");
        var layer_colse_btn = parent.querySelector("#layer_colse_btn");
        layer_colse_btn.addEventListener("click",
            function(e){
                // ボタンをクリックしたらレイヤー削除.
                if (e != null) {
                    console.log("onClick", e.target);
                    if (e.target.id == "layer_colse_btn") {
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

/**
 * 開閉状態切替.
 * @param {Element} elem 対象要素.
 */
function toggleOpenCloseState(elem) {
    toggleAttr(elem,'class','open');
    toggleAttr(elem,'class','close');
}

/**
 * グループタイトルクリック時処理.
 * @param {Element} elem 対象要素.
 */
function onClickGroupTitle(elem) {
    toggleOpenCloseState(elem.parentElement.querySelector(".group_contents"));
    toggleOpenCloseState(elem.querySelector("img.group_accordion_icon"));
    var icon = elem.querySelector("img.group_accordion_icon");
    if (hasAttrValue(icon, 'class', 'close')) {
        icon.src = "./image/chevron_down_circle.svg";
    } else {
        icon.src = "./image/chevron_up_circle.svg";
    }
}