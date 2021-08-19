$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('.layui-form [name=oldPwd]').val()) {
                return '新旧密码不能一致！'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致，请重新修改！'
            }
        }
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        console.log('1');
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功！');
                // console.log(res);
                $('.layui-form')[0].reset();


            }

        })

    })
})