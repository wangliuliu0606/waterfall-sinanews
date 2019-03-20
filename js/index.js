var curPage = 1
var dataNumber = 10
var colHeightArray = []
var nodeWidth = $('.item').outerWidth(true)
var column = Math.floor($('#pic').width()/nodeWidth)
var isDataArrive = true

for(var i = 0; i < column; i++){
  colHeightArray[i] = 0
}

start()

function start(){
  isDataArrive = false
  getData(function(newList){
    isDataArrive = true
    $.each(newList,function(idx,news){
      var $node = getNode(news)
      $node.find('img').on('load',function(){
        $('#pic').append($node)
        waterfall($node)
      })
    })
  })
}

$(window).on('scroll',function(){
  if(!isDataArrive) return

  if(isVisible($('#loadIng'))){
    start()
  }
})


function isVisible($tal){
  var scrollT = $(window).scrollTop()
  var winH = $(window).height()
  var top = $tal.offset().top
  if(top < scrollT + winH){
    return true
  }else{
    return false
  }
}

function getData(callback){
  $.ajax({
    url: 'https://platform.sina.com.cn/slide/album_tech',
    dataType: 'jsonp',
    jsonp:"jsoncallback",
    data: {
      app_key: '1271687855',
      num: dataNumber,
      page: curPage
    }
  }).done(function(ret){
    if(ret && ret.status && ret.status.code === "0"){
      callback(ret.data)
      curPage++
    }else{
      console.log('get error data')
    }
  })
}

function getNode(item) {
  var $tpl = $(`<li class="item">
                  <a href="#">
                    <img src="http://s.img.mix.sina.com.cn/auto/resize?img=http%3A%2F%2Fwww.sinaimg.cn%2Fdy%2Fslidenews%2F5_img%2F2016_09%2F453_75615_657883.jpg&size=250_0" alt="">
                    <h4 class="header">标题</h4>
                    <p class="cont">当地时间2016年3月1日，在东部与亲俄武装作战中受伤的乌克兰士兵接受海豚治疗。</p>
                  </a>
                </li>`)

  $tpl.find('a').attr('href',item.cmnt_url)
  $tpl.find('img').attr('src',item.img_url)
  $tpl.find('.header').text(item.short_name)
  $tpl.find('.cont').text(item.name)

  return $tpl
}

function waterfall($node){
  $node.each(function(){
    var $cur = $(this)
    var minvalue = colHeightArray[0]
    var minindex = 0

    for(var i = 0; i < colHeightArray.length; i++){
      if(colHeightArray[i] < minvalue){
        minvalue = colHeightArray[i]
        minindex = i
      }
    }
    $cur.css({
      left: minindex * nodeWidth,
      top: minvalue,
      opacity: 1
    })

    colHeightArray[minindex] += $cur.outerHeight(true)
    $('#pic').height(Math.max.apply(null,colHeightArray))

  })
}