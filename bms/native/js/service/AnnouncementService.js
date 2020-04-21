var AnnouncementService = {
    showList: function () {

        //  lauui.use(["jquery","layer","form",'table'],function(){});
        layui.use(["jquery", "layer", "form", 'table'], function () {
            var layUi_$ = layui.$, layer = layui.layer, form = layui.form, table = layui.table;

            //1.清楚上一次展示的数据,并设置新的视图。
            globalService.setSectionTagUI("            <table id=\"demoId\" class=\"layui-hide\" lay-filter=\"demoId\"></table>\n" +
                "            \n" +
                "            <script type=\"text/html\" id=\"toolbarDemo\">\n" +
                "\n" +
                "                <div class=\"layui-btn-group  ml-1 mt-2\">\n" +
                "                    <button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-sm\"  lay-event=\"addData\"><i class=\"layui-icon\"></i>\n" +
                "                    </button>\n" +
 /*               "                    <button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-sm\"  lay-event=\"editData\"><i class=\"layui-icon\"></i>\n" +
                "                    </button>\n" +*/
                "                    <button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-sm\"  lay-event=\"deleteData\"><i class=\"layui-icon\"></i>\n" +
                "                    </button>\n" +
                "                </div>\n" +
                "            </script>");
            //2.发送ajax.
            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/announcement/user',
                type: "get",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                success: function (res) {
                    if (res.code == 200) {
                        table.render({
                            elem: '#demoId'//绑定元素
                            , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            , toolbar: '#toolbarDemo'
                            , cols: [[
                                {type: 'checkbox', width: 70},
                                //{type:'radio'},
                                {field: 'id', width: 70, title: 'ID', show: false, sort: true}
                                , {field: 'title', width: 280, title: '标题'}
                                , {field: 'content', title: '内容'}
                            ]]
                            , skin: 'line' //表格风格
                            , even: true
                            , page: true //是否显示分页
                            , data: res.data
                            , height: 'full-200'
                            , limit: 30
                            , done: function () {
                                //         // 表格渲染后，用JS覆盖一下layui表格中不好看的样式。
                                $('#demoId>.layui-table-view').css("margin", "2px 0")

                                //alert( $('#demoId>.layui-table-view').css("margin"));
                            }
                        });
                    } else {
                        layer.msg(res.msg);
                    }
                },
                beforeSend: function () {
                    this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
                },
                complete: function () {
                    layer.close(this.layerIndex);
                }
                ,
                error: function () {
                    layer.msg("接口不可用！");
                }
            });

            // 表格渲染后，用JS覆盖一下layui表格中不好看的样式。
            // .layui-table-view {
            //         margin: 10px 0;
            //     }


            //绑定行点击事件。
            table.on('row(demoId)', AnnouncementService.lookOne);
            table.on('toolbar(demoId)', function (obj) {

                console.log(obj)

                // 行事件
                var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
                switch (obj.event) {
                    case 'addData':
                        var data = checkStatus.data;  //获取选中行数据
                       // console.log(JSON.stringify(data));
                       // layer.msg("add");
                        //添加数据。
                        globalService.pop("  <div class=\"layui-form-item p-all-20\">\n" +
                            "    <label class=\"layui-form-label\">公告标题</label>\n" +
                            "    <div class=\"layui-input-block\">\n" +
                            "      <input type=\"text\" name=\"title\" lay-verify=\"title\" autocomplete=\"off\" placeholder=\"请输入公告标题\" class=\"layui-input announcementTitle\">\n" +
                            "    </div>\n" +
                            "  </div>" +

                            " <div class=\"layui-form-item layui-form-text p-horizontal-direction-20\">\n" +
                            "    <label class=\"layui-form-label\">内容</label>\n" +
                            "    <div class=\"layui-input-block\">\n" +
                            "      <textarea placeholder=\"请输入公告内容\" class=\"layui-textarea announcementContent\"></textarea>\n" +
                            "    </div>\n" +
                            "  </div>" +
                            "" +
                            "  <div class=\"layui-form-item  p-horizontal-direction-20\">\n" +
                            "    <div class=\"layui-input-block\">\n" +
                            "      <button onclick='AnnouncementService.addAnnouncement()' type=\"submit\" class=\"layui-btn\" lay-submit=\"\" lay-filter=\"demo1\">立即提交</button>\n" +
                            "    </div>\n" +
                            "  </div>");
                        break;
                    case 'editData':
                        var data = checkStatus.data;  //获取选中行数据
                        alert(JSON.stringify(data.length));


                        if(data.length==0){
                            layer.msg("当前未选择，请选择一个公告。");
                            return;
                        }else if(data.length>1){
                            layer.msg("请选择唯一的公告进行编辑。");
                            return;
                        }else if(data.length == 1){
                        AnnouncementService.editAnnouncement(data[0].id);
                        }

                        break;
                    case 'deleteData':
                        var data = checkStatus.data;  //获取选中行数据
                        alert(JSON.stringify(data.length));

                        let ids = [];
                        for (var i = 0; i < data.length; i++) {
                            let id = data[i].id;
                            ids.push(id);
                        }
                        AnnouncementService.deleteAjax(ids);
                        break;
                }
                ;
            });

        })
    },
    lookOne: function (obj) {
        let lineData = obj.data;

        // for( field in lineData){
        //     console.log(field + ' : ' + lineData[field])
        // }

        layer.open({
            title: lineData.title
            , content: lineData.content
            , area: ['1200px', '550px']
        });


    },
    deleteAjax: function (ids) {
        //发送ajax

        $.ajax({
            headers: {"X-Authentication-Token": globalService.tokenOfHeader},
            url: globalService.basePath + '/announcement/' + ids,
            type: "delete",
            contentType: "application/json;charset=utf-8",
            cache: false,
            async: true,
            beforeSend: function () {
                this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
            },
            success: function (res) {
                if (res.code == 200) {
                    layer.msg("删除成功")
                }
            },
            complete: function () {
                layer.close(this.layerIndex);
            }
        });

        AnnouncementService.showList();
    },
    editAnnouncement: function (id) {
        layer.msg("edit id ：" + id);
        //根据id 查询当前id的信息，并绑定到页面上。



        //打开pop 进行数据绑定。
        globalService.pop();



    },
    addAnnouncement: function () {
        let announcementContent = $('.announcementContent').val();
        let announcementTitle = $('.announcementTitle').val();

        let param = {title: announcementTitle, content: announcementContent};
        $.ajax({
            headers: {"X-Authentication-Token": globalService.tokenOfHeader},
            url: globalService.basePath + '/announcement',
            type: "post",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(param),
            cache: false,
            async: true,
            success: function (res) {
                if (res.code == 200) {
                    layer.msg("添加成功");

                    //异步中得同步。放在外面可能执行不到，因为是异步得。
                    globalService.removePop();
                    AnnouncementService.showList();
                }
            }


            // ,
            // beforeSend: function () {
            //     this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
            // },
            // complete: function () {
            //     layer.close(this.layerIndex);
            // }
        });
    },
    queryOneAnnouncement:function (id) {
        $.ajax({
            headers: {"X-Authentication-Token": globalService.tokenOfHeader},
            url: globalService.basePath + '/announcement',
            type: "get",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(param),
            cache: false,
            async: true,
            beforeSend: function () {
                this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
            },
            success: function (res) {
                if (res.code == 200) {
                    layer.msg("添加成功")
                }
            },
            complete: function () {
                layer.close(this.layerIndex);
            }
        });
    }

}