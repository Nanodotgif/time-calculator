function inputValidate(){ // Only allow numbers to be typed in text inputs
    var e = event || window.event;  
    var key = e.keyCode || e.which;                              
    if (!((key>=48)&&(key<=57))||(key==8)||(key == 46)) { //allow backspace //and delete
        if (e.preventDefault) e.preventDefault(); 
            e.defaultPrevented = false; 
    }
  }

var focusableFields = Array.from(document.getElementsByClassName("time-input"))
// Remove colons bc im lazy
focusableFields.splice(1,1);
focusableFields.splice(3,1);
focusableFields.push(document.getElementById("submit"));
var hourFields = Array.from(document.getElementsByClassName("hour"));
var minuteFields = Array.from(document.getElementsByClassName("minute"));


// gets currently focused field and focuses the next one in the list of specified fields
function focusNextField(currentField) {
  var currentFieldIndex = focusableFields.indexOf(currentField);
  if (currentFieldIndex === -1)
    return;

  if (currentFieldIndex !== focusableFields.length-1) {
    focusableFields[currentFieldIndex+1].focus()
  } else {
    return;
  }
}

focusableFields.forEach(element => {
  element.addEventListener("input", ()=> {
    inputUpdated(element);
  })
  element.addEventListener("focusout", ()=> {
    lostFocus(element);
  })

  element.addEventListener("wheel", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = Math.sign(event.deltaY);

    scrolledOverField(element, delta);
  });

  var ts;
  var counter = 0;
  element.addEventListener("touchstart", (event) => {
    ts = event.touches[0].clientY;
    counter = 0;
  });
  element.addEventListener("touchmove", (event) => {
    event.preventDefault();
    event.stopPropagation();
    var te = event.changedTouches[0].clientY;
    if (ts > te) {
      counter++;
    } else {
      counter--;
    }
    if (Number.isInteger(Math.abs(counter / 20))) {
      scrolledOverField(element, -1 * Math.sign(counter));
      counter = 0;
    }    
  });

});


function inputUpdated(element) { // input on value change
  var value = element.value;
  var valueInt = parseInt(element.value)

  // Uses context to correctly format times in hh:mm format
  if (element.classList.contains("hour")) {
    if (valueInt > 12) {
      element.value = "00";
    } else if (valueInt > 1 && element.value.length === 1) {
      element.value = "0" + element.value;
      focusNextField(element);
    }
  } else if (element.classList.contains("minute")) {
    if (valueInt > 5 && element.value.length === 1) {
      element.value = "0" + element.value;
      focusNextField(element);
    }
  }

  if (value.length === 2) {
    focusNextField(element); // focuses the next field when one is filled
  }
}

function lostFocus(element) {
  if (element.value.length === 1) {
    element.value = "0" + element.value;
  } else if (element.value.length === 0) {
    element.value = "00";
  }
}

function scrolledOverField(element, delta) {
  if (element.value === "") { element.value = "00"; }
  const elementInt = parseInt(element.value);
  const deltaInt = delta;
  if (element.classList.contains("minute")) { maxVal = 59; } else { maxVal = 12; }
  if (!(elementInt === 0 && deltaInt > 0) && !(elementInt === maxVal && deltaInt < 0)) {
    element.value = formatTimeInt(elementInt - deltaInt);
    navigator.vibrate(10);
  }
}

var isAdding = true;
const operator = document.getElementById("operator");
function switchOperator() {
  isAdding = !isAdding;
  if (isAdding) {
    operator.src = "images/1x/Plus.png"
  } else {
    operator.src = "images/1x/Minus.png"
  }
}

function calculateTime() {
  time1Hours = parseInt(focusableFields[0].value);
  time1Minutes = parseInt(focusableFields[1].value);
  time2Hours = parseInt(focusableFields[2].value);
  time2Minutes = parseInt(focusableFields[3].value);
  var minutes = 0;
  var hours = 0;

  if (isAdding) {
    minutes = time1Minutes + time2Minutes;
    hours = time1Hours + time2Hours;

    if (minutes >= 60) {
      minutes = 60 - minutes;
      hours += 1;
    }

    if (hours >= 12) {
      hours = 12 - hours;
    }

    hours = Math.abs(hours).toString();
    minutes = Math.abs(minutes).toString();

    
  } else {
    minutes = (time1Minutes - time2Minutes);
    hours = (time1Hours - time2Hours);

    if (minutes < 0) {
      hours -= 1;
      minutes = 60 - Math.abs(minutes);
    }

    if (hours < 0) {
      hours = 12 - Math.abs(hours);
    }

    minutes = minutes.toString();
    hours = hours.toString();
  }

  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  if (hours.length === 1) {
    hours = "0" + hours;
  }
  console.log(hours);
  if (hours === "00") {hours = 12; }
  return {hours, minutes};
}

const answer = document.getElementById("answer");
function submit() {
  time = calculateTime();
  if (time === null) {return; }

  console.log(time.hours);
  console.log(time.minutes);

  answer.innerText = time.hours + ":" + time.minutes;
}


/**
 * Returns a String with the number formatted to 2 digits long, including a preceeding '0' if necessary.
 * @param {int} Int to be formatted
 */
function formatTimeInt(number) {
  if (number.toString().length < 2) {
    return "0" + number.toString();
  } else {
    return number.toString(); 
  }
}

// [x] Implement smart formatting of times(adding zeros)
// [x]  hours need to recognize numbers over 1 and error numbers over 12
// [x]  minutes need to recognize numbers over 5 and error for numbers over 59
// [x] add the add and subtract button
// [x] obviously do the actual calculations
// [x] display the result with a submit button i guess forgot about that lol
// [x] customize css for mobile
// [ ] support suplementing the current time for either side
