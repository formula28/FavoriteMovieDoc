// ニコニコ動画のマイリストページでコンソールから、実行するとjsonのリストを得られる.
JSON.stringify(
    Array.from(
        document.querySelectorAll(".SYS_box_item td.SYS_box_item_data p.font16 a.watch")
    ).map(
        function(v){
            return {"id":"", "content_id":v.href, "series":"エリカの交換訓練プログラム", "title":v.textContent};
        }
    ).sort(
        function(a,b){
            if(a.toString() < b.toString()){return -1;}
            else{return 1;}
        }
    )
);