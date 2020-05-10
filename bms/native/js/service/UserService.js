let UserService = {
    groups: [],
    //页面请求
    request: {
        lookMyInfoRequest() {
            layui.use(["layer"], function () {
                let layer = layui.layer;
                $.ajax({
                    headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                    url: globalService.basePath + '/user',
                    type: "get",
                    cache: false,
                    async: true,
                    beforeSend: function () {
                        this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            sessionStorage.setItem("id", res.data.id);
                            sessionStorage.setItem("name", res.data.name);
                            sessionStorage.setItem("age", res.data.age);
                            sessionStorage.setItem("gender", res.data.gender);
                            sessionStorage.setItem("password", res.data.password);
                            sessionStorage.setItem("telephone", res.data.telephone);

                            globalService.setSectionTagUI(UserView.lookMyselfUserInfo);

                        }
                    },
                    complete: function () {
                        layer.close(this.layerIndex);
                    }
                });
            });

        },
        deleteRequest: function (telephone) {
            //发送ajax

            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/user/' + telephone,
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
                        UserService.operation.showListOperation();
                    }

                },
                complete: function () {
                    layer.close(this.layerIndex);
                }
            });

        },
        editMyselfUserInfoRequest: function (id) {
            let name = $('.name').val();
            let password = $('.password').val();
            let newTelephone = $('.newTelephone').val();
            let age = $('.age').val();
            let gender = $('.gender').val();

            layer.msg("add Request");
            let param = {name: name, password: password, newTelephone: newTelephone, age: age, gender: gender};
            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/user',
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(param),
                cache: false,
                async: true,
                success: function (res) {
                    if (res.code == 200) {
                        layer.msg("修改成功");

                        //更新本地数据，页面数据回显。
                        sessionStorage.setItem("name", res.data.name);
                        sessionStorage.setItem("age", res.data.age);
                        sessionStorage.setItem("password", res.data.password);
                        sessionStorage.setItem("gender", res.data.gender);
                        sessionStorage.setItem("telephone", res.data.telephone);
                        globalService.setSectionTagUI(UserView.lookMyselfUserInfo());
                    } else {
                        layer.msg(res.msg);
                    }
                },
                complete: function () {
                    layer.close(this.layerIndex);
                },
                beforeSend: function () {
                    this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
                }
            });


        },
        //添加请求。
        addUserRequest: function () {
            let name = $('.name').val();
            let password = $('.password').val();
            let newTelephone = $('.newTelephone').val();
            let age = $('.age').val();
            let gender = $('.gender').val();
            gender = gender === "1" || "男" ? 1 : 2;

            layer.msg("add Request");
            let param = {name: name, password: password, newTelephone: newTelephone, age: age, gender: gender};
            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/user',
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(param),
                cache: false,
                async: true,
                success: function (res) {
                    if (res.code == 200) {
                        layer.msg("添加成功")
                        globalService.removePop();
                        UserService.operation.showListOperation();
                    } else {
                        layer.msg(res.msg);
                    }
                },
                complete: function () {
                    layer.close(this.layerIndex);
                },
                beforeSend: function () {
                    this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
                }
            });
        },
        queryOneUserRequest: function (id) {
            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/user',
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
        },
        editOtherUserRequest() {
            let name = $('.name').val();
            let password = $('.password').val();
            let telephone = $('.newTelephone').val();
            let age = $('.age').val();
            let gender = $('.gender').val();

            let param = {name: name, password: password, telephone: telephone, age: age, gender: gender};

            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/user/' + telephone,
                type: "PUT",
                cache: false,
                async: true,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(param),
                beforeSend: function () {
                    this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
                },
                success: function (res) {
                    if (res.code == 200) {
                        //layer.msg("返回成功 :" + JSON.stringify(res.data));

                        sessionStorage.setItem("name", res.data.name);
                        sessionStorage.setItem("age", res.data.age);
                        sessionStorage.setItem("gender", res.data.gender);
                        sessionStorage.setItem("password", res.data.password);
                        sessionStorage.setItem("telephone", res.data.telephone);

                        globalService.setSectionTagUI(UserView.lookOtherUserInfo());

                    }
                },
                complete: function () {
                    layer.close(this.layerIndex);
                }
            });


        }
    },
    //页面交互
    operation: {
        showListOperation: function () {
            layui.use(['table'], function () {
                let table = layui.table;
                //1.清楚上一次展示的数据,并设置新的视图。
                globalService.setSectionTagUI(UserView.showUserList);
                //2.发送ajax.
                UserService.operation.showListRequest();

                // 表格渲染后，用JS覆盖一下layui表格中不好看的样式。
                // .layui-table-view {
                //         margin: 10px 0;
                //     }

                //绑定行点击事件。 // UserService.operation.lookLineOperation
                //  table.on('row(demoId)',UserService.operation.lookLineOperation);
                table.on('toolbar(userTable)', function (obj) {
                    // console.log(obj)

                    // 行事件
                    var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
                    switch (obj.event) {
                        case 'addData':
                            UserService.operation.addOperation(checkStatus);
                            break;
                        case 'editData':
                            UserService.operation.editOperation(checkStatus);
                            break;
                        case 'deleteData':
                            UserService.operation.deleteOperation(checkStatus);
                            break;
                    }
                    ;
                });

            })
        },
        //添加操作
        addOperation(checkStatus) {
            var data = checkStatus.data;  //获取选中行数据
            // console.log(JSON.stringify(data));

            //添加数据。
            globalService.pop(UserView.addUserView);
        },
        editOperation(checkStatus) {
            layui.use(['layer'], function () {
                let layer = layui.layer;
                let data = checkStatus.data;  //获取选中行数据
                if (data.length == 0) {
                    layer.msg("当前未选择，请选择一个公告。");
                    return;
                } else if (data.length > 1) {
                    layer.msg("请选择唯一用户进行编辑。");
                    return;
                } else if (data.length == 1) {
                    sessionStorage.setItem("name", data[0].name);
                    sessionStorage.setItem("age", data[0].age);
                    sessionStorage.setItem("password", data[0].password);
                    sessionStorage.setItem("gender", data[0].gender);
                    sessionStorage.setItem("telephone", data[0].telephone);
                    globalService.setSectionTagUI(UserView.lookOtherUserInfo());

                    // UserService.request.editUserRequest(data[0].id);
                }
            });
        },
        deleteOperation(checkStatus) {
            var data = checkStatus.data;  //获取选中行数据

            // alert(JSON.stringify(data));

            if (data.length == 0) {
                layer.msg("当前未选择，请选择一个用户。");
                return;
            } else if (data.length > 1) {
                layer.msg("请选择唯一的用户进行删除。");
                return;
            } else if (data.length == 1) {
                console.log(JSON.stringify(data[0].length));
                UserService.request.deleteRequest(data[0].telephone);
            }
        },
        //根据用户电话修改用户信息。
        updateUserOperation() {
            UserService.request.lookMyInfoRequest();
        },
        lookLineOperation: function (obj) {
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

        showListRequest() {
            $.ajax({
                headers: {"X-Authentication-Token": globalService.tokenOfHeader},
                url: globalService.basePath + '/user/list',
                type: "get",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                success: function (res) {
                    if (res.code == 200) {
                        for (let user of res.data) {
                            user.gender = user.gender == 1 ? '男' : '女'
                        }
                        layui.table.render({
                            elem: '#demoId'//绑定元素
                            , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            , toolbar: '#toolbarDemo'
                            //            "id": 1,
                            //             "name": "王老师",
                            //             "gender": 1,
                            //             "age": 36,
                            //             "telephone": "123",
                            //             "password": "202CB962AC59075B964B07152D234B70"
                            , cols: [[
                                {type: 'checkbox', width: 70},
                                //{type:'radio'},
                                {field: 'id', width: 70, title: 'ID', show: false, sort: true}
                                , {field: 'name', width: 280, title: '姓名'}
                                , {field: 'gender', title: '性别'}
                                , {field: 'age', title: '年龄'}
                                , {field: 'telephone', title: '电话'}
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
        },
        showRight: function () {
            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/groupAndRole/user/group`,
                type: "get",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                success: function (result) {
                    if (result.ret) {
                        let html = `<form class="layui-form" style="margin-top: 32px;">`;
                        for (let row of result.data) {
                            console.log(row.groupId);
                            html +=
                                `<div class="layui-form-item" style="margin-top: 24px;">
                                <label class="layui-form-label">姓名</label>
                                <div class="layui-input-inline">
                                    <input type="text" required lay-verify="required" value="${row.username}" disabled
                                           autocomplete="off" class="layui-input">
                                </div>
                                <label class="layui-form-label">用户组</label>
                                <div class="layui-input-inline" style="width: 500px;">
                                  <input type="radio" userId="${row.userId}" lay-filter="group" name="group${row.userId}" value="1" title="教师" ${row.groupName === '教师' ? 'checked' : ''}>
                                  <input type="radio" userId="${row.userId}" lay-filter="group" name="group${row.userId}" value="2" title="系主任" ${row.groupName === '系主任' ? 'checked' : ''}>
                                  <input type="radio" userId="${row.userId}" lay-filter="group" name="group${row.userId}" value="3" title="管理员" ${row.groupName === '管理员' ? 'checked' : ''}>
                                </div>
                            </div>
                            <hr>
                            `
                        }
                        html += `</form>`
                        globalService.setSectionTagUI(html);
                        layui.use('form', function () {
                            var form = layui.form;
                            form.render();
                            form.on('radio(group)', function (data) {
                                let $radio = $(data.elem);
                                let groupId = $radio.val();
                                let userId = $radio.attr("userId");
                                UserService.changeGroup(userId, groupId);
                            });
                        })
                    } else {
                        layer.msg(result.msg)
                    }
                }
            });
        }
    },
    changeGroup: function (userId, groupId) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/groupAndRole/user/group/${userId}/${groupId}`,
            type: "put",
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            async: true,
            success: function (result) {
                if (result.ret) {
                    UserService.showRight()
                } else {
                    layer.msg(result.msg)
                }
            }
        });
    }
}