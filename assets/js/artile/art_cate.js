$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArticleCate();

    function initArticleCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                var htmlStr = template('tal-table', res)
                $('tbody').html(htmlStr);
            }
        });
    }
    var indexAdd = null;
    $('#AddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            });

        })
        // 使用代理的方式为动态生成的表单绑定事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('添加文章分类成功！');
                    initArticleCate();
                    layer.close(indexAdd);

                }

            })
        })
        // 为编辑按钮绑定事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            });
            var id = $(this).attr('data-id');
            console.log(id);

            //    发请求获取文章类别信息

            $.ajax({
                type: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    form.val('dialog-edit', res.data);


                }

            })
        })
        // 使用代理的方式为动态生成的修改文章分类表单绑定事件

    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('修改文章分类成功！');
                    initArticleCate();
                    layer.close(indexEdit);

                }

            })
        })
        // 使用代理的方式为动态生成的删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        console.log(id);
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除成功！');
                    initArticleCate();
                }
            })
            layer.close(index);
        });
    })
})