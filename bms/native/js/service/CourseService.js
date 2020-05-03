let CourseService = {
    courses: [],
    teachers: [],
    show: function (who) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/course/plan/${who}`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    CourseService.displayCoursePlan(res.data);
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
        globalService.setSectionTagUI(
            `
                <!--suppress HtmlUnknownAttribute -->
                <style>
                    #course {
                        background-image: url("native/img/course.png");
                        height: 886px;
                        width: 993px;
                    }
            
                    .course {
                        width: 170px;
                        height: 150px;
                        display: inline-block;
                        margin: 0 -2px;
                    }
            
                    .course-group {
                        display: block;
                    }
            
                    .course-groups {
                        display: block;
                        width: 100%;
                        padding-top: 62px;
                        padding-left: 144px;
                    }
            
                    .course-bar {
                        height: 30px;
                        width: 846px;
                    }
            
                    .course-item {
                         padding: 10px 20px;
                         height: 30px;
                         display: table;
                    }
                </style>
                <div id="course" style="display: inline-block;width: 993px;height: 886px;">
                    <div class="course-groups">
                        <div class="course-group" week="1">
                            <div class="course" section="1"></div>
                            <div class="course" section="2"></div>
                            <div class="course" section="3"></div>
                            <div class="course" section="4"></div>
                            <div class="course" section="5"></div>
                        </div>
                        <div class="course-group" week="2">
                            <div class="course" section="1"></div>
                            <div class="course" section="2"></div>
                            <div class="course" section="3"></div>
                            <div class="course" section="4"></div>
                            <div class="course" section="5"></div>
                        </div>
                        <div class="course-bar"></div>
                        <div class="course-group" week="3">
                            <div class="course" section="1"></div>
                            <div class="course" section="2"></div>
                            <div class="course" section="3"></div>
                            <div class="course" section="4"></div>
                            <div class="course" section="5"></div>
                        </div>
                        <div class="course-group" week="4">
                            <div class="course" section="1"></div>
                            <div class="course" section="2"></div>
                            <div class="course" section="3"></div>
                            <div class="course" section="4"></div>
                            <div class="course" section="5"></div>
                        </div>
                        <div class="course-bar"></div>
                        <div class="course-group" week="5">
                            <div class="course" section="1"></div>
                            <div class="course" section="2"></div>
                            <div class="course" section="3"></div>
                            <div class="course" section="4"></div>
                            <div class="course" section="5"></div>
                        </div>
                    </div>
                </div>
                ${who==='self'?'':'<div style="display: inline-block;height: 886px;width: 500px;"><table id="courseTable" class="layui-hide"></table></div>'}
            `);
        if (who!=='self') {
            $(".course").on('click', function () {
                let section = $(this).attr("section")
                let week = $(this).parent().attr("week");
                let html =
                    `<form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label">课程</label>
                        <div class="layui-input-inline">
                            <select name="courseId">
                                <option value="0">请选择课程</option>`;
                for (let row of CourseService.courses) {
                    if ((row.name.indexOf("input")) < 0) {
                        html += `            <option value="${row.id}">${row.name}</option>`
                    }
                }
                html += `        </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">授课教师</label>
                        <div class="layui-input-inline">
                            <select name="teacher">
                                <option value="0">请选择课程</option>`;
                for (let row of CourseService.teachers) {
                    html += `            <option value="${row.id}">${row.name}</option>`
                }
                html += `        </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">开始周</label>
                        <div class="layui-input-inline">
                          <input type="number" name="start" required value="4"  lay-verify="required" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">结束周</label>
                        <div class="layui-input-inline">
                          <input type="number" name="end" required value="17"  lay-verify="required" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </form>`;
                debugger
                layui.use('layer', function () {
                    const layer = layui.layer;
                    layer.open({
                        title: '请输入课程信息',
                        content: html,
                        area: ['440px', '350px'],
                        btn: ['保存', '清除'],
                        success: function () {
                            layui.use('form', function () {
                                const form = layui.form;
                                form.render()
                            });
                        },
                        yes: function () {
                            let $course = $("select[name='courseId']");
                            let courseId = parseInt($course.val());
                            let courseName = $course.find('option:selected').text();
                            let $teacher = $("select[name='teacher']");
                            let teacherId = parseInt($teacher.val());
                            let teacherName = $teacher.find('option:selected').text();
                            let start = parseInt($("input[name='start']").val());
                            let end = parseInt($("input[name='end']").val())
                            if (courseId === 0 || start || end || start > end) {
                                layer.msg('课程设置数据异常, 请重新设置')
                            }

                            $.ajax({
                                headers: {
                                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                                },
                                url: `${globalService.basePath}/course/plan`,
                                type: 'post',
                                contentType: 'application/json',
                                data: JSON.stringify({week, section, start, end, courseId, teacherId}),
                                success: function (res) {
                                    if (res.ret) {
                                        CourseService.displayCoursePlan({
                                            week,
                                            section,
                                            start,
                                            end,
                                            courseName,
                                            teacherName
                                        })
                                    } else {
                                        layui.use('layer', function () {
                                            layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                                                layer.closeAll();
                                            })
                                        });
                                    }
                                }
                            });
                            layer.closeAll()
                        },
                        btn2: function () {
                            CourseService.deleteCoursePlan({week, section})
                        }
                    })
                });
            })
        }
        // /user/list
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/user/list`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    CourseService.teachers = res.data;
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/course/list`,
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    CourseService.courses = res.data;
                    const data = CourseService.courses;
                    for (let row of data) {
                        row.operate = `<a style="color: red"  href="javascript:void(0)" onclick="CourseService.delete(${row.id})">删除</a>`
                    }
                    let json = JSON.stringify(data);
                    console.log(json)
                    data.push({
                        id: ``,
                        name: `<input type="text" name="name" placeholder="请输入课程名" autocomplete="off" class="layui-input">`,
                        operate: `<a style="color: red"  href="javascript:void(0)" onclick="CourseService.addCourse()">添加</a>`
                    })
                    layui.use('table', function () {
                        layui.table.render({
                            elem: '#courseTable'//绑定元素
                            , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                            , cols: [[
                                {field: 'id', hide: true, title: ''}
                                , {field: 'name', width: '80%', title: '课程名', sort: true}
                                , {field: 'operate', width: '20%', title: '操作'}
                            ]]
                            , height: 886
                            , skin: 'line' //表格风格
                            , even: true
                            , data: data
                        });
                    })
                }
            }
        });
    },
    upload: function () {
        $("#upload").click()
    },
    addCourse: function () {
        const data = CourseService.courses;
        let name = $('input[name="name"]').val();
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/course/course/${name}`,
            type: 'post',
            success: function (res) {
                if (res.ret) {
                    let newRow = data[data.length - 1];
                    data[data.length - 1] = {
                        id: res.data,
                        name,
                        operate: `<a style="color: red"  href="javascript:void(0)" onclick="CourseService.delete(${res.data})">删除</a>`
                    };
                    data.push(newRow);
                    $('input[name="name"]').val('');
                    layui.table.reload('courseTable', {
                        data: data
                    })
                } else {
                    layui.use('layer', function () {
                        layer.msg(res.msg, {icon: 5, time: 2000}, function () {
                            layer.closeAll();
                        })
                    });
                }
            }
        });
        console.log(name);
    }, delete: function (id) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/course/course/${id}`,
            type: 'delete',
            success: function (res) {
                if (res.ret) {
                    let data = CourseService.courses;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === id) {
                            data.splice(i, 1)
                        }
                    }
                    layui.table.reload('courseTable', {
                        data: data
                    })
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
    displayCoursePlan: function (data) {
        let arr = []
        if (!(data instanceof Array)) {
            arr.push(data)
        } else {
            arr = data
        }
        for (let row of arr) {
            let $div = $(`div[week="${row.week}"]`).find(`div[section="${row.section}"]`);
            $div.empty()
            const html = `<div class="course-item course-name">${row.courseName}</div>
                                        <div class="course-item start-end">从第${row.start}周到第${row.end}周</div>
                                        <div class="course-item teacher-name">${row.teacherName}</div>`
            $div.append($(html))
        }
    },
    deleteCoursePlan: function (data) {
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/course/plan`,
            type: 'delete',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (res) {
                if (res.ret) {
                    CourseService.show()
                }
            }
        });
    }
};