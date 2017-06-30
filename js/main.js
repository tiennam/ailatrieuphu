var i = 0;
var questions = questions['questions'];
var choose_answer;
var point = 0;
var starting = false;
var time = 16;
function startGame(e) {
    if (e.keyCode == 13) {
        document.querySelector(`audio[data-key="4"]`).play();
        $('#start-game').hide();
        $('#wrapper').show();
        starting = true;
        time = 16;
        countdown();
        window.removeEventListener('keydown', startGame);
    }
}
function createButton(data) {
    butonsHtml = '';
    $(data).each(function(index, el) {
        butonsHtml += '<div class="col-sm-6"><button type="button " class="raise">' + el + '</button></div>';
    });
    $('.answer').find('.row').html(butonsHtml);
}
function checkPoint() {
    $('#box-right').find('.row').removeClass('active');
    $('#box-right').find('.row:eq(' + parseInt(14 - i) + ')').addClass('active');
}
function loadPoint() {
    for (var key in questions) {
        points = questions[key]['point'];
        var content = `<div class="row item">
                            <div class="col-sm-4"> ${parseInt(key)+1}</div>
                            <div class="col-sm-8">$ ${points}</div>
                        </div>`;
        $('#box-right').prepend(content);
    }
    for (var i = 0; i < $('#box-right').find('.row').length; i++) {
        switch (i) {
            case 0:
            case 5:
            case 10:
                $('#box-right').find('.row:eq(' + i + ')').css({
                    'font-size': '20px',
                    color: '#5bc0de'
                });;
        }
    };
}
function loadQuestion() {
    document.querySelector(`audio[data-key="4"]`).play();
    data = questions[i];
    question = data['question'];
    answers = data['answers'];
    image = data['image'];
    if (image) {
        var img = '<img src=images/' + image + '>';
        $('.box-media').html(img);
    } else {
        $('.box-media').hide();
        $('.answer').css('margin-top', '100px');
    }
    $('.title').text(question);
    createButton(answers);
    checkPoint();
    point = 0;
    $('.point').find('span').text(point);
}
function nextQuestion() {
    document.querySelector(`audio[data-key="4"]`).play();
    time = 16;
    point = questions[i]['point'];
    butonsHtml = '';
    $('.point').find('span').text(point);
    i++;
    if (i < questions.length) {
        data = questions[i];
        question = data['question'];
        answers = data['answers'];
        image = data['image'];
        if (image) {
            var img = '<img src=images/' + image + '>';
            $('.box-media').show();
            $('.answer').css('margin-top', '0');
            $('.box-media').html(img);
        } else {
            $('.box-media').hide();
            $('.answer').css('margin-top', '100px');
        }
        $('.title').text(question);
        createButton(answers);
        checkPoint();
    } else {
        document.querySelector(`audio[data-key="7"]`).play();
        $('.win').show();
        $('.win').addClass('slideIn');
        swal("XIN CHÚC MỪNG !", "CHÚC MỪNG BẠN ĐÃ TRỞ THÀNH TRIỆU PHÚ !", "success")
        return;
    }
}
function gameOver() {
    swal({
            title: 'Bạn đã ra về với ' + point + ' điểm !',
            text: "Bạn có muốn chơi lại không ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Có",
            cancelButtonText: "Không"
        },
        function(isConfirm) {
            if (isConfirm) {
                window.location.reload();
            }else{
                window.removeEventListener('keydown', choose_answer);
            }
        });
}
function choose(index) {
    const audio = document.querySelector(`audio[data-key="3"]`).play();
    $('.answer').find('button:eq(' + index + ')').addClass('check');
    choose_answer = $('.answer').find('button:eq(' + index + ')').text();
    correct = parseInt(questions[i]['correct']);
    correct = questions[i]['answers'][correct];
   
    setTimeout(function() {
        if (choose_answer === correct) {
            var audio = document.querySelector(`audio[data-key="5"]`);
            audio.pause();
            audio.currentTime = 0;
            document.querySelector(`audio[data-correct="${index}"]`).play();
           setTimeout(() => {
              nextQuestion();

           }, 3000)
        } else {
             $('.answer').find('button').each(function(index, el) {
                 if ($(this).text()==correct) {
                    document.querySelector(`audio[data-wrong="${index}"]`).play();
                 }   
            });
            if (point<1000) {
                point = 0;
            }
            if (point>1000 && point<32000) {
                point = 1000;
            }
            if (point>32000 && point<1000000) {
                point = 32000;
            }
            gameOver();
            $('.answer button:contains(' + correct + ')').addClass('correct');
        }
    }, 2000);
}
function choose_answer(e) {
    if (starting) {
        if (!$('.answer').find('button').hasClass('check')){
            switch (e.keyCode) {
                case 65:
                    choose(0);
                    break;
                case 66:
                    choose(1);
                    break;
                case 67:
                    choose(2);
                    break;
                case 68:
                    choose(3);
                    break;
            }
        }
    }
}
function countdown() {
    var countdown = setInterval(function(){ 
        time--;
        $('.time').text(time);
        if (time==8) {
            document.querySelector(`audio[data-key="5"]`).currentTime = 0;
            document.querySelector(`audio[data-key="5"]`).play();
        }
        if (time==0) {
            clearInterval(countdown);
            $('.time').css('background', 'brown');
            gameOver();
        }
    }, 1000);
}
window.addEventListener('keydown', startGame);
window.addEventListener('keydown', choose_answer);
$(document).ready(function() {
    document.querySelector(`audio[data-key="1"]`).play();
    loadPoint();
    loadQuestion();
});