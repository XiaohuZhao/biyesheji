let QuestionnaireService = {
    questionnaire: {
        title: "",
        endTime: "",
        questions: []
    },
    show: function () {
        QuestionnaireService.questionnaire = {}
        globalService.setSectionTagUI(
            `<button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="QuestionnaireService.newQuestionnaire()" type="button" class="layui-btn">新增问卷</button>
            <table id="questionnaire" lay-filter="questionnaire"></table>
            `);
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/questionnaire/`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    for (let row of res.data) {
                        let del = `<a style="color: red"  href="javascript:void(0)" onclick="QuestionnaireService.deleteOne(${row.id})">删除</a>`;
                        let look = `<a style="color: green"  href="javascript:void(0)" onclick="QuestionnaireService.look(${row.id},${row.expired})">已答列表</a>&nbsp;&nbsp;`;
                        let answer = `<a style="color: blue"  href="javascript:void(0)" onclick="QuestionnaireService.answer(${row.id})">填写</a>&nbsp;&nbsp;`;
                        row.operation = look
                        if (!row.expired) {
                            row.operation += answer
                        }
                        row.expired = row.expired ? '是' : '否'
                        let userRoles = localStorage.getItem('userRoles');
                        if (row.del || userRoles.includes("管理员")) {
                            row.operation += del
                        }
                    }
                    layui.use('table', function () {
                        layui.table.render({
                            elem: '#questionnaire'//绑定元素
                            , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            , cols: [[
                                {field: 'id', title: '', hide: true}
                                , {field: 'title', width: '15%', title: '标题'}
                                , {field: 'endTime', width: '10%', title: '截止日期', sort: true}
                                , {field: 'createTime', width: '15%', title: '创建时间', sort: true}
                                , {field: 'name', width: '10%', title: '创建人', sort: true}
                                , {field: 'expired', width: '10%', title: '是否过期', sort: true}
                                , {field: 'description', title: '描述'}
                                , {field: 'operation', width: '10%', title: '操作'}
                            ]]
                            , skin: 'line' //表格风格
                            , even: true
                            , data: res.data
                        });
                    });
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
    },
    newQuestionnaire() {
        globalService.setSectionTagUI(
            `<style>
                label.layui-form-label {
                    width: 90px;
                }
            
                .layui-laydate-content th {
                    font-weight: 400;
                    color: #fff;
                }
            </style>
            <form class="layui-form" style="margin-top: 32px;">
                <div class="layui-form-item">
                    <label class="layui-form-label">问卷题目</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">截止时间</label>
                    <div class="layui-input-inline">
                        <input name="endTime" type="text" class="layui-input" id="timeSelector">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">描述</label>
                    <div class="layui-input-inline">
                        <input type="text" name="description" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <button id="next" onclick="QuestionnaireService.question()" type="button" style="margin: 64px" class="layui-btn">下一步</button>
            </form>`);
        layui.use('form', function () {
            let form = layui.form;
            form.render();
        });
        layui.use('laydate', function () {
            const laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#timeSelector' //指定元素
                , format: 'yyyy-MM-dd'
            });
        });
    },
    question() {
        QuestionnaireService.questionnaire.title = $('input[name="title"]').val()
        QuestionnaireService.questionnaire.endTime = $('input[name="endTime"]').val()
        QuestionnaireService.questionnaire.description = $('input[name="description"]').val()
        if (QuestionnaireService.questionnaire.title.trim().length === 0) {
            layui.use('layer', function () {
                layer.msg('问卷标题不可为空', {icon: 5, time: 2000}, function () {
                    layer.closeAll();
                })
            });
            return
        }
        if (QuestionnaireService.questionnaire.endTime.trim().length === 0) {
            layui.use('layer', function () {
                layer.msg('结束时间不可为空', {icon: 5, time: 2000}, function () {
                    layer.closeAll();
                })
            });
            return
        }
        QuestionnaireService.questionnaire.questions = []
        globalService.setSectionTagUI(
            `<style>
                label.layui-form-label {
                    width: 90px;
                }
            
                .layui-laydate-content th {
                    font-weight: 400;
                    color: #fff;
                }
            </style>
            <form class="layui-form" id="questionnaire" style="margin-top: 32px;"></form>
            <hr>
            <button id="next" onclick="QuestionnaireService.addQuestion(1)" type="button" style="margin: 20px" class="layui-btn">添加单选题</button>
            <button id="next" onclick="QuestionnaireService.addQuestion(2)" type="button" style="margin: 20px" class="layui-btn">添加多选题</button>
            <button id="next" onclick="QuestionnaireService.addQuestion(3)" type="button" style="margin: 20px" class="layui-btn">添加填空题</button>
            <button id="next" onclick="QuestionnaireService.addQuestion(4)" type="button" style="margin: 20px" class="layui-btn">添加问答题</button>
            <button id="next" onclick="QuestionnaireService.submit()" type="button" style="margin: 20px" class="layui-btn">完成</button>
            `);
    },
    addQuestion(type) {
        let html = `<div class="layui-form-item" style="margin-top: 20px;">
                            <label class="layui-form-label">题目</label>
                            <div class="layui-input-inline">
                                <input type="text" style="width: 600px;" name="title" required lay-verify="required" autocomplete="off" class="layui-input">
                            </div>
                        </div>`
        let title
        switch (type) {
            case 1:
                title = '单选题';
            case 2:
                if (title !== '单选题') title = '多选题'
                html += `<button id="next" onclick="QuestionnaireService.addChoice()" type="button" style="margin-left: 20px;margin-bottom: 10px;" class="layui-btn">添加选项</button><div id="choices"></div>`
                break
            case 3:
                title = '填空题'
                break
            case 4:
                title = '问答题'
        }
        layer.open({
            title,
            content: html,
            area: ['840px', '350px'],
            btn: ['确定'],
            yes: function () {
                let title = $("input[name='title']").val();
                let choices = []
                if (type < 3) {
                    $(".choice").each((index, o) => {
                        choices.push(o.value)
                    })
                }
                QuestionnaireService.questionnaire.questions.push({title, type, choices})
                let str = `<div style="margin-bottom: 20px"><span style="margin-left: 20px;">${QuestionnaireService.questionnaire.questions.length}、 ${title}</span>`;
                if (choices.length > 0) {
                    for (let index in choices) {
                        str += `<span style="margin-left: 20px;">${String.fromCodePoint(65 + Number(index))}:${choices[index]}</span>`
                    }
                }
                str += `</div>`
                $("#questionnaire").append(str)

                console.log(title, choices)
                layer.closeAll()
            }
        })
    },
    addChoice() {
        let length = $("input.layui-input.choice").length;
        $("#choices").append(`<input type="text" style="width: 190px;display: inline;margin: 2px 5px;" name="choice" placeholder="选项${String.fromCodePoint(65 + length)}" required lay-verify="required" autocomplete="off" class="layui-input choice">`)
    },
    submit() {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/questionnaire/`,
            type: 'post',
            data: JSON.stringify(QuestionnaireService.questionnaire),
            contentType: "application/json",
            success: function (res) {
                if (res.ret) {
                    QuestionnaireService.show()
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
    },
    deleteOne(id) {
        let confirm = layer.confirm('确认删除？删除后无法恢复。', {
            btn: ['确认', '取消']
        }, function () {
            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/questionnaire/${id}`,
                type: 'delete',
                success: function (res) {
                    if (res.ret) {
                        QuestionnaireService.show()
                    } else {
                        layui.use('layer', function () {
                            layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                                layer.closeAll();
                            })
                        });
                    }
                }
            });

            layer.close(confirm)
        }, function (index) {

        });

    },
    look(id, expired) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/questionnaire/answers/${id}`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    globalService.setSectionTagUI(`
                        <button id="newAchievement" style="margin-top: 32px;margin-left: 32px;display:  ${expired ? 'none' : 'block'}" onclick="QuestionnaireService.answer(${res.data[0].id})" type="button" class="layui-btn">回答问卷</button>
                        <table id="questionnaire" lay-filter="questionnaire"></table>
                    `);
                    for (let row of res.data) {
                        row.operation = `<a style="color: green"  href="javascript:void(0)" onclick="QuestionnaireService.lookAnswer(${row.id},${row.userId})">查看</a>&nbsp;&nbsp;`
                    }
                    layui.use('table', function () {
                        layui.table.render({
                            elem: '#questionnaire'//绑定元素
                            , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            , cols: [[
                                {field: 'id', hide: true}
                                , {field: 'title', title: '标题'}
                                , {field: 'name', title: '回答人', sort: true}
                                , {field: 'userId', hide: true}
                                , {field: 'createTime', title: '回答时间', sort: true}
                                , {field: 'operation', width: '10%', title: '操作'}
                            ]]
                            , skin: 'line' //表格风格
                            , even: true
                            , data: res.data.filter(row => row.userId)
                        });
                    });
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
    },
    display: function (res, id) {
        globalService.setSectionTagUI(`
                        <style>
                            label.layui-form-label {
                                width: 90px;
                            }
                        
                            .layui-laydate-content th {
                                font-weight: 400;
                                color: #fff;
                            }
                            
                            .title{
                                margin-bottom: 20px;
                                margin-right: 40px;
                                display: inline;
                            }
                            
                            .question{
                                margin-top: 20px;
                                margin-bottom: 10px;
                                margin-right: 40px;
                            }
                            
                            .choice{
                                margin-right: 40px;
                                width: 200px;
                                display: inline-block;
                            }
                        </style>
                        <form class="layui-form" id="questionnaire" style="margin: 32px;"></form>
                    `);
        let $form = $("#questionnaire");
        $form.append(`<h1 class="title">问卷标题：${res.data.title}</h1>`)
        $form.append(`<h3 class="title">创建时间：${res.data.createTime}</h3>`)
        $form.append(`<h3 class="title">截止时间：${res.data.endTime}</h3>`)
        $form.append(`<h3 class="title">创建人：${res.data.name}</h3><hr>`)
        let questions = res.data.questions;

        for (let index in questions) {
            let question = questions[index];
            let html = `<div class="questions" type="${question.type}" qid="${question.id}">`
            html += `<h1 class="question">${(Number(index) + 1)}、${question.title}</h1>`;
            if (question.type === 1) {
                let choices = question.choices;
                for (let index in choices) {
                    html += `<div class="choice"><input name="${question.id}" type="radio" lay-skin="primary" title="${choices[index]}"/></div>`
                }
            } else if (question.type === 2) {
                let choices = question.choices;
                for (let index in choices) {
                    html += `<div class="choice"><input name="${question.id}" type="checkbox" lay-skin="primary" title="${choices[index]}"/></div>`
                }
            } else if (question.type === 3) {
                html += `<input type="text" name="${question.id}" required lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">`
            } else if (question.type === 4) {
                html += `<textarea name="${question.id}" required lay-verify="required" placeholder="请输入" class="layui-textarea"></textarea>`
            }
            html += `</div>`
            console.log(html);
            $form.append(html)
        }
        $form.append(`<button onclick="QuestionnaireService.submitAnswer(${id})" type="button" style="margin-top: 20px;margin-bottom: 10px;" class="layui-btn">提交</button>`)
        layui.use('form', function () {
            const form = layui.form;
            form.render()
        });
    },
    answer(id) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/questionnaire/${id}`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    if (res.code === 201) {
                        layui.use('layer', function () {
                            // layer.open(res.msg, {
                            //     btn: ['返回到问卷列表', '查看回答列表', '查看我的回答', '知道了'] //按钮
                            // }, function () {
                            //     QuestionnaireService.show()
                            //     console.log('查看问卷列表')
                            //     layer.closeAll();
                            // }, function () {
                            //     QuestionnaireService.look(id, false)
                            //     console.log('查看回答列表')
                            //     layer.closeAll();
                            // }, function () {
                            //     QuestionnaireService.lookAnswer(id, 'my')
                            //     console.log('查看我的回答')
                            //     layer.closeAll();
                            // }, function () {
                            //     QuestionnaireService.display(res, id);
                            //     console.log('知道了')
                            //     layer.closeAll();
                            // });
                            let layer = layui.layer
                            layer.open({
                                title: res.msg,
                                content: '你要怎么做？',
                                area: ['600', '350'],
                                btn: ['返回到问卷列表', '查看回答列表', '查看我的回答', '知道了'], //按钮
                                shadeClose: true,
                                btn1: function () {
                                    QuestionnaireService.show()
                                    console.log('查看问卷列表')
                                    layer.closeAll();
                                },
                                btn2: function () {
                                    QuestionnaireService.look(id, false)
                                    console.log('查看回答列表')
                                    layer.closeAll();
                                },
                                btn3: function () {
                                    QuestionnaireService.lookAnswer(id, 'my')
                                    console.log('查看我的回答')
                                    layer.closeAll();
                                },
                                btn4: function () {
                                    QuestionnaireService.display(res, id);
                                    console.log('知道了')
                                    layer.closeAll();
                                }
                            });
                        });
                    } else {
                        QuestionnaireService.display(res, id);
                    }
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
    },
    submitAnswer(id) {
        let questionsAnswers = []
        $(".questions").each((index, html) => {
            let type = $(html).attr("type");
            let qid = $(html).attr("qid");
            let value;
            if (type == 1) {
                value = $(html).find(`input[name='${qid}']:radio:checked`).attr("title");
            } else if (type == 2) {
                let choices = [];
                $(html).find(`input[name='${qid}']:checkbox:checked`).each((index, html) => choices.push($(html).attr("title")));
                value = choices.join("|");
            } else if (type == 3) {
                value = $(html).find(`input[name='${qid}']`).val();
            } else if (type == 4) {
                value = $(html).find(`textarea[name='${qid}']`).val();
            }
            if (value === undefined || value === null || value === '') {
                layui.use('layer', function () {
                    layer.msg('请填写所有的选项', {icon: 5, time: 2000}, function () {
                        layer.closeAll();
                    })
                });
                throw '请填写所有的选项'
            }
            questionsAnswers.push({qid, value})
        })
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/questionnaire/answer`,
            type: 'post',
            data: JSON.stringify(questionsAnswers),
            contentType: "application/json",
            success: function (res) {
                if (res.ret) {
                    QuestionnaireService.look(id, false)
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
    },
    lookAnswer(qid, userId) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/questionnaire/answers/${qid}/${userId}`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    globalService.setSectionTagUI(`
                        <button onclick="QuestionnaireService.look(${qid})" type="button" style="margin-top: 32px;margin-left: 32px;" class="layui-btn">上一步</button>
                        <style>
                            label.layui-form-label {
                                width: 90px;
                            }
                        
                            .layui-laydate-content th {
                                font-weight: 400;
                                color: #fff;
                            }
                            
                            .title{
                                margin-bottom: 10px;
                                margin-right: 40px;
                                display: inline;
                            }
                            
                            .question{
                                margin-top: 10px;
                                margin-bottom: 20px;
                                margin-left: 40px;
                            }
                        </style>
                        <form class="layui-form" id="questionnaire" style="margin: 32px;"></form>
                    `);
                    let $form = $("#questionnaire");
                    $form.append(`<h1 class="title">问卷标题：${res.data.title}</h1>`)
                    $form.append(`<h3 class="title">回答时间：${res.data.createTime}</h3>`)
                    $form.append(`<h3 class="title">回答人：${res.data.name}</h3><hr>`)
                    let questions = res.data.answers;
                    for (let index in questions) {
                        let question = questions[index];
                        let html = `<div class="questions" type="${question.type}" qid="${question.id}">`
                        html += `<h1 class="title">${(Number(index) + 1)}、${question.title}</h1>`;
                        html += `<div class="question">${question.answer}</div>`
                        html += `</div>`
                        $form.append(html)
                    }
                    layui.use('form', function () {
                        const form = layui.form;
                        form.render()
                    });
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
    }
};