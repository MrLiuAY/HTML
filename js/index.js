// language=JQuery-CSS
$('#playlist').click(function () {
    var playlist = document.getElementById("playlist_list");
    if (playlist.style.display === 'block') {
        playlist.style.display = 'none';
    } else {
        playlist.style.display = 'block';
    }
});
(function () {
    //播放数据
    var iter = localStorage.getItem('mlist') ?
        JSON.parse(localStorage.getItem('mlist')) : [];

    //搜索到的数据
    var search = [];


    //获取元素
    var audio = document.querySelector("audio");//播放标签
    var play = document.querySelector(".bottom_left_play");//播放按钮
    var playList = document.querySelector("#playlist_list ul");//获取播放列表ul
    var under1 = document.querySelector(".bottom_left_under");//获取下一曲播放按钮
    var on = document.querySelector(".bottom_left_on");//获取上一曲播放按钮
    var byTxt = document.querySelector(".play .by_txt");//获取页面播放信息
    var playImg = document.querySelector(".bottom_middle .play_img");//获取专辑头像
    var progre = document.querySelector(".play .progress");//获取进度条
    var redProgre = document.querySelector(".play .progress .in");//获取红色进度条
    var circle = document.querySelector(".play .progress .circle");//获取进度条小圆点
    var show_Time_Non = document.querySelector(".play .time_non");//获取页面歌曲已播放时长
    var show_Time_Max = document.querySelector(".play .time .time_max");//获取页面歌曲总时长
    var order = document.querySelector(".order");//获取当前播放模式
    var input = document.querySelector(".text_input");//搜索框
    var result_li = document.querySelector("result_li");//搜索内容
    var playlist_length = document.querySelector(".playlist_length");//播放列表数量
    var delete_paly = document.querySelector(".playlist_delect");//删除全部播放列表
    var volume = document.querySelector(".volume");//音量

    //变量
    var index = 0;//当前播放歌曲
    var bar = progre.clientWidth;//进度条长度
    var mp3_duration = 0;//媒体总时长
    var mp3_currentTime = 0;//媒体已播放时长
    var mode = 0;//当前播放模式
    var volume1 = audio.volume;//当前音量

    var time = null;//定时器


    function play_list_size() {
        if (iter !== null) {
            if (iter.length !== 0) {
                playlist_length.innerHTML = iter.length;
            } else {
                playlist_length.innerHTML = 0;
            }
        }


    }

    play_list_size();
    // for (var i=0;i<iter.length;i++){
    //     iter[i].delete();
    // }


    //动态显示当前歌曲的名字与歌手
    function by_Txt() {
        if (iter.length !== 0) {
            audio.src = 'http://music.163.com/song/media/outer/url?id=' + iter[index].id + '.mp3';
            var sar = "<span>" + iter[index].name + "</span>";
            sar += " --- " + "<span>";
            for (var i = 0; i < iter[index].ar.length; i++) {
                sar += iter[index].ar[i].name + '  ';
                playImg.src = iter[index].al.picUrl;
            }
            sar += "</span>";
            byTxt.innerHTML = sar;
        }
        update();
        play_list_size();
    }

    by_Txt();

    function update() {
        var sta = "";
        if (iter.length !== 0) {
            //播放列表
            for (var i = 0; i < iter.length; i++) {
                sta += "<li>";
                sta += "<span class=\"li_span_name left\">" + iter[i].name + "</span>";
                sta += "<span class=\"li_span right\">";
                for (var j = 0; j < iter[index].ar.length; j++) {
                    sta += iter[i].ar[j].name + '  ';
                }
                sta += "</span>";
                sta += "&nbsp;<a class='right' href='#'>删除</a>";
                sta += "</li>";
            }
        }
        playList.innerHTML = sta;
    }

    update();

    //暂停
    function play1() {
        audio.play();
        play.style.backgroundPositionY = 454 + 'px';

    }

    //删除全部
    $(delete_paly).on('click', function (e) {
        localStorage.setItem(
            'mlist', JSON.stringify([])
        )
        iter = [];
        by_Txt();
        index = 0;
    });
    //点击列表播放
    $(playList).on('click', 'li', function (e) {
        var inde = $(this).index();
        //删除单个
        if (e.target.localName === 'a') {
            iter.splice(inde, 1);
            localStorage.setItem(
                'mlist', JSON.stringify(iter)
            );
            index -= index > 0 ? index : 0;
        } else {
            index = inde;
        }
        by_Txt();
        play1();
    });

    //搜索
    input.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            $.ajax({
                url: 'https://api.imjad.cn/cloudmusic/',
                data: {
                    type: 'search',
                    s: input.value
                },
                type: 'get',

                success: function (data) {
                    search = data.result.songs;
                    var str = '';
                    for (var i = 0; i < search.length; i++) {
                        str += '<li>';
                        str += '<span class="left">' + search[i].name + '</span>';
                        str += '<span class="right">';
                        for (var j = 0; j < search[i].ar.length; j++) {
                            str += search[i].ar[j].name + '  ';
                        }
                        str += '</span>';
                        str += '</li>';

                    }
                    $('.result_li').html(str);
                },
                error: function (err) {

                }
            });
            this.value = '';
        }

    });

    //鼠标滚动改变音量
    $(volume).on('mousewheel DOMMouseScroll', onMouseScroll);

    function onMouseScroll(e) {
        e.preventDefault();
        var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        var delta = Math.max(-1, Math.min(1, wheel));
        if (delta < 0) {//向下滚动
            volume1-=0.05;
            volume1 = volume1 >= 0 ? volume1 : 0;
            audio.volume=volume1;
        } else {//向上滚动
            volume1+=0.05;
            volume1 = volume1 > 1 ? 1 : volume1;
            audio.volume=volume1;
        }
    }

    //点击播放
    $('.result_li').on('click', 'li', function () {
        var searchIndex = $(this).index();
        iter.push(search[searchIndex]);
        localStorage.setItem(
            'mlist', JSON.stringify(iter)
        );
        iter = localStorage.getItem('mlist') ? JSON.parse(localStorage.getItem('mlist')) : [];
        update();
        play_list_size();
        if (iter === 1) {
            by_Txt();
            play1();
        }
    });

    /**
     * 播放及上一曲下一曲控制
     */
    //控制播放及暂停
    play.addEventListener("click", function () {
        //audio.paused暂停时为true;
        if (audio.paused) {
            play1();
        } else {
            play.style.backgroundPositionY = 415 + 'px';
            audio.pause();
        }
    });


    //下一曲
    under1.addEventListener("click", function () {
        index++;
        index = index > iter.length - 1 ? 0 : index;
        by_Txt();
        play1();
    });

    //上一曲
    on.addEventListener("click", function () {
        index--;
        index = index < 0 ? iter.length - 1 : index;
        by_Txt();
        play1();
    });


    //处理时间格式
    function formatTime(time) {
        return time > 9 ? time : '0' + time;
    }

    //进度条
    function bar_move(a, b) {
        redProgre.style.width = +(a / b) * bar + "px";
        circle.style.marginLeft = +(a / b) * bar - 7 + "px";
    }

    //获取媒体时间
    audio.addEventListener("canplay", function () {
        mp3_duration = audio.duration;
        var timeM = parseInt(mp3_duration / 60);
        var timeS = parseInt(mp3_duration % 60);
        timeM = formatTime(timeM);
        show_Time_Max.innerHTML = timeM + ':' + timeS;
        //实时更新已播放时间
        audio.addEventListener("timeupdate", function () {
            mp3_currentTime = audio.currentTime;
            var timeM = parseInt(mp3_currentTime / 60);
            var timeS = parseInt(mp3_currentTime % 60);
            timeM = formatTime(timeM);
            timeS = formatTime(timeS);
            show_Time_Non.innerHTML = timeM + ':' + timeS;
            bar_move(mp3_currentTime, mp3_duration);
            if (audio.ended) {
                switch (mode) {
                    case 0:
                        var event = document.createEvent("MouseEvents");
                        event.initEvent("click", false, true);
                        under1.dispatchEvent(event);
                        break;
                    case 1:
                        play1();
                        break;
                    case 2:
                        index = runNumber(index);
                        by_Txt();
                        play1();
                        break;
                }
            }
        });
    });

    //快进与快退
    progre.addEventListener("click", function (e) {
        var clik = e.offsetX;
        mp3_currentTime = (clik / bar) * mp3_duration;
        audio.currentTime = mp3_currentTime;
        bar_move(mp3_currentTime, mp3_duration);
    });


    /**
     * 播放模式
     */

    order.addEventListener("click", function () {
        mode++;
        mode = mode > 2 ? 0 : mode;
        switch (mode) {
            case 0:
                order.style.backgroundPositionY = 2124 + 'px';
                order.style.backgroundPositionX = 0 + 'px';
                break;
            case 1:
                order.style.backgroundPositionX = 240 + 'px';
                break;
            case 2:
                order.style.backgroundPositionX = 240 + 'px';
                order.style.backgroundPositionY = -245 + 'px';
                break;
        }
    });

    function runNumber(num) {
        var number = Math.floor(Math.random() * iter.length);
        if (number === num) {
            number = runNumber();
        }
        return number;
    }


})();