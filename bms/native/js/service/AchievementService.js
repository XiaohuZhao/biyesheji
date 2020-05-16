let AchievementService = {
    showList: function (who, search = '') {
        globalService.setSectionTagUI(`${who === 'self' ? '<button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="AchievementService.addPaper()" type="button" class="layui-btn">新增论文</button>\n            <button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="AchievementService.addBook()" type="button" class="layui-btn">新增著作</button>\n            <button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="AchievementService.addProject()" type="button" class="layui-btn">新增项目结题</button>\n            <button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="AchievementService.addAwards()" type="button" class="layui-btn">新增获奖</button>' : ''}
            <style>
                .select-search-label{
                    width: 200px;
                }
                .select-search{
                    margin: 10px 30px;
                }
            </style>
            <br>
            <div class="select-search"> 
                <label class="select-search-label">类型：</label>
                <div id="select-type" style="display: inline-block"></div>
            </div>
            <div class="select-search">
                <label class="select-search-label">时间：</label>
                <div id="select-date" style="display: inline-block"></div>
            </div>
            <table id="demoId" class="layui-hide" lay-filter="achievement"></table>
        `);
        $.ajax({
            headers: {
                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
            },
            url: `${globalService.basePath}/achievement/${who}?search=${search}`,
            type: "get",
            contentType: "application/json",
            dataType: 'json',
            success: function (res) {
                let types = res.data.types;
                let $type = $("#select-type");
                $type.append(`<div onclick="AchievementService.showList('${who}')" style="text-decoration:underline;margin-left: 10px;display: inline-block;">全部(${types.map(o => o.amount).reduce((a, b) => a + b)})</div>`)
                for (let type of types) {
                    $type.append(`<div onclick="AchievementService.showList('${who}','${type.type}')" style="text-decoration:underline;margin-left: 10px;display: inline-block;">${type.type}(${type.amount})</div>`)
                }
                let dates = res.data.dates;
                let $date = $("#select-date");
                $date.append(`<div onclick="AchievementService.showList('${who}')" style="text-decoration:underline;margin-left: 10px;display: inline-block;">全部(${dates.map(o => o.amount).reduce((a, b) => a + b)})</div>`)
                for (let date of dates) {
                    $date.append(`<div onclick="AchievementService.showList('${who}','${date.date}')" style="text-decoration:underline;margin-left: 10px;display: inline-block;">${date.date}(${date.amount})</div>`)
                }

                layui.use('table', function () {
                    for (let row of res.data.achievements) {
                        row.status = row.status !== 0 ? "已审核" : "未审核";
                        row.operate = `<a style="color: red"  href="javascript:void(0)" onclick="AchievementService.deleteOne(${row.id})">删除</a>`
                    }
                    layui.table.render({
                        elem: '#demoId'//绑定元素
                        , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        , cols: [[
                            {field: 'title', width: '10%', title: '标题', sort: true}
                            , {field: 'firstAuthor', width: '8%', title: '第一作者'}
                            , {field: 'department', width: '10%', title: '所属部门'}
                            , {field: 'subject', width: '10%', title: '一级学科'}
                            , {field: 'publishTime', width: '10%', title: '发布日期', sort: true}
                            , {field: 'categories', width: '10%', title: '学课门类'}
                            , {field: 'status', width: '8%', title: '审核状态'}
                            , {field: 'reviewTime', width: '10%', title: '审核时间'}
                            , {field: 'type', width: '8%', title: '类型'}
                            , {field: 'comment', width: '8%', title: '审核意见'}
                            , {field: 'operate', width: '8%', title: '操作'}
                        ]]
                        , skin: 'line' //表格风格
                        , even: true
                        , data: res.data.achievements
                    });
                    //行内监听事件 ,点击行，出章节。
                    layui.table.on('rowDouble(achievement)', function (obj) {
                        // 清除数据
                        globalService.setSectionTagUI(`<table id="demoId" class="layui-hide"></table>`);
                        let id = obj.data.id;
                        $.ajax({
                            headers: {
                                "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                            },
                            // url: basePath + '/achievement/',
                            url: `${globalService.basePath}/achievement/${id}`,
                            type: "get",
                            contentType: "application/json",
                            dataType: 'json',
                            cache: false,
                            async: true,
                            success: function (res) {
                                let data = res.data;
                                console.log(data);
                                if (data.type === '论文') {
                                    AchievementService.showPaper(data)
                                } else if (data.type === '著作') {
                                    AchievementService.showBook(data)
                                } else if (data.type === '项目结题') {
                                    AchievementService.showProject(data)
                                } else if (data.type === '获奖') {
                                    AchievementService.showAwards(data)
                                }
                            }
                        })
                    });
                });
            },
            error: function () {
                alert("请求失败！");
            }
        });
    },
    addPaper: function () {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">论文题目</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label">第一作者</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <select name="department" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机学院">计算机学院</option>
                            <option value="软件学院">软件学院</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">学校署名</label>
                    <div class="layui-input-inline">
                        <select name="college" lay-verify="required">
                            <option value="一级单位">一级单位</option>
                            <option value="非一级单位">非一级单位</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">一级学科</label>
                    <div class="layui-input-inline">
                        <select name="subject" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机科学技术">计算机科学技术</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <select name="categories" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="社科类">社科类</option>
                            <option value="教育类">教育类</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">刊物类型</label>
                    <div class="layui-input-inline">
                        <select name="publishType" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="中文普通期刊">中文普通期刊</option>
                            <option value="CSSCI">CSSCI</option>
                            <option value="外文期刊">外文期刊</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label" style="width: 90px">发表/出版时间</label>
                    <div class="layui-input-inline">
                        <input name="publishTime" type="text" class="layui-input" id="timeSelector">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">发表范围</label>
                    <div class="layui-input-inline">
                        <select name="publishScope" lay-verify="required">
                            <option value="国内公开发行">国内公开发行</option>
                            <option value="国外公开发行">国外公开发行</option>
                            <option value="国内外公开发行">国内外公开发行</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">字数(万)</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">CN/ISSN号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               class="layui-input">
                    </div>
                    <label class="layui-form-label">是否为译文</label>
                    <div class="layui-input-inline">
                        <input type="radio" name="translation" value="1" title="是">
                        <input type="radio" name="translation" value="0" title="否" checked>
                    </div>
                </div>
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>所属单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                        <th style="width: 70px">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input type="number" name="seq" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="text" name="authorName" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <select name="gender" lay-verify="required">
                                <option value="0">其他</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" name="department" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="number" name="contribution" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <a href="javascript:void(0)" onclick="AchievementService.addAuthor(this)">新增</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div class="layui-input-inline">
                    <button type="button" class="layui-btn" id="fileUpload" style="margin-top: -15px;">
                        <i class="layui-icon">&#xe67c;</i>上传图片
                    </button>
                    <form enctype="multipart/form-data">
                        <input id="fileUploadInput" type="file" name="file" hidden>
                    </form>
                </div>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <button id="submit" type="button" style="margin: 64px" class="layui-btn">提交</button>
            </form>`
        );
        AchievementService.init();
        $("#submit").click(function (type, o, a) {
            console.log(type)
            console.log(o)
            console.log(a)
            let data = {
                title: $("input[name='title']").val(),
                firstAuthor: $("input[name='firstAuthor']").val(),
                department: $("select[name='department']").val(),
                college: $("select[name='college']").val(),
                subject: $("select[name='subject']").val(),
                categories: $("select[name='categories']").val(),
                publishType: $("select[name='publishType']").val(),
                publishTime: $("input[name='publishTime']").val(),
                publishScope: $("select[name='publishScope']").val(),
                wordCount: $("input[name='wordCount']").val(),
                cnIssn: $("input[name='cnIssn']").val(),
                translation: ($("input[name='translation']:checked").val() === "1"),
                authors: AchievementService.authors,
                attachments: AchievementService.attachments,
                type: "论文"
            };
            console.log(data);
            if (data.title.length === 0 || data.firstAuthor.length === 0 || data.publishTime.length === 0 || data.wordCount.length === 0 || data.cnIssn.length === 0) {
                layer.msg('请完善所有的字段', {icon: 5});
                return
            }
            if (data.authors.length === 0) {
                layer.msg('请添加作者信息', {icon: 5});
                return
            }

            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/achievement`,
                type: "post",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                data: JSON.stringify(data),
                success: function (data) {
                    AchievementService.showList('self')
                }
            })
        });
        this.authors = [];
        this.attachments = [];
    },
    addBook: function () {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">著作名称</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label">第一作者</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <select name="department" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机学院">计算机学院</option>
                            <option value="软件学院">软件学院</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">学校署名</label>
                    <div class="layui-input-inline">
                        <select name="college" lay-verify="required">
                            <option value="一级单位">一级单位</option>
                            <option value="非一级单位">非一级单位</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">一级学科</label>
                    <div class="layui-input-inline">
                        <select name="subject" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机科学技术">计算机科学技术</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <select name="categories" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="社科类">社科类</option>
                            <option value="教育类">教育类</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">著作类别</label>
                    <div class="layui-input-inline">
                        <select name="publishType" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="专著">专著</option>
                            <option value="编著">编著</option>
                            <option value="译著">译著</option>
                        </select>
                    </div>
                    <label class="layui-form-label">出版地</label>
                    <div class="layui-input-inline">
                        <select name="publishArea" lay-verify="required">
                            <option value="国内">国内</option>
                            <option value="国外">国外</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">出版单位</label>
                    <div class="layui-input-inline">
                        <select name="publishScope" lay-verify="required">
                            <option value="国内公开发行">国内公开发行</option>
                            <option value="国外公开发行">国外公开发行</option>
                            <option value="国内外公开发行">国内外公开发行</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">出版时间</label>
                    <div class="layui-input-inline">
                        <input name="publishTime" type="text" class="layui-input" id="timeSelector">
                    </div>
                    <label class="layui-form-label">字数(万)</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">是否为译文</label>
                    <div class="layui-input-inline">
                        <input type="radio" name="translation" value="1" title="是">
                        <input type="radio" name="translation" value="0" title="否" checked>
                    </div>
                    <label class="layui-form-label">语种</label>
                    <div class="layui-input-inline">
                        <select name="publishScope" lay-verify="required">
                            <option value="国内公开发行">国内公开发行</option>
                            <option value="国外公开发行">国外公开发行</option>
                            <option value="国内外公开发行">国内外公开发行</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">CTP号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               class="layui-input">
                    </div>
                    <label class="layui-form-label">ISBN号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="isbn" required lay-verify="required" autocomplete="off"
                               class="layui-input">
                    </div>
                </div>
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>所属单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                        <th style="width: 70px">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input type="number" name="seq" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="text" name="authorName" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <select name="gender" lay-verify="required">
                                <option value="0">其他</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" name="department" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="number" name="contribution" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <a href="javascript:void(0)" onclick="AchievementService.addAuthor(this)">新增</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div class="layui-input-inline">
                    <button type="button" class="layui-btn" id="fileUpload" style="margin-top: -15px;">
                        <i class="layui-icon">&#xe67c;</i>上传图片
                    </button>
                    <form enctype="multipart/form-data">
                        <input id="fileUploadInput" type="file" name="file" hidden>
                    </form>
                </div>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <button id="submit" type="button" style="margin: 64px" class="layui-btn">提交</button>
            </form>`
        );
        AchievementService.init();
        $("#submit").click(function (type, o, a) {
            console.log(type)
            console.log(o)
            console.log(a)
            let data = {
                title: $("input[name='title']").val(),
                firstAuthor: $("input[name='firstAuthor']").val(),
                department: $("select[name='department']").val(),
                college: $("select[name='college']").val(),
                subject: $("select[name='subject']").val(),
                categories: $("select[name='categories']").val(),
                publishType: $("select[name='publishType']").val(),
                publishArea: $("select[name='publishArea']").val(),
                publishTime: $("input[name='publishTime']").val(),
                publishScope: $("select[name='publishScope']").val(),
                wordCount: $("input[name='wordCount']").val(),
                cnIssn: $("input[name='cnIssn']").val(),
                isbn: $("input[name='isbn']").val(),
                translation: ($("input[name='translation']:checked").val() === "1"),
                authors: AchievementService.authors,
                attachments: AchievementService.attachments,
                type: "著作"
            };
            console.log(data);
            if (data.title.length === 0 || data.firstAuthor.length === 0 || data.publishTime.length === 0 || data.wordCount.length === 0 || data.cnIssn.length === 0) {
                layer.msg('请完善所有的字段', {icon: 5});
                return
            }
            if (data.authors.length === 0) {
                layer.msg('请添加作者信息', {icon: 5});
                return
            }

            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/achievement`,
                type: "post",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                data: JSON.stringify(data),
                success: function (data) {
                    AchievementService.showList('self')
                }
            })
        });
        this.authors = [];
        this.attachments = [];
    },
    addProject: function () {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">项目编号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="number" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">项目结题题目</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label">第一作者</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <select name="department" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机学院">计算机学院</option>
                            <option value="软件学院">软件学院</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">学校署名</label>
                    <div class="layui-input-inline">
                        <select name="college" lay-verify="required">
                            <option value="一级单位">一级单位</option>
                            <option value="非一级单位">非一级单位</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <select name="categories" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="社科类">社科类</option>
                            <option value="教育类">教育类</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">结题单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="publishScope" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                    <label class="layui-form-label">项目来源</label>
                    <div class="layui-input-inline">
                        <input type="text" name="publishArea" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">结题评价</label>
                    <div class="layui-input-inline">
                        <select name="result" lay-verify="required">
                            <option value="合格">合格</option>
                            <option value="不合格">不合格</option>
                        </select>
                    </div>
                    <label class="layui-form-label">项目经费(万)</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" class="layui-input">
                    </div>
                </div>
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>工作单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                        <th style="width: 70px">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input type="number" name="seq" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="text" name="authorName" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <select name="gender" lay-verify="required">
                                <option value="0">其他</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" name="department" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="number" name="contribution" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <a href="javascript:void(0)" onclick="AchievementService.addAuthor(this)">新增</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div class="layui-input-inline">
                    <button type="button" class="layui-btn" id="fileUpload" style="margin-top: -15px;">
                        <i class="layui-icon">&#xe67c;</i>上传图片
                    </button>
                    <form enctype="multipart/form-data">
                        <input id="fileUploadInput" type="file" name="file" hidden>
                    </form>
                </div>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <button id="submit" type="button" style="margin: 64px" class="layui-btn">提交</button>
            </form>`
        );
        AchievementService.init();
        $("#submit").click(function (type, o, a) {
            console.log(type)
            console.log(o)
            console.log(a)
            let data = {
                number: $("input[name='number']").val(),
                title: $("input[name='title']").val(),
                firstAuthor: $("input[name='firstAuthor']").val(),
                department: $("select[name='department']").val(),
                college: $("select[name='college']").val(),
                categories: $("select[name='categories']").val(),
                publishScope: $("input[name='publishScope']").val(),
                publishArea: $("input[name='publishArea']").val(),
                result: $("select[name='result']").val(),
                wordCount: $("input[name='wordCount']").val(),
                authors: AchievementService.authors,
                attachments: AchievementService.attachments,
                type: "项目结题"
            };
            console.log(data);
            if (data.number.length === 0 || data.title.length === 0 || data.firstAuthor.length === 0 || data.publishScope.length === 0 || data.publishArea.length === 0 || data.wordCount.length === 0) {
                layer.msg('请完善所有的字段', {icon: 5});
                return
            }
            if (data.authors.length === 0) {
                layer.msg('请添加作者信息', {icon: 5});
                return
            }

            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/achievement`,
                type: "post",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                data: JSON.stringify(data),
                success: function (data) {
                    AchievementService.showList('self')
                }
            })
        });
        this.authors = [];
        this.attachments = [];
    },
    addAwards: function () {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>

                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">获奖名称</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">获奖题目</label>
                    <div class="layui-input-inline">
                        <input type="text" name="number" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                    <label class="layui-form-label">第一完成人</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <select name="department" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机学院">计算机学院</option>
                            <option value="软件学院">软件学院</option>
                        </select>
                    </div>
            
                    <label class="layui-form-label">发证机关</label>
                    <div class="layui-input-inline">
                        <input type="text" name="college" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">一级学科</label>
                    <div class="layui-input-inline">
                        <select name="subject" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="计算机科学技术">计算机科学技术</option>
                        </select>
                    </div>
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <select name="categories" lay-verify="required">
                            <option value="其他">其他</option>
                            <option value="社科类">社科类</option>
                            <option value="教育类">教育类</option>
                        </select>
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">获奖人数</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="1" class="layui-input">
                    </div>
                    <label class="layui-form-label">获奖级别</label>
                    <div class="layui-input-inline">
                        <select name="publishType" lay-verify="required">
                            <option value="国家级">国家级</option>
                            <option value="省部级">省部级</option>
                            <option value="地市级">地市级</option>
                        </select>
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">出版时间</label>
                    <div class="layui-input-inline">
                        <input name="publishTime" type="text" class="layui-input" id="timeSelector">
                    </div>
                    <label class="layui-form-label">获奖等级</label>
                    <div class="layui-input-inline">
                        <input type="text" name="publishScope" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">完成单位</label>
                    <div class="layui-input-inline">
                        <input type="text" value="中原工学院" disabled required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                    <label class="layui-form-label">获奖类别</label>
                    <div class="layui-input-inline">
                        <input type="text" name="publishArea" required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>工作单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                        <th style="width: 70px">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input type="number" name="seq" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="text" name="authorName" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <select name="gender" lay-verify="required">
                                <option value="0">其他</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" name="department" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <input type="number" name="contribution" required lay-verify="required" autocomplete="off"
                                   class="layui-input">
                        </td>
                        <td>
                            <a href="javascript:void(0)" onclick="AchievementService.addAuthor(this)">新增</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div class="layui-input-inline">
                    <button type="button" class="layui-btn" id="fileUpload" style="margin-top: -15px;">
                        <i class="layui-icon">&#xe67c;</i>上传图片
                    </button>
                    <form enctype="multipart/form-data">
                        <input id="fileUploadInput" type="file" name="file" hidden>
                    </form>
                </div>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <button id="submit" type="button" style="margin: 64px" class="layui-btn">提交</button>
            </form>`
        );
        AchievementService.init();
        $("#submit").click(function (type) {
            console.log(type)
            let data = {
                number: $("input[name='number']").val(),
                title: $("input[name='title']").val(),
                firstAuthor: $("input[name='firstAuthor']").val(),
                department: $("select[name='department']").val(),
                college: $("input[name='college']").val(),
                subject: $("select[name='subject']").val(),
                categories: $("select[name='categories']").val(),
                wordCount: $("input[name='wordCount']").val(),
                publishType: $("select[name='publishType']").val(),
                publishTime: $("input[name='publishTime']").val(),
                publishScope: $("input[name='publishScope']").val(),
                publishArea: $("input[name='publishArea']").val(),
                authors: AchievementService.authors,
                attachments: AchievementService.attachments,
                type: "获奖"
            };
            console.log(data);
            if (data.number.length === 0 || data.title.length === 0 || data.firstAuthor.length === 0 || data.college.length === 0 || data.publishTime.length === 0 || data.publishScope.length === 0 || data.publishArea.length === 0 || data.wordCount.length === 0) {
                layer.msg('请完善所有的字段', {icon: 5});
                return
            }
            if (data.authors.length === 0) {
                layer.msg('请添加作者信息', {icon: 5});
                return
            }

            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/achievement`,
                type: "post",
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                async: true,
                data: JSON.stringify(data),
                success: function (data) {
                    AchievementService.showList('self')
                }
            })
        });
        this.authors = [];
        this.attachments = [];
    },
    deleteOne: function (id) {
        let confirm = layer.confirm('确认删除？删除后无法恢复。', {
            btn: ['确认', '取消']
        }, function () {
            $.ajax({
                headers: {
                    "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                },
                url: `${globalService.basePath}/achievement/${id}`,
                type: "delete",
                success: function (result) {
                    if (result.ret) {
                        AchievementService.showList('self')
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
    removeAuthor: function (obj) {
        let $tr = $(obj).parent().parent();
        let $tds = $tr.children("td");
        let seq = $tds.eq(0).text().replace(/ +/g, "").trim();
        console.log(seq);
        console.log(this.authors);
        for (let i = 0; i < this.authors.length; i++) {
            if (this.authors[i].seq === seq) {
                this.authors.splice(i, 1)
            }
        }
        console.log(this.authors);
        $tr.remove();
    },
    addAuthor: function (obj) {
        let $tr = $(obj).parent().parent();
        let $tds = $tr.children("td");
        let seq = $tds.eq(0).find('input[name="seq"]').val();
        console.log(seq);
        if (seq == null || seq === '') {
            layer.msg('署名顺序不可为空', {icon: 5});
            return
        }
        let authorName = $tds.eq(1).find('input[name="authorName"]').val();
        let genderCode = $tds.eq(2).find('select[name="gender"]').val();
        let gender = $tds.eq(2).find('select[name="gender"]').find("option:selected").text();
        let department = $tds.eq(3).find('input[name="department"]').val();
        let contribution = $tds.eq(4).find('input[name="contribution"]').val();
        let row = {seq, authorName, gender: genderCode, department, contribution};
        for (let index in this.authors) {
            if (this.authors[index].seq === seq) {
                layer.msg('署名顺序不可相同', {icon: 5});
                return
            }
        }
        this.authors.push(row);
        console.log(this.authors)
        $tr.before($(`<tr>
                        <td>
                            ${seq}
                        </td>
                        <td>
                            ${authorName}
                        </td>
                        <td>
                            ${gender}
                        </td>
                        <td>
                            ${department}
                        </td>
                        <td>
                            ${contribution}
                        </td>
                        <td>
                            <a href="javascript:void(0)" onclick="AchievementService.removeAuthor(this)">移除</a>
                        </td>
                    </tr>`));
        $tds.eq(0).find('input[name="seq"]').val("");
        $tds.eq(1).find('input[name="authorName"]').val("");
        $tds.eq(2).find('select[name="gender"]').val("0");
        $tds.eq(3).find('input[name="department"]').val("");
        $tds.eq(4).find('input[name="contribution"]').val("");
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        })
    },
    showPaper: function (data) {
        console.log(data.status !== 1 && data.id !== null)
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">论文题目</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" value="${data.title}" disabled class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label">第一作者</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.firstAuthor}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.department}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">学校署名</label>
                    <div class="layui-input-inline">
                        <div class="layui-input-inline">
                            <input type="text" name="firstAuthor" required lay-verify="required"
                                   autocomplete="off" value="${data.college}" disabled class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">一级学科</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.subject}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <input type="text" name="categories" required lay-verify="required"
                               autocomplete="off" value="${data.categories}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">刊物类型</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishType}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label" style="width: 90px">发表/出版时间</label>
                    <div class="layui-input-inline">
                        <input name="publishTime" type="text" value="${data.publishTime}" disabled class="layui-input"
                               id="timeSelector">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">发表范围</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishScope}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">字数(万)</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" value="${data.wordCount}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">CN/ISSN号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               value="${data.cnIssn}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">是否为译文</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               value="${data.translation === 1 ? '是' : '否'}" disabled class="layui-input">
                    </div>
                </div>
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>所属单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                    </tr>
                    </thead>
                    <tbody id="authorList">
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">审核信息</label>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">审核状态</label>
                    <div class="layui-input-inline">
                        <input type="text" value="${data.status === 0 ? '未审核' : data.status === 1 ? '已通过' : '未通过'}" disabled
                               class="layui-input">
                    </div>
                    <span style="${data.status === 1 ? '' : 'display:none'}">
                        <label class="layui-form-label" style="width: 90px">审核日期</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.reviewTime}" disabled
                                   class="layui-input">
                        </div>
                        <label class="layui-form-label" style="width: 90px">审核意见</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.comment === null ? '' : data.comment}" disabled class="layui-input">
                        </div>
                    </span>
                    <div style="${data.status === 0 && data.id !== null ? '' : 'display:none'}">
                        <div class="layui-input-inline">
                            <button type="button" class="layui-btn" onclick="AchievementService.review(${data.id},1)">
                                <i class="layui-icon">&#xe605;</i>通过
                            </button>
                            <button type="button" class="layui-btn layui-btn-danger" onclick="AchievementService.review(${data.id},-1)">
                                <i class="layui-icon">&#x1006;</i>拒绝
                            </button>
                        </div>
                    </div>
                </div>
            </form>`
        );
        // 添加作者信息
        AchievementService.showAuthor(data);
        // 添加附件信息
        for (let attachment of data.attachments) {
            $("#fileList").append(`<li>${attachment.filename}</li>`);
        }
    },
    showBook: function (data) {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">著作名称</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" value="${data.title}" disabled class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label">第一作者</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.firstAuthor}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.department}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">学校署名</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.college}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">一级学科</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.subject}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.categories}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">著作类别</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishType}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">出版地</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishArea}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">出版单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishScope}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">出版时间</label>
                    <div class="layui-input-inline">
                        <input name="publishTime" type="text" value="${data.publishTime}" disabled class="layui-input"
                               id="timeSelector">
                    </div>
                    <label class="layui-form-label">字数(万)</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" value="${data.wordCount}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">是否为译文</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               value="${data.translation === 1 ? '是' : '否'}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">语种</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               value="${data.language}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">CTP号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               value="${data.cnIssn}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">ISBN号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="cnIssn" required lay-verify="required" autocomplete="off"
                               value="${data.isbn}" disabled class="layui-input">
                    </div>
                </div>
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>所属单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                    </tr>
                    </thead>
                    <tbody id="authorList">
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">审核信息</label>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">审核状态</label>
                    <div class="layui-input-inline">
                        <input type="text" value="${data.status === 0 ? '未审核' : data.status === 1 ? '已通过' : '未通过'}" disabled
                               class="layui-input">
                    </div>
                    <span style="${data.status === 1 ? '' : 'display:none'}">
                        <label class="layui-form-label" style="width: 90px">审核日期</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.reviewTime}" disabled
                                   class="layui-input">
                        </div>
                        <label class="layui-form-label" style="width: 90px">审核意见</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.comment === null ? '' : data.comment}" disabled class="layui-input">
                        </div>
                    </span>
                    <div style="${data.status === 0 && data.id !== null ? '' : 'display:none'}">
                        <div class="layui-input-inline">
                            <button type="button" class="layui-btn" onclick="AchievementService.review(${data.id},1)">
                                <i class="layui-icon">&#xe605;</i>通过
                            </button>
                            <button type="button" class="layui-btn layui-btn-danger" onclick="AchievementService.review(${data.id},-1)">
                                <i class="layui-icon">&#x1006;</i>拒绝
                            </button>
                        </div>
                    </div>
                </div>
            </form>`);
        // 添加作者信息
        AchievementService.showAuthor(data);
        // 添加附件信息
        for (let attachment of data.attachments) {
            $("#fileList").append(`<li>${attachment.filename}</li>`);
        }
    },
    showProject: function (data) {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">项目编号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" value="${data.number}" disabled class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">项目结题题目</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" value="${data.title}" disabled class="layui-input">
                    </div>
                </div>
            
                <div class="layui-form-item">
                    <label class="layui-form-label">第一作者</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.firstAuthor}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.department}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">学校署名</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.college}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.categories}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">结题单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishScope}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">项目来源</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishArea}" disabled class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">结题评价</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.result}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">项目经费(万)</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" value="${data.wordCount}" disabled class="layui-input">
                    </div>
                </div>
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>所属单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                    </tr>
                    </thead>
                    <tbody id="authorList">
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">审核信息</label>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">审核状态</label>
                    <div class="layui-input-inline">
                        <input type="text" value="${data.status === 0 ? '未审核' : data.status === 1 ? '已通过' : '未通过'}" disabled
                               class="layui-input">
                    </div>
                    <span style="${data.status === 1 ? '' : 'display:none'}">
                        <label class="layui-form-label" style="width: 90px">审核日期</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.reviewTime}" disabled
                                   class="layui-input">
                        </div>
                        <label class="layui-form-label" style="width: 90px">审核意见</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.comment === null ? '' : data.comment}" disabled class="layui-input">
                        </div>
                    </span>
                    <div style="${data.status === 0 && data.id !== null ? '' : 'display:none'}">
                        <div class="layui-input-inline">
                            <button type="button" class="layui-btn" onclick="AchievementService.review(${data.id},1)">
                                <i class="layui-icon">&#xe605;</i>通过
                            </button>
                            <button type="button" class="layui-btn layui-btn-danger" onclick="AchievementService.review(${data.id},-1)">
                                <i class="layui-icon">&#x1006;</i>拒绝
                            </button>
                        </div>
                    </div>
                </div>
            </form>`
        );
        // 添加作者信息
        AchievementService.showAuthor(data);
        // 添加附件信息
        for (let attachment of data.attachments) {
            $("#fileList").append(`<li>${attachment.filename}</li>`);
        }
    },
    showAwards: function (data) {
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
                <label style="margin: 50px;font-size: 32px;width: 300px">基本信息</label>

                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">获奖名称</label>
                    <div class="layui-input-inline">
                        <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" value="${data.title}" disabled class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item" style="margin-top: 24px;">
                    <label class="layui-form-label">获奖题目</label>
                    <div class="layui-input-inline">
                         <input type="text" name="title" required lay-verify="required"
                               autocomplete="off" value="${data.number}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">第一完成人</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.firstAuthor}" disabled class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.department}" disabled class="layui-input">
                    </div>
            
                    <label class="layui-form-label">发证机关</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                                   autocomplete="off" value="${data.college}" disabled class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">一级学科</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.subject}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">学课门类</label>
                    <div class="layui-input-inline">
                        <input type="text" name="categories" required lay-verify="required"
                               autocomplete="off" value="${data.categories}" disabled class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">获奖人数</label>
                    <div class="layui-input-inline">
                        <input type="number" name="wordCount" required lay-verify="required" autocomplete="off"
                               min="0.0001"
                               step="0.01" value="${data.wordCount}" disabled class="layui-input">
                    </div>
                    <label class="layui-form-label">获奖级别</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishType}" disabled class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">出版时间</label>
                    <div class="layui-input-inline">
                         <input name="publishTime" type="text" value="${data.publishTime}" disabled class="layui-input"
                               id="timeSelector">
                    </div>
                    <label class="layui-form-label">获奖等级</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishScope}" disabled class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item">
                    <label class="layui-form-label">完成单位</label>
                    <div class="layui-input-inline">
                        <input type="text" value="中原工学院" disabled required lay-verify="required"
                               autocomplete="off" class="layui-input">
                    </div>
                    <label class="layui-form-label">获奖类别</label>
                    <div class="layui-input-inline">
                        <input type="text" name="firstAuthor" required lay-verify="required"
                               autocomplete="off" value="${data.publishArea}" disabled class="layui-input">
                    </div>
                </div>
                
                <label style="margin: 50px;font-size: 32px;width: 300px">作者信息</label>
                <table class="layui-table" style="width: 50%" lay-filter="authors">
                    <thead>
                    <tr>
                        <th style="width: 70px">署名顺序</th>
                        <th>作者姓名</th>
                        <th style="width: 70px">性别</th>
                        <th>所属单位</th>
                        <th style="width: 70px">贡献率(%)</th>
                    </tr>
                    </thead>
                    <tbody id="authorList">
                    </tbody>
                </table>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">附件信息</label>
                <div style="margin: 20px">
                    <label style="font-size: 16px">已上传的附件:</label>
                    <ul id="fileList" style="margin: 10px">
                    </ul>
                </div>
                <label style="margin: 80px 50px 50px;font-size: 32px;width: 300px">审核信息</label>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 90px">审核状态</label>
                    <div class="layui-input-inline">
                        <input type="text" value="${data.status === 0 ? '未审核' : data.status === 1 ? '已通过' : '未通过'}" disabled
                               class="layui-input">
                    </div>
                    <span style="${data.status === 1 ? '' : 'display:none'}">
                        <label class="layui-form-label" style="width: 90px">审核日期</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.reviewTime}" disabled
                                   class="layui-input">
                        </div>
                        <label class="layui-form-label" style="width: 90px">审核意见</label>
                        <div class="layui-input-inline">
                            <input type="text" value="${data.comment === null ? '' : data.comment}" disabled class="layui-input">
                        </div>
                    </span>
                    <div style="${data.status === 0 && data.id !== null ? '' : 'display:none'}">
                        <div class="layui-input-inline">
                            <button type="button" class="layui-btn" onclick="AchievementService.review(${data.id},1)">
                                <i class="layui-icon">&#xe605;</i>通过
                            </button>
                            <button type="button" class="layui-btn layui-btn-danger" onclick="AchievementService.review(${data.id},-1)">
                                <i class="layui-icon">&#x1006;</i>拒绝
                            </button>
                        </div>
                    </div>
                </div>
            </form>`);
        // 添加作者信息
        AchievementService.showAuthor(data);
        // 添加附件信息
        for (let attachment of data.attachments) {
            $("#fileList").append(`<li>${attachment.filename}</li>`);
        }
    },
    init: function () {
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
        $("#fileUpload").click(function () {
            console.log("fileUpload");
            $("#fileUploadInput").click()
        });
        $('#fileUploadInput').on('change', function () {
            let files = $('#fileUploadInput')[0].files;
            console.log(files);
            const formData = new FormData();
            formData.append("file", files[0]);
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
                        console.log(res.data.filePath);
                        $("#fileList").append(`<li>${files[0].name}</li>`);
                        layer.msg("上传成功", {icon: 1, time: 2000}, function () {
                            layer.closeAll();
                            AchievementService.attachments.push({url: res.data.filePath, filename: files[0].name});
                        })
                    }
                }
            })
        });
    },
    showAuthor: function (data) {
        for (let author of data.authors) {
            $("#authorList").append(`<tr>
                                        <td>
                                            ${author.seq}
                                        </td>
                                        <td>
                                            ${author.authorName}
                                        </td>
                                        <td>
                                            ${author.gender === 1 ? '男' : author.gender === 2 ? '女' : '其他'}
                                        </td>
                                        <td>
                                            ${author.department}
                                        </td>
                                        <td>
                                            ${author.contribution}
                                        </td>
                                    </tr>`);
        }
    },
    authors: [],
    attachments: [],
    review: function (id, status) {
        // if (id) {
        let open = layer.open({
            title: '请输入审核意见'
            ,
            content: '<input type="text" id="comment" required lay-verify="required" autocomplete="off" class="layui-input">'
            ,
            btn: ['确认', '取消']
            ,
            yes: function () {
                let comment = $("#comment").val();
                console.log(status, comment);
                $.ajax({
                    headers: {
                        "X-Authentication-Token": globalService.tokenOfHeader//此处放置请求到的用户token
                    },
                    url: `${globalService.basePath}/achievement/${id}`,
                    type: "put",
                    contentType: "application/json",
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: JSON.stringify({comment, status}),
                    success: function (data) {
                        AchievementService.showList('list');
                    }
                });
                layer.close(open)
            }
        });
        // }
    }
};