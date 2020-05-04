let QuestionnaireService = {
    questionnaire: {},
    show: function () {
        QuestionnaireService.questionnaire = {}
        globalService.setSectionTagUI(
            `<button id="newAchievement" style="margin-top: 32px;margin-left: 32px" onclick="QuestionnaireService.newQuestionnaire()" type="button" class="layui-btn">新增问卷</button>
            <table id="questionnaire" lay-filter="questionnaire" class="layui-hide"></table>
            `);

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
                <button id="next" onclick="QuestionnaireService.question()" type="button" style="margin: 64px" class="layui-btn">下一步</button>
            </form>`);
    }
};