$(function() {
    var form = layui.form;
    InitUserInfo();
    layui.form.verify({
        nikename: function(value) {
            if (value.length > 6) {
                return '昵称长度要在1~6之间';
            }
        }
    });
    // 初始化用户信息
    function InitUserInfo() {
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 重置用户表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        InitUserInfo();
    });
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.msg(res.message);
                }
                layer.msg('修改用户信息成功');
                // console.log(res);
                window.parent.getUserInfo();

            }

        })

    })
})