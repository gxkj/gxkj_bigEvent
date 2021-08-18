$(function() {
        getUserInfo();
        $('#bitLoginout').on('click', function() {
            // console.log('ok');
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // console.log('ok');
                localStorage.removeItem('token');
                location.href = '/login.html';
                layer.close(index);
            });
        })
    })
    // 获取用户信息列表
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
                console.log(localStorage.getItem('token'));
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('请求用户列表失败！')
                }
                rederAvater(res.data);
            }
            // complete: function(res) {
            //     // console.log(res.responseJSON);
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         localStorage.removeItem('token');
            //         location.href = '/login.html';
            //     }
            // }
    });
    // 渲染用户头像
    function rederAvater(user) {
        // 获取用户名称
        var name = user.nickname || user.username;
        $('#welcom').html('欢迎&nbsp;&nbsp;' + name);
        // 渲染用户头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user.user_pic).show();
            $('.text-avater').hide();
        } else {
            $('.layui-nav-img').hide();
            var first = user.username[0].toUpperCase();
            $('.text-avater').html(first).show();
        }
    }
}