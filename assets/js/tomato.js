$(document).ready(function () {
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
        } else {
            // request permission from user
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    // show notification here
                } else {
                    console.log('User blocked notifications.');
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }

});
var audio = new Audio('assets/sounds/beep.mp3');

var $tomato = $('#tomato-cartoon');

function imageDancing() {
    if ($tomato.attr('src') == 'assets/images/tomato-cartoon.svg') {
        $tomato.attr('src', 'assets/images/tomato-cartoon-1.svg');
    } else if ($tomato.attr('src') == 'assets/images/chill-Tomato-cartoon.svg') {
        $tomato.attr('src', 'assets/images/chill-Tomato-cartoon-1.svg');
    } else if ($tomato.attr('src') == 'assets/images/chill-Tomato-cartoon-1.svg') {
        $tomato.attr('src', 'assets/images/chill-Tomato-cartoon.svg');
    } else if ($tomato.attr('src') == 'assets/images/tea-tomato-cartoon.svg') {
        $tomato.attr('src', 'assets/images/tea-tomato-cartoon-1.svg');
    } else if ($tomato.attr('src') == 'assets/images/tea-tomato-cartoon-1.svg') {
        $tomato.attr('src', 'assets/images/tea-tomato-cartoon.svg');
    } else {
        $tomato.attr('src', 'assets/images/tomato-cartoon.svg');
    }
}

setInterval(imageDancing, 1000);


function hideUnHideTodo(show_id_name, hide_hide, active_button, de_active_button) {
    $("#" + show_id_name).removeClass('d-none');
    $("#" + hide_hide).addClass('d-none');
    $("#" + active_button).addClass('active');
    $("#" + de_active_button).removeClass('active');
    $("#type_of_todo").val(show_id_name)
}

function todoModalClose() {
    $("#form_id").val('');
    $("#title").val('');
    $("#notes_value").val('');
    hideUnHideTodo('notes', 'checklist', 'notes_add_button', 'checklist_add_button');
    $("#tmpChecklist").html('');
}

var i = 1;

function saveTodo() {
    var title = $("#title").val();
    var notes_value = $("#notes_value").val();
    var form_id = $("#form_id").val();
    var type_of_todo = $("#type_of_todo").val();

    if (type_of_todo == 'notes') {
        if (form_id == '') {
            var appendToResult = '';
            appendToResult = appendToResult.concat('<div class="card mb-1" id="todo_id_' + i + '">');
            appendToResult = appendToResult.concat('<div class="card-body">');
            appendToResult = appendToResult.concat('<h5 class="card-title"><span id="todo_id_title_' + i + '">' + title + '</span>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right" onclick="editTodo(' + i + ')"><i class="fa fa-pencil"></i></a>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right pr-2" onclick="deleteTodo(' + i + ')"><i class="fa fa-trash"></i></a>');
            appendToResult = appendToResult.concat('</h5>');
            appendToResult = appendToResult.concat('<p class="card-text" id="todo_id_text_' + i + '">' + notes_value + '</p>');
            appendToResult = appendToResult.concat('<button class="btn rounded-pill float-right to-do-button btn-sm" onclick="startTaskTimer()">Start</button>');
            appendToResult = appendToResult.concat('</div>');
            appendToResult = appendToResult.concat('</div>');
            $("#to_do_data:last").append(appendToResult);

            $("#form_id").val('');
            $("#title").val('');
            $("#notes_value").val('');
            i++;
        } else {
            $("#todo_id_" + form_id).remove();

            var appendToResult = '';
            appendToResult = appendToResult.concat('<div class="card mb-1" id="todo_id_' + i + '">');
            appendToResult = appendToResult.concat('<div class="card-body">');
            appendToResult = appendToResult.concat('<h5 class="card-title"><span id="todo_id_title_' + i + '">' + title + '</span>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right" onclick="editTodo(' + i + ',0)"><i class="fa fa-pencil"></i></a>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right pr-2" onclick="deleteTodo(' + i + ')"><i class="fa fa-trash"></i></a>');
            appendToResult = appendToResult.concat('</h5>');
            appendToResult = appendToResult.concat('<p class="card-text" id="todo_id_text_' + i + '">' + notes_value + '</p>');
            appendToResult = appendToResult.concat('<button class="btn rounded-pill float-right to-do-button btn-sm" onclick="startTaskTimer()">Start</button>');
            appendToResult = appendToResult.concat('</div>');
            appendToResult = appendToResult.concat('</div>');
            $("#to_do_data:last").append(appendToResult);

            $("#add-to-do-modal").modal('hide');

            $("#form_id").val('');
            $("#title").val('');
            $("#notes_value").val('');
        }
    } else {
        var check_box_item = $("#tmpChecklist").html();

        if (form_id == '') {
            var appendToResult = '';
            appendToResult = appendToResult.concat('<div class="card mb-1" id="todo_id_' + i + '">');
            appendToResult = appendToResult.concat('<div class="card-body">');
            appendToResult = appendToResult.concat('<h5 class="card-title" id="check_box_card_title_' + i + '"><span id="todo_id_title_' + i + '">' + title + '</span>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right" onclick="editTodo(' + i + ',1)"><i class="fa fa-pencil"></i></a>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right pr-2" onclick="deleteTodo(' + i + ')"><i class="fa fa-trash"></i></a>');
            appendToResult = appendToResult.concat('</h5>');
            appendToResult = appendToResult.concat(check_box_item);
            appendToResult = appendToResult.concat('<button class="btn rounded-pill float-right to-do-button btn-sm" onclick="startTaskTimer()">Start</button>');
            appendToResult = appendToResult.concat('</div>');
            appendToResult = appendToResult.concat('</div>');
            $("#to_do_data:last").append(appendToResult);

            $("#form_id").val('');
            $("#title").val('');
            $("#tmpChecklist").html('');
            $("#add-to-do-modal").modal('hide');
            i++;
        } else {
            $("#todo_id_" + form_id).remove();

            var appendToResult = '';
            appendToResult = appendToResult.concat('<div class="card mb-1" id="todo_id_' + i + '">');
            appendToResult = appendToResult.concat('<div class="card-body">');
            appendToResult = appendToResult.concat('<h5 class="card-title" id="check_box_card_title_' + i + '"><span id="todo_id_title_' + i + '">' + title + '</span>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right" onclick="editTodo(' + i + ',1)"><i class="fa fa-pencil"></i></a>');
            appendToResult = appendToResult.concat('<a href="javascript:void(0)" class="card-link float-right pr-2" onclick="deleteTodo(' + i + ')"><i class="fa fa-trash"></i></a>');
            appendToResult = appendToResult.concat('</h5>');
            appendToResult = appendToResult.concat(check_box_item);
            appendToResult = appendToResult.concat('<button class="btn rounded-pill float-right to-do-button btn-sm" onclick="startTaskTimer()">Start</button>');
            appendToResult = appendToResult.concat('</div>');
            appendToResult = appendToResult.concat('</div>');
            $("#to_do_data:last").append(appendToResult);


            $("#form_id").val('');
            $("#title").val('');
            $("#checklist_item").val('');
            $("#tmpChecklist").html('');
            $("#add-to-do-modal").modal('hide');
        }

    }
    hideUnHideTodo('notes', 'checklist', 'notes_add_button', 'checklist_add_button');
}

