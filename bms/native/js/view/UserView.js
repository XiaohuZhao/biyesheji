var UserView = {
    showUserList: "<table id=\"demoId\" class=\"layui-hide\" lay-filter=\"userTable\"></table>\n" +
        "            \n" +
        "            <script type=\"text/html\" id=\"toolbarDemo\">\n" +
        "\n" +
        "                <div class=\"layui-btn-group  ml-1 mt-2\">\n" +
        "                    <button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-sm\"  lay-event=\"addData\"><i class=\"layui-icon\"></i>\n" +
        "                    </button>\n" +
        "                    <button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-sm\"  lay-event=\"editData\"><i class=\"layui-icon\"></i>\n" +
        "                    </button>\n" +
        "                    <button type=\"button\" class=\"layui-btn layui-btn-primary layui-btn-sm\"  lay-event=\"deleteData\"><i class=\"layui-icon\"></i>\n" +
        "                    </button>\n" +
        "                </div>\n" +
        "            </script>",


    addUserView: "<div class=\"layui-form-item p-all-20\">\n" +
        "    <label class=\"layui-form-label\">姓名</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <input type=\"text\" name=\"name\" lay-verify=\"name\" autocomplete=\"off\" placeholder=\"请输入用户姓名\" class=\"layui-input name\">\n" +
        "    </div>\n" +
        "  </div>" +


        "  <div class=\"layui-form-item p-all-20\">\n" +
        "    <label class=\"layui-form-label\">密码</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <input type=\"text\" name=\"password\" lay-verify=\"password\" autocomplete=\"off\" placeholder=\"请输入用户姓名\" class=\"layui-input password\">\n" +
        "    </div>\n" +
        "  </div>" +

        "  <div class=\"layui-form-item p-all-20\">\n" +
        "    <label class=\"layui-form-label\">年龄</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <input type=\"text\" name=\"age\" lay-verify=\"number\" autocomplete=\"off\" placeholder=\"请输入用户年龄\" class=\"layui-input age\">\n" +
        "    </div>\n" +
        "  </div>" +

        "  <div class=\"layui-form-item p-all-20\">\n" +
        "    <label class=\"layui-form-label\">电话</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <input type=\"text\" name=\"newTelephone\" lay-verify=\"number\" autocomplete=\"off\" placeholder=\"请输入用户电话\" class=\"layui-input newTelephone\">\n" +
        "    </div>\n" +
        "  </div>" +

        "  <div class=\"layui-form-item p-all-20\">\n" +
        "    <label class=\"layui-form-label\">性别</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <input type=\"text\" name=\"gender\" lay-verify=\"text\" autocomplete=\"off\" placeholder=\"请输入用户性别\" class=\"layui-input gender\">\n" +
        "    </div>\n" +
        "  </div>" +


        "  <div class=\"layui-form-item  p-horizontal-direction-20\">\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <button onclick='UserService.request.addUserRequest()' type=\"submit\" class=\"layui-btn\" lay-submit=\"\" lay-filter=\"demo1\">立即提交</button>\n" +
        "    </div>\n" +
        "  </div>"

    , lookMyselfUserInfo: function () {
        return "<div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">姓名</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input  value='" + DataBinding.getValueFromSessionStorageByKey('name') + "' type=\"text\" name=\"name\" lay-verify=\"name\" autocomplete=\"off\" placeholder=\"请输入用户姓名\" class=\"layui-input name\">\n" +
            "    </div>\n" +
            "  </div>" +


            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">密码</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value=''  type=\"text\" name=\"password\" lay-verify=\"password\" autocomplete=\"off\" placeholder=\"如需更改请输入新的密码\" class=\"layui-input password\">\n" +
            "    </div>\n" +
            "  </div>" +

            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">年龄</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value='" + DataBinding.getValueFromSessionStorageByKey('age') + "'  type=\"text\" name=\"age\" lay-verify=\"number\" autocomplete=\"off\" placeholder=\"请输入用户年龄\" class=\"layui-input age\">\n" +
            "    </div>\n" +
            "  </div>" +

            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">电话</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value='" + DataBinding.getValueFromSessionStorageByKey('telephone') + "'  type=\"text\" name=\"newTelephone\" lay-verify=\"number\" autocomplete=\"off\" placeholder=\"请输入用户电话\" class=\"layui-input newTelephone\">\n" +
            "    </div>\n" +
            "  </div>" +

            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">性别</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value='" + (DataBinding.getValueFromSessionStorageByKey('gender')==1||DataBinding.getValueFromSessionStorageByKey('gender')=='男'?'男':'女') + "'  type=\"text\" name=\"gender\" lay-verify=\"text\" autocomplete=\"off\" placeholder=\"请输入用户性别\" class=\"layui-input gender\">\n" +
            "    </div>\n" +
            "  </div>" +


            "  <div class=\"layui-form-item  p-horizontal-direction-20\">\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <button onclick='UserService.request.editMyselfUserInfoRequest()' type=\"submit\" class=\"layui-btn\" lay-submit=\"\" lay-filter=\"demo1\">立即提交</button>\n" +
            "    </div>\n" +
            "  </div>";
    },
    lookOtherUserInfo: function () {
        debugger
        return "<div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">姓名</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input  value='" + DataBinding.getValueFromSessionStorageByKey('name') + "' type=\"text\" name=\"name\" lay-verify=\"name\" autocomplete=\"off\" placeholder=\"请输入用户姓名\" class=\"layui-input name\">\n" +
            "    </div>\n" +
            "  </div>" +


            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">密码</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value=''  type=\"text\" name=\"password\" lay-verify=\"password\" autocomplete=\"off\" placeholder=\"如需更改请输入新的密码\" class=\"layui-input password\">\n" +
            "    </div>\n" +
            "  </div>" +

            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">年龄</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value='" + DataBinding.getValueFromSessionStorageByKey('age') + "'  type=\"text\" name=\"age\" lay-verify=\"number\" autocomplete=\"off\" placeholder=\"请输入用户年龄\" class=\"layui-input age\">\n" +
            "    </div>\n" +
            "  </div>" +

            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">电话</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value='" + DataBinding.getValueFromSessionStorageByKey('telephone') + "'  type=\"text\" name=\"newTelephone\" lay-verify=\"number\" autocomplete=\"off\" placeholder=\"请输入用户电话\" class=\"layui-input newTelephone\">\n" +
            "    </div>\n" +
            "  </div>" +

            "  <div class=\"layui-form-item p-all-20\">\n" +
            "    <label class=\"layui-form-label\">性别</label>\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <input value='" + (DataBinding.getValueFromSessionStorageByKey('gender')==1||DataBinding.getValueFromSessionStorageByKey('gender')=='男'?'男':'女') + "'  type=\"text\" name=\"gender\" lay-verify=\"text\" autocomplete=\"off\" placeholder=\"请输入用户性别\" class=\"layui-input gender\">\n" +
            "    </div>\n" +
            "  </div>" +


            "  <div class=\"layui-form-item  p-horizontal-direction-20\">\n" +
            "    <div class=\"layui-input-block\">\n" +
            "      <button onclick='UserService.request.editOtherUserRequest()' type=\"submit\" class=\"layui-btn\" lay-submit=\"\" lay-filter=\"demo1\">立即提交</button>\n" +
            "      <button onclick='UserService.operation.showListOperation()' type=\"submit\" class=\"layui-btn\" lay-submit=\"\" lay-filter=\"demo1\">返回列表</button>\n" +
            "    </div>\n" +
            "  </div>";
    }

}