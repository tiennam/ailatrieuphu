function Game(questions) {
    this.score = 0;
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.time = 0;
    this.start = false;
    this.isGuess = false;
    this.hideIndex = [];
}
Game.prototype.startGame = function(e) {
    if (e.keyCode == 13) {
        window.removeEventListener('keydown', game.startGame);
        GameUI.displayNext();
        game.start = true;
    }
};
Game.prototype.getScore = function() {
    if (this.score < 1000) {
        return 0;
    }
    if (this.score >= 1000 && this.score < 32000) {
        return 1000;
    }
    if (this.score >= 32000 && this.score < 1000000) {
        return 32000;
    }
};
Game.prototype.guess = function(answer) {
    if (this.getCurrentQuestion().answer === answer) {
        this.score = this.getCurrentQuestion().score;
        this.currentQuestionIndex++;
        return true;
    } else {
        return false;
    }
};
Game.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestionIndex];
};
Game.prototype.hasEndGame = function() {
    return this.currentQuestionIndex >= this.questions.length;
};
Game.prototype.keyDownHandler = function(e) {
    if (!game.isGuess && game.start) {
        switch (e.keyCode) {
            case 65:
                if (game.hideIndex.indexOf(0)<=-1) GameUI.guessHandler(0);
                break;
            case 66:
                if (game.hideIndex.indexOf(1)<=-1) GameUI.guessHandler(1);
                break;
            case 67:
                if (game.hideIndex.indexOf(2)<=-1) GameUI.guessHandler(2);
                break;
            case 68:
                if (game.hideIndex.indexOf(3)<=-1) GameUI.guessHandler(3);
                break;
        }
    }
};
Game.prototype.help50_50 = function() {
    var excluded, min = 0,
        max = 3;
    $('.raise').each(function(index, el) {
        if ($(this).text() === game.getCurrentQuestion().answer) {
            excluded = index;
            return false;
        }
    });
    var n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n++;
    return [n, excluded];
}
var GameUI = {
    displayNext: function() {
        if (game.hasEndGame()) {
            GameAudio.playAudio('key', 7);
            this.displayHTML('.win,#wrapper')
            swal("XIN CHÚC MỪNG !", "CHÚC MỪNG BẠN ĐÃ TRỞ THÀNH TRIỆU PHÚ !", "success");
        } else {
            this.displayHTML('#wrapper,#start-game');
            // GameUI.countDown();
            this.displayQuestion();
            this.displayMedia();
            this.displayChoices();
            this.displayScore();
        }
    },
    displayQuestion: function() {
        var question = $("#question").text(game.getCurrentQuestion().question);
    },
    displayMedia: function() {
        var image = game.getCurrentQuestion().image;
        if (image) {
            var img = '<img src=images/' + image + '>';
            $('.box-media').show();
            $('.answer').css('margin-top', '0');
            $('.box-media').html(img);
        } else {
            $('.box-media').hide();
            $('.answer').css('margin-top', '100px');
        }
    },
    displayChoices: function() {
        var choices = game.getCurrentQuestion().choices;
        var html = '';
        for (var i = 0; i < choices.length; i++) {
            html += `<div class="col-sm-6"><button type="button" class="raise" id="choice-${i}">${choices[i]}</button></div>`;
        }
        $(".answer .row").html(html);
    },
    displayScore: function() {
        var scoreHTML = document.querySelector(".point span");
        scoreHTML.innerHTML = game.score;
        var listScore = game.questions;
        for (var i = 0; i < listScore.length; i++) {
            var score = listScore[i].score;
            moc_class = (i == 4 || i == 9 || i == 14) ? 'moc' : '';
            var content = `<div class="item ${moc_class} item-${i}">
                            <span class=""> ${parseInt(i)+1}. $ ${score}</span>
                        </div>`;
            $('#box-right').prepend(content);
        }
        var scoreActive = $(`.item-${game.currentQuestionIndex}`);
        scoreActive.addClass('active');
    },
    displayGameOver: function(message) {
        $('#wrapper').hide();
        $('.gameover').show();
        GameAudio.playAudio('key', 6);
        swal({
                title: message,
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
                } else {
                    window.removeEventListener('keydown', this.keyDownHandler);
                }
            })
    },
    displayRule: function() {
        $("#show_help").animatedModal({
            animatedIn: 'bounceIn',
            animatedOut: 'bounceOut',
            color: 'rgb(244, 67, 54)'
        });
        // GameAudio.playAudio('key',2);
    },
    displayHelp : function(){
        var excludeds = game.help50_50();
        excludeds.sort();
        $('.raise').each(function(index, el) {
            if (index!=excludeds[0] && index!=excludeds[1]) {
                $(el).css('opacity', '0');
                game.hideIndex.push(index);
            }
        });
        $('#help50').css('visibility','hidden')
    },
    displayHTML: function(elmShow, elmHide) {
        $(elmHide).hide();
        $(elmShow).show();
    },
    countDown: function() {
        var tenSeconds = new Date().getTime() + 30000;
        $('#clock').countdown(tenSeconds, function(event) {
                $(this).text(event.strftime('%S'));
            })
            .on('finish.countdown', function(event) {
                GameUI.displayGameOver("Hết Giờ ! Bạn đã ra về với " + game.getScore() + " điểm.");
            });
    },
    guessHandler: function(index) {
        game.isGuess = true;
        $('#clock').countdown('stop');
        GameAudio.playAudio('key', 3);
        var choice = $(`#choice-${index}`);
        choice.addClass('check');
        var answer = choice.text();
        setTimeout(() => {
            if (game.guess(answer)) {
                GameAudio.playAudio('correct', index);
                setTimeout(() => {
                    $('#box-right').empty();
                    game.isGuess = false;
                    GameUI.displayNext();
                }, 2000);
            } else {
                $('.raise').each(function(index, el) {
                    if ($(this).text() == game.getCurrentQuestion().answer) {
                        GameAudio.playAudio('wrong', index);
                    }
                });
                setTimeout(() => {
                    this.displayGameOver('Bạn đã ra về với ' + game.getScore() + ' điểm !');
                }, 3000);
            }
        }, 1000);
    }
}

var GameAudio = {
    playAudio: function(key, val) {
        var audio = document.querySelector(`audio[data-${key}="${val}"]`);
        audio.play();
    },
    stopAudio: function(key) {
        var newAudio = document.querySelector(`audio[data-key="${key}"]`);
        newAudio.currentTime = 0;
        newAudio.paused;
    },
}


// Create Game
var questions = data.questions;
var game = new Game(questions);
GameAudio.playAudio('key', 1);
window.addEventListener('keydown', game.keyDownHandler);
window.addEventListener('keydown', game.startGame);
GameUI.displayRule();
$('#help50').on('click', function(event) {
    GameUI.displayHelp();
});