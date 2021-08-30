$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义时间美化过滤器
    template.defaults.imports.dataFormate = function(date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = addSero(dt.getMonth() + 1);
        var d = addSero(dt.getDate());
        var h = addSero(dt.getHours());
        var mm = addSero(dt.getMinutes());
        var ss = addSero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss;

    }

    function addSero(n) {
        return n > 9 ? n : '0' + n;
    }
    //    定义一个查询对象，用来发送服务器请求文章列表
    var q = {
        // 页码值,默认第一页
        pagenum: 1,
        // 每页显示多少条数据，默认2条
        pagesize: 2,
        // 文章分类的id
        cate_id: '',
        // 文章的状态
        state: ''
    }
    initTable();

    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                var htmlStr = template('tel-tab', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        });
    }
    // 初始化文章分类
    initList();

    function initList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                // console.log('1');
                var htmlStr = template('tel-cate', res);
                $('#sel-cate').html(htmlStr);
                form.render();

            }
        });
    }
    // 为筛选按钮绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault();
            // console.log('ok');
            // 获取元素表单的值
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            // console.log(cate_id);
            // console.log(state);
            q.cate_id = cate_id;
            q.state = state;
            initTable();
        })
        // 渲染分页方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }
    // 通过代理的方式为删除按钮绑定删除事件
    $('tbody').on('click', '.btn-delete', function() {
            // 获取按钮个数
            var len = $('.btn-delete').length;
            // 获取要删除文章的id号
            var id = $(this).attr('data-id');
            console.log(id);
            layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
                //do something
                $.ajax({
                    type: "get",
                    url: "/my/article/delete/" + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message);
                        }
                        layer.msg('删除成功');
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;

                        }
                        initTable();
                    }
                });
                layer.close(index);
            });
        })
        // 为文章列表添加编辑功能
})