var $tomato = $('#tomato');
var x = setInterval(dance,1000);

function dance(){
    if ($tomato.attr('src') == ('/IMAGE FILE/Working Tomato 1.svg')){
        $tomato.attr('src','/IMAGE FILE/Working Tomato 2.svg');
    }
    
    else if($tomato.attr('src') == ('/IMAGE FILE/Chill Tomato.svg')){
        $tomato.attr('src','/IMAGE FILE/Chill Tomato 2.svg');
    }
     
    else if($tomato.attr('src') == ('/IMAGE FILE/Chill Tomato 2.svg')){
        $tomato.attr('src','/IMAGE FILE/Chill Tomato.svg');
    }
    
    else if($tomato.attr('src') == ('/IMAGE FILE/tea tomato.svg')){
        $tomato.attr('src','/IMAGE FILE/tea tomato 2.svg');
    }
    
    else if($tomato.attr('src') == ('/IMAGE FILE/tea tomato 2.svg')){
        $tomato.attr('src','/IMAGE FILE/tea tomato.svg');
    }
    
    else{
        $tomato.attr('src','/IMAGE FILE/Working Tomato 1.svg'); 
    }  
  }

$('#whatis').hover(function(){
   $(this).toggleClass('animated tada');    
});

$('#whatis').on('click', function(){
    $('.pop-out').fadeIn();
    $('.pop-out-text').fadeIn();   
});

$('#close-red').on('click', function(){
    $('.pop-out').fadeOut();
    $('.pop-out-text').fadeOut();   
});

$('.button').on('click', function(){
   $(this).toggleClass('animated tada');    
});

$('.navigation').on('click', function(){
   $(this).toggleClass('animated tada');    
});
    

$('#shortButton').on('click', function(){
    $tomato.attr('src','/IMAGE FILE/Chill Tomato 2.svg');
    clearInterval();
  });

$('#pomodoroButton').on('click', function(){
    $tomato.attr('src','/IMAGE FILE/Working Tomato 1.svg');
    clearInterval();
  });

$('#longButton').on('click', function(){
    $tomato.attr('src','/IMAGE FILE/tea tomato.svg');
    clearInterval();
  });




//TIMER

var gHours = 0;
var gMinutes = 0;
var gSeconds = 0;

var remainingTime;

var countdownHandle;

var audio = new Audio('./sounds/beep.mp3');

$(document).ready(function() {   
  onPomodoroTimer();
  dance();
});

function onPomodoroTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 25;
  gSeconds = 0;

  resetTimer();
}

function onShortTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 5;
  gSeconds = 0;

  resetTimer();
}

function onLongTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 15;
  gSeconds = 0;

  resetTimer();
}

function onStartTimer(){
  stopTimer();
  startTimer();
};

function onStopTimer(){
  stopTimer();

};

function onResetTimer(){
  stopTimer();
  resetTimer();
}

function startAlarm(){
  if(remainingTime<1000){
    audio.play();
  }
}

function startTimer() {
  countdownHandle=setInterval(function() {
    decrementTimer();
  },1000);
}

function stopTimer() {
  clearInterval(countdownHandle);
  startAlarm();

}

function resetTimer(){

  remainingTime = (gHours*60*60*1000)+
  (gMinutes*60*1000)+
  (gSeconds*1000);
  renderTimer();
}

function renderTimer(){


  var deltaTime=remainingTime;

  var hoursValue=Math.floor(deltaTime/(1000*60*60));
  deltaTime=deltaTime%(1000*60*60);

  var minutesValue=Math.floor(deltaTime/(1000*60));
  deltaTime=deltaTime%(1000*60);

  var secondsValue=Math.floor(deltaTime/(1000));

  animateTime(hoursValue, minutesValue, secondsValue);
};


function animateTime(remainingHours, remainingMinutes, remainingSeconds) {

  // position
  $('#hoursValue').css('top', '0em');
  $('#minutesValue').css('top', '0em');
  $('#secondsValue').css('top', '0em');

  $('#hoursNext').css('top', '0em');
  $('#minutesNext').css('top', '0em');
  $('#secondsNext').css('top', '0em');

  var oldHoursString = $('#hoursNext').text();
  var oldMinutesString = $('#minutesNext').text();
  var oldSecondsString = $('#secondsNext').text();

  var hoursString = formatTime(remainingHours);
  var minutesString = formatTime(remainingMinutes);
  var secondsString = formatTime(remainingSeconds);

  $('#hoursValue').text(oldHoursString);
  $('#minutesValue').text(oldMinutesString);
  $('#secondsValue').text(oldSecondsString);

  $('#hoursNext').text(hoursString);
  $('#minutesNext').text(minutesString);
  $('#secondsNext').text(secondsString);

  // set and animate
  if(oldHoursString !== hoursString) {
    $('#hoursValue').animate({top: '-=1em'});
    $('#hoursNext').animate({top: '-=1em'});
  }

  if(oldMinutesString !== minutesString) {
    $('#minutesValue').animate({top: '-=1em'});
    $('#minutesNext').animate({top: '-=1em'});
  }

  if(oldSecondsString !== secondsString) {
    $('#secondsValue').animate({top: '-=1em'});
    $('#secondsNext').animate({top: '-=1em'});
  }
}


function formatTime(intergerValue){

  return intergerValue > 9 ? intergerValue.toString():'0'+intergerValue.toString();

}

function decrementTimer(){

  remainingTime-=(1*1000);

  if(remainingTime<1000){
    onStopTimer();
  }

  renderTimer();
}