function deleteTodo(id) {
    $.confirm({
        title: 'Are you sure?',
        content: 'Delete this todo item',
        type: 'red',
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: 'Yes Delete it!',
                btnClass: 'btn-red',
                action: function () {

                    $("#todo_id_" + id).remove();
                }
            },
            close: function () {
            }
        }
    });
}

function editTodo(id, type) {
    $("#form_id").val(id);
    var title = $("#todo_id_title_" + id).html();


    if (type == 0) {
        var text = $("#todo_id_text_" + id).html();
        hideUnHideTodo('notes', 'checklist', 'notes_add_button', 'checklist_add_button');
        $("#notes_value").val(text);
    } else {
        var appendToResult = '';
        $("#todo_id_" + id + ">div").children('div').each(function (i, item) {
            var ids = $(item).attr('id');
            appendToResult = appendToResult.concat('<div  id="' + ids + '">');
            appendToResult = appendToResult.concat($(this).html());
            appendToResult = appendToResult.concat('</div>');
        });
        $("#tmpChecklist").html(appendToResult);
        hideUnHideTodo('checklist', 'notes', 'checklist_add_button', 'notes_add_button');
    }
    $("#title").val(title);

    $("#add-to-do-modal").modal('show');
}

var j = 1;

function addItem() {
    var checklist_item = $("#checklist_item").val();
    if (checklist_item != '') {
        var appendToResult = '';
        appendToResult = appendToResult.concat('<div  id="todo_id_' + j + '">');
        appendToResult = appendToResult.concat('<label class="container1">' + checklist_item);
        appendToResult = appendToResult.concat('<input type="checkbox" id="check_box_' + j + '" value="' + j + '" onclick="checkboxCheckUncheck(' + j + ')"><span class="checkmark"></span>');
        appendToResult = appendToResult.concat('</div>');
        $("#tmpChecklist:last").append(appendToResult);
        $("#checklist_item").val('');
        j++;
    }
}

function checkboxCheckUncheck(value) {
    if ($("#check_box_" + value).is(":checked")) {
        $("#check_box_" + value).attr('checked', true);
    } else {
        $("#check_box_" + value).attr('checked', false);
    }
}

