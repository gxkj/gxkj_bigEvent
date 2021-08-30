$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    initEditor();

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template('tel-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    }
    var $img = $('#image')

    // 2. 裁剪选项
    $img.cropper({
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    });
    $('#btnChooseImg').on('click', function() {
            $('#coverFile').click();
        })
        // $('#coverFile').on('change', function(e) {
        //     // console.log(e);
        //     var filelist = e.target.files;
        //     console.log(filelist);
        //     if (filelist.length == 0) {
        //         return layer.msg('请选择图片！');
        //     }
        //     var file = e.target.files[0];
        //     // console.log(file);
        //     var imgURL = URL.createObjectURL(file);
        //     console.log(imgURL);
        //     $('#image').cropper('destroy') // 销毁旧的裁剪区域
        //     $('#image').attr('src', imgURL) // 重新设置图片路径
        //     $image.cropper(options) // 重新初始化裁剪区域

    // })
    $('#coverFile').change(function() {
        const imgUrl = URL.createObjectURL(this.files[0]);
        $img.cropper('replace', imgUrl);
    })
    var art_status = '已发布';
    $('#btnSave2').on('click', function() {
        art_status = '草稿';
    })
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        // console.log(fd);
        fd.append('state', art_status);
        $img
            .cropper('getCroppedCanvas', {
                width: 400, //创建一个Canvas画布width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                //将Canvas画布上的内容，转化为文件对象//得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publishArtile(fd);
            })

    })

    function publishArtile(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                location.href = '/article/art_list.html';

            }
        });

    }
})