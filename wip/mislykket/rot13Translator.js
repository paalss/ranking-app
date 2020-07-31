//filter(document.querySelector("#input"), document.querySelector("#output"));

var object = {
  //array inputText fylles:
  extractWords: function (input) {
    "use strict";
    // window.alert("extractWords");
    this.inputText = input.split(" "); // <--
    console.log('this.inputText: ', this.inputText)
  }, //end extractWords(input)

  // Gå gjennom ordene i arrayen inputText. Fjerne punctuation fra inputText. Huske punctuation i punct.
  filterText: function () {
    "use strict";
    var punct = [];
    // fjerne og huske punctuation
    for (var i = 0; i < object.inputText.length; i++) {
      console.log('object.inputText[i]: ', object.inputText[i])

      if (object.inputText[i].endsWith(".")) {
        object.inputText[i] = object.inputText[i].substring(0, object.inputText[i].length - 1);
        punct[i] = ".";
      } else if (object.inputText[i].endsWith(",")) {
        object.inputText[i] = object.inputText[i].substring(0, object.inputText[i].length - 1);
        punct[i] = ",";
      } else if (object.inputText[i].endsWith("?")) {
        object.inputText[i] = object.inputText[i].substring(0, object.inputText[i].length - 1);
        punct[i] = "?";
      } else {
        punct[i] = "";
      }
      console.log('punct[i]: ', punct[i])
    }

    object.outputText = object.inputText; // sette outputText til inputText

    // Gå gjennom outputText og erstatte ord som matcher badWords med goodWords <---
    for (var i = 0; i < object.outputText.length; i++) {
      for (var ii = 0; ii < object.badWords.length; ii++) {
        if (object.outputText[i] == object.badWords[ii]) {
          object.outputText[i] = object.goodWords[ii]
        }
      }
    }

    // Gå gjennom outputText. legge til punctuation til riktige outputText ord
    for (var i = 0; i < object.outputText.length; i++) {
      object.outputText[i] = object.outputText[i] + punct[i];
    }
  }, //end filterText

  concatWords: function () { // <--
    // window.alert("concatWords");
    object.outputText = object.outputText.join(" "); // gjør om til tekst-string
    output.innerHTML = object.outputText; // sette HTML sitt element med Id output til outputText string
  }, //end concatWords

  filter: function (input, output) {
    this.extractWords(input.value);
    this.filterText();
    this.concatWords(); //output.value = 
  }
} //end var object

var button = document.getElementById("button");
button.addEventListener("click", function () { object.filter(input, output) }, false);