function integerOnly() {
    $(".integer").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
}

integerOnly();

function notify(message) {
    new Notification(message, {
        icon: 'http://localhost/project/tomato/assets/images/favicon.png',
    });
}


$('#SaveSet').on('click', function () {
    pomodoroMin = $("#pomodoro_value").val();
    longMin = $("#long_break_value").val();
    shortMin = $("#short_break_value").val();
    if (isLoopClicked)
        onLoopTimer();
    if (isPomClicked)
        onPomodoroTimer();
    if (isLongClicked)
        onLongTimer();
    if (isShortCliked)
        onShortTimer();
    $("#custom-timer").modal("hide");
});

var gHours = 0;
var gMinutes = 0;
var gSeconds = 0;

var remainingTime;

var countdownHandle;


$(document).ready(function () {
    onPomodoroTimer();
});


var pomodoroMin = 25;
var shortMin = 5;
var longMin = 15;
$("#pomodoro_value").val(pomodoroMin);
$("#short_break_value").val(longMin);
$("#long_break_value").val(shortMin);
isShortCliked = false;
isLongClicked = false;
isPomClicked = true;
isLoopClicked = false;
loopCounter = -1;
loopArray = [PomodoroTimer, ShortTimer, PomodoroTimer, ShortTimer, PomodoroTimer, ShortTimer, PomodoroTimer, LongTimer];

function onLoop() {
    isLoopClicked = true;
    loopCounter++;
    if (loopCounter == loopArray.length)
        return;

    loopArray[loopCounter]();
    if (loopCounter > 0)
        onStartTimer();
}

function onLoopTimer() {
    loopCounter = -1;
    onLoop();
}

function onPomodoroTimer() {
    isLoopClicked = false;
    PomodoroTimer();

}

function PomodoroTimer() {
    $tomato.attr('src', 'assets/images/tomato-cartoon.svg');
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

function onShortTimer() {
    isLoopClicked = false;
    ShortTimer();
}

function ShortTimer() {
    $tomato.attr('src', 'assets/images/chill-Tomato-cartoon.svg');
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

function onLongTimer() {
    isLoopClicked = false;
    LongTimer();
}

function LongTimer() {
    $tomato.attr('src', 'assets/images/tea-tomato-cartoon.svg');
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

function onStartTimer() {
    stopTimer();
    startTimer();
	
};

$('.action-button').on('click', function () {
    $(this).toggleClass('animated tada');
});

function onStopTimer() {
    stopTimer();

};

function onResetTimer() {
    if (isLoopClicked == true) {
        PomodoroTimer();
        return;
    }

    stopTimer();
    resetTimer();
}

function startAlarm() {
    if (remainingTime < 1000) {
        audio.play();
        notify('Timer Complete');
    }
    if (remainingTime < 1000 && isLoopClicked == true)
        onLoop();
}

function startTimer() {
    countdownHandle = setInterval(function () {
        decrementTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownHandle);
    startAlarm();

}

function resetTimer() {

    remainingTime = (gHours * 60 * 60 * 1000) +
        (gMinutes * 60 * 1000) +
        (gSeconds * 1000);
    renderTimer();
    document.title = "Pomodoro Timer";
}

function renderTimer() {

    var deltaTime = remainingTime;

    var hoursValue = Math.floor(deltaTime / (1000 * 60 * 60));
    deltaTime = deltaTime % (1000 * 60 * 60);

    var minutesValue = Math.floor(deltaTime / (1000 * 60));
    deltaTime = deltaTime % (1000 * 60);

    var secondsValue = Math.floor(deltaTime / (1000));
    document.title = "(" + minutesValue + ":" + secondsValue + ") Pomodoro Timer";
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
    /*if (oldHoursString !== hoursString) {
        $('#hoursValue').animate({top: '-=1em'});
        $('#hoursNext').animate({top: '-=1em'});
    }

    if (oldMinutesString !== minutesString) {
        $('#minutesValue').animate({top: '-=1em'});
        $('#minutesNext').animate({top: '-=1em'});
    }

    if (oldSecondsString !== secondsString) {

        $('#secondsValue').animate({top: '-=1em'});
        $('#secondsNext').animate({top: '-=1em'});
    }*/
}


function formatTime(intergerValue) {

    return intergerValue > 9 ? intergerValue.toString() : '0' + intergerValue.toString();

}

function decrementTimer() {

    remainingTime -= (1 * 1000);

    if (remainingTime < 1000) {
        onStopTimer();
    }

    renderTimer();
}


function startTaskTimer() {
    onLoopTimer();
    console.log("xxx");
    onStartTimer();
}
