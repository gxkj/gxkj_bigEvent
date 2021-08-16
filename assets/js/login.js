$(function() {
    // 点击去注册链接
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })


    // 从layui获取form对象
    var form = layui.form;
    form.verify({
            // 自定义验证密码规则
            pw: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 自定义验证第二次密码规则
            repw: function(value) {
                repw = $('.reg-box [name=password]').val();
                if (value !== repw) {
                    return '两次密码输入不一致';
                }
            },
            // 自定义用户名规则
            username: function(value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }

                //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
                if (value === 'xxx') {
                    alert('用户名不能为敏感词');
                    return true;
                }
            }
        })
        // 注册接口

    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);

            }
            layer.msg('注册成功!可以登录啦');
            // 模拟去登录
            $('#link_login').click();
        })
    })
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';


            }
        });
    })
})