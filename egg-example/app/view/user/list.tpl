<!DOCTYPE html>
<html>
  <head>
    <title>Hacker News</title>
    <link rel="stylesheet" href="/public/css/news.css" type="text/css" />
  </head>
  <body>
    <form method="POST" action="/creatOrUpdata?_csrf={{ ctx.csrf | safe }}" enctype="multipart/form-data">
        <button type="submit">添加</button>
        </form>
    <ul class="news-view view">
      {% for item in list %}
        <li class="item">
          姓名： {{ item.userName }} &nbsp;&nbsp; 手机号：{{item.phone}} &nbsp;&nbsp; 预约地点：{{ item.appointArea }}
        </li>
      {% endfor %}
    </ul>
  </body>
</html>