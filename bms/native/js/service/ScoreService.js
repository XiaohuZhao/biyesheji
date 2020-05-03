let ScoreService = {
    show: function () {
        globalService.setSectionTagUI(
            `<button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="ScoreService.upload()" type="button" class="layui-btn">提交表格</button>
            <input id="upload" type="file" hidden>
            <div style="height: 600px;width: 800px;background-color: white;margin: 64px">
                <div id="chart" style="height: 100%;width: 100%"></div>
            </div>
            `);
        $("#upload").on('change', function () {
            let files = $('#upload')[0].files;
            console.log(files);
            const formData = new FormData();
            formData.append("file", files[0]);
            $.ajax({
                url: `${globalService.basePath}/score/upload`,
                type: 'post',
                data: formData,
                processData: false,//必填 必须false 才会避开jq对formdata的默认处理 XMLHttpRequest才会对formdata进行正确处理  否则会报Illegal invocation错误
                contentType: false,//必填 必须false 才会加上正确的Content-Type
                success: function (res) {
                    if (res.ret) {
                        drewPie(res.data)
                        layui.use('layer', function () {
                            layer.msg("上传成功", {icon: 1, time: 2000}, function () {
                                layer.closeAll();
                            })
                        });
                    }
                }
            })
        })
    },
    upload: function () {
        $("#upload").click()
    }
};