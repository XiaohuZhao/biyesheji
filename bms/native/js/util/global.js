var globalService = {
    tokenOfHeader:localStorage.getItem("token"),
    basePath:"http://192.168.0.102:8080",
    setSectionTagUI:function(html){
        $('section').html(html);
    },
    pop:function(/*width, height, top, left,*/ insertHtml) {
        //1.添加遮罩层。

        //创建遮罩层。
        var overLayer = $('<div id="overLayer"></div>');
        overLayer.css({
            height: '100%',
            width: '100%',
            background: 'rgba(0,0,0,.6)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999
        });
        //body 最后一行加入我们的层。
        $('body').append(overLayer)

        //2.在遮罩层上，添加弹窗div.
        var popWindow = $('<div id="popWindow"></div>');

        popWindow.css({
            width: "calc(100vw - 20vw)",
            height: "calc(100vh - 20vh)",
            background: "#f2f2f2",
            position: "fixed",
            top: "10vh",
            left: "10vw",
            zIndex: "1000",
            borderRadius: "4px"
        });
        overLayer.after(popWindow);

        popWindow.html(insertHtml);

        $("#overLayer").on("click", function () {
            //点击影子区域，大小面板消失。
            $("#overLayer").add(popWindow).fadeOut("show", function () {
                $(this).remove();
            })
        })
    },
    removePop:function () {
        $("#overLayer").remove();
        $("#popWindow").remove();
    }
}