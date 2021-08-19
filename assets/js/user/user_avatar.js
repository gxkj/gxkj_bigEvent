$(function() {

    var layer = layui.layer;
    getUserInfoTow();
    // 1第一步执行这里
    function getUserInfoTow() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('请求用户列表失败！')
                }

                if (res.data.user_pic !== null) {
                    $("#image").attr("src", res.data.user_pic);
                    // document.querySelector('#image').src = res.data.user_pic;
                    // jq 中，$(function() {}里面的函数顺序执行的
                    // 等于说你没有等到这里的接口请求成功的时候你就执行了getImgURL的函数
                    // 接口请求成功才执行剪裁区域的填充
                    getImgUrl();
                }

            }
        });
    }
    // 如果这里没有函数包裹的话，就会直接执行下去
    function getImgUrl() {
        // 1.1 获取裁剪区域的 DOM 元素

        var $image = $('#image')
            // 1.2 配置选项
        const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }

        // 1.3 创建裁剪区域
        $image.cropper(options);
        // 为上传绑定点击事件
        $('#btnChooseImg').on('click', function() {
            $('#file').click();
        });
        $('#file').on('change', function(e) {
                // console.log(e);
                var filelist = e.target.files;
                console.log(filelist);
                if (filelist.length == 0) {
                    return layer.msg('请选择图片！');
                }
                var file = e.target.files[0];
                // console.log(file);
                var imgURL = URL.createObjectURL(file);
                console.log(imgURL);
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', imgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            })
            // 为确定按钮绑定事件
        $('#btnUpload').on('click', function() {
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            $.ajax({
                method: "POST",
                url: "/my/update/avatar",
                data: {
                    avatar: dataURL
                },
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layui.layer.msg('修改头像成功！');
                    window.parent.getUserInfo();
                    getUserInfoTow();

                    // console.log(res);


                }

            })
        })
    }
})