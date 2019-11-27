//FOR CHECKLIST
         
$(document).ready(function() {  
        
    $('#addButton').on('click', function(){
      TaskManager();
});
   
         
    function TaskManager(){  
      var newListItem = $('#addTo').val();
    
        if (newListItem.length > 0){
            $('#toDoList').append('<p><input class="added" type = "checkbox"><span>'+ newListItem + '</span></input></p>');
            $('#addTo').val('');
        };
        
       $(".added").change(function() {
    if(this.checked) {
        //Do stuff
		 $(this).parent().children("span").wrap("<del>");
		
    }
	else {
		  $(this).parent().children("del").children("span").unwrap();
	}
});
        
    
    
};
        
    });
       
$(document).keypress(function(e) {
         var newListItem = $('#addTo').val();
     
    if(e.which == 13) {
        if (newListItem.length > 0){
            $('#toDoList').append('<p><input class="added" type = "checkbox"><span>'+ newListItem + '</span></input></p>');
            $('#addTo').val('');
        };
    };
       $(".added").change(function() {
    if(this.checked) {
        //Do stuff
		 $(this).parent().children("span").wrap("<del>");
		
    }
	else {
		 $(this).parent().children("del").children("span").unwrap();
	}
});
});




var $tomato = $('#tomato');
var x = setInterval(dance,1000);

function dance(){
    if ($tomato.attr('src') == ('IMAGE FILE/Working Tomato 1.svg')){
        $tomato.attr('src','IMAGE FILE/Working Tomato 2.svg');
    }
    
    else if($tomato.attr('src') == ('IMAGE FILE/Chill Tomato.svg')){
        $tomato.attr('src','IMAGE FILE/Chill Tomato 2.svg');
    }
     
    else if($tomato.attr('src') == ('IMAGE FILE/Chill Tomato 2.svg')){
        $tomato.attr('src','IMAGE FILE/Chill Tomato.svg');
    }
    
    else if($tomato.attr('src') == ('IMAGE FILE/tea tomato.svg')){
        $tomato.attr('src','IMAGE FILE/tea tomato 2.svg');
    }
    
    else if($tomato.attr('src') == ('IMAGE FILE/tea tomato 2.svg')){
        $tomato.attr('src','IMAGE FILE/tea tomato.svg');
    }
    
    else{
        $tomato.attr('src','IMAGE FILE/Working Tomato 1.svg'); 
    }  
  }

$('#whatis').on('click', function(){
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

$('#settings').on('click', function(){
   $(this).toggleClass('animated tada');    
});

$('#settings').on('click', function(){
    $('.pop-out-settings').fadeIn();
    $('.pop-out-text-settings').fadeIn();   
});

$('#close-red-settings').on('click', function(){
    $('.pop-out-settings').fadeOut();
    $('.pop-out-text-settings').fadeOut();   
});

$('#SaveSet').on('click', function(){

	pomodoroMin = $("#pomodordVal").val();
	longMin = $("#longVal").val();
	shortMin = $("#shortVal").val();
	if(isLoopClicked)
	onLoopTimer();	
	if(isPomClicked)
	onPomodoroTimer();
	if(isLongClicked)
	onLongTimer();
	if(isShortCliked)
	onShortTimer();
	
	$('.pop-out-settings').fadeOut();
    $('.pop-out-text-settings').fadeOut(); 
       
});

$('.button').on('click', function(){
   $(this).toggleClass('animated tada');    
});

$('.navigation').on('click', function(){
   $(this).toggleClass('animated tada');    
});
    





//TIMER

var gHours = 0;
var gMinutes = 0;
var gSeconds = 0;

var remainingTime;

var countdownHandle;

var audio = new Audio('sounds/beep.mp3');

$(document).ready(function() {   
  onPomodoroTimer();
  dance();
});

var pomodoroMin = 25;
var shortMin = 5;
var longMin = 15;
$("#pomodordVal").val(pomodoroMin);
$("#longVal").val(longMin);
$("#shortVal").val(shortMin);
isShortCliked = false;
  isLongClicked = false;
  isPomClicked = true;
  isLoopClicked = false;
  loopCounter = -1;
  loopArray = [PomodoroTimer, ShortTimer, PomodoroTimer, ShortTimer, PomodoroTimer, ShortTimer, PomodoroTimer, LongTimer];
  
 function onLoop() {
	isLoopClicked = true;
	loopCounter++;
	console.log(loopCounter);
	if(loopCounter == loopArray.length)
		return;
	
	loopArray[loopCounter]();	
	if(loopCounter > 0)
		onStartTimer();
} 

function onLoopTimer() {
     loopCounter = -1;
	onLoop();
}

function onPomodoroTimer(){
	isLoopClicked = false;
	PomodoroTimer();
 
}

function PomodoroTimer() {
  $tomato.attr('src','IMAGE FILE/Working Tomato 1.svg');
    clearInterval(countdownHandle);
 isShortCliked = false;
  isLongClicked = false;
  isPomClicked = true;
  

  gHours = 0;
  gMinutes = pomodoroMin;
  gSeconds = 0;
   resetTimer();
   stopTimer(); 
    resetTimer();
}

function onShortTimer(){

	isLoopClicked = false;
	ShortTimer();
  
  
}

function ShortTimer() {
$tomato.attr('src','IMAGE FILE/Chill Tomato.svg');
 clearInterval(countdownHandle);
	isShortCliked = true;
  isLongClicked = false;
  isPomClicked = false;
   

  

  gHours = 0;
  gMinutes = shortMin;
  gSeconds = 0;
  resetTimer();
  stopTimer();
   resetTimer();
}

function onLongTimer(){
	isLoopClicked = false;
	LongTimer();
}
function LongTimer() {
 $tomato.attr('src','IMAGE FILE/tea tomato.svg');
     clearInterval(countdownHandle);
	 isShortCliked = false;
  isLongClicked = true;
  isPomClicked = false;
   



  gHours = 0;
  gMinutes = longMin;
  gSeconds = 0;
   resetTimer();
  stopTimer();
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
	if(isLoopClicked == true) {
		PomodoroTimer();
		return;
	}

  stopTimer();
  resetTimer();
}

function startAlarm(){
  if(remainingTime<1000){
    audio.play();
  }
  if(remainingTime<1000 && isLoopClicked == true)
	onLoop();
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
  document.title = "Pomodoro Timer";
}

function renderTimer(){


  var deltaTime=remainingTime;

  var hoursValue=Math.floor(deltaTime/(1000*60*60));
  deltaTime=deltaTime%(1000*60*60);

  var minutesValue=Math.floor(deltaTime/(1000*60));
  deltaTime=deltaTime%(1000*60);

  var secondsValue=Math.floor(deltaTime/(1000));
  document.title = "("+minutesValue+":"+secondsValue+")Pomodoro Timer";
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
