let SourceService = {
    showList: function () {
        let userId = localStorage.getItem("userInfo").id;
        let roles = localStorage.getItem('userRoles');
        globalService.setSectionTagUI(
            `<button style="margin-top: 32px;margin-left: 32px" onclick="ScoreService.upload()" type="button" class="layui-btn">提交资源</button>
<!--            <label class="layui-form-label">是否为译文</label>-->
            <input id="upload" type="file" hidden>
            <table id="demoId" class="layui-hide" lay-filter="source"></table>
            `);
        $("#upload").on('change', function () {
            let files = $('#upload')[0].files;
            debugger
            console.log(files);
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("save", "true");
            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/file/upload`,
                type: 'post',
                data: formData,
                processData: false,//必填 必须false 才会避开jq对formdata的默认处理 XMLHttpRequest才会对formdata进行正确处理  否则会报Illegal invocation错误
                contentType: false,//必填 必须false 才会加上正确的Content-Type
                success: function (res) {
                    if (res.ret) {
                        SourceService.showList();
                        layui.use('layer', function () {
                            layer.msg("上传成功", {icon: 1, time: 2000}, function () {
                                layer.closeAll();
                            })
                        });
                    }
                }
            })
        });
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/source/list?all=true`,
            type: 'get',
            processData: false,//必填 必须false 才会避开jq对formdata的默认处理 XMLHttpRequest才会对formdata进行正确处理  否则会报Illegal invocation错误
            contentType: false,//必填 必须false 才会加上正确的Content-Type
            success: function (res) {
                if (res.ret) {
                    layui.use('table', function () {
                        for (let row of res.data) {
                            row.size = (row.size / 1024).toFixed(2).replace(/\b(0+)/gi, "");
                            debugger
                            if (row.size.endsWith(".")) {
                                row.size = row.size.substr(0, row.size.length - 1)
                            }
                            row.operate = `
                                <a style="color: red"  href="${globalService.basePath}/file/download/${row.id}">下载/查看</a>
                              
                                ${userId===row.id||roles.includes('管理员')?'&nbsp;&nbsp;&nbsp;&nbsp;<a style="color: red"  href="javascript:void(0)" onclick="SourceService.delete(${row.id})">删除</a>':''}
                                `
                        }
                        layui.table.render({
                            elem: '#demoId'//绑定元素
                            , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            , cols: [[
                                {field: 'id', width: '10%', hide: true, title: ''}
                                , {field: 'filename', width: '20%', title: '文件名', sort: true}
                                , {field: 'size', title: '大小(k)', sort: true}
                                , {field: 'type', title: '类型'}
                                , {field: 'uploader', title: '上传人', sort: true}
                                , {field: 'download', title: '下载次数', sort: true}
                                , {field: 'createTime', title: '上传时间', sort: true}
                                , {field: 'operate', title: '操作'}
                            ]]
                            , skin: 'line' //表格风格
                            , even: true
                            , data: res.data
                        });
                    });
                }
            }
        });


    },
    upload: function () {
        $("#upload").click()
    },
    delete: function (id) {
        layer.confirm('确认删除？删除后无法恢复。', {
            btn: ['确认', '取消']
        }, function () {
            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/source/${id}`,
                type: 'delete',
                processData: false,//必填 必须false 才会避开jq对formdata的默认处理 XMLHttpRequest才会对formdata进行正确处理  否则会报Illegal invocation错误
                contentType: false,//必填 必须false 才会加上正确的Content-Type
                success: function (res) {
                    if (res.ret) {
                        SourceService.showList();
                        layui.use('layer', function () {
                            layer.msg("删除成功", {icon: 1, time: 2000}, function () {
                                layer.closeAll();
                            })
                        });
                    }
                }
            })
        });
    }
};