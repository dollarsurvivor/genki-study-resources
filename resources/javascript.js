window.Genki = {
  problems : 0, // number of problems to solve in the lesson
    solved : 0, // number of problems solved
  mistakes : 0, // number of mistakes made in the lesson
     score : 0, // the student's score
   exclude : 0, // answers to exclude
  
  // the current exercise path
  path : '..' + window.location.pathname.replace(/.*?\/lesson-\d+(\/.*)/, '$1'),
  
  // frequently used/generic strings
  lang : {
    std_drag : 'Read the Japanese on the left and drag the word with the same meaning to it.',
    std_kana : 'Drag the Kana to the matching Romaji.',
    std_num : 'Drag the Numbers to the matching Kana.',
    std_kanji : 'Drag the Kana to the matching Kanji.',
    std_multi : 'Solve the problems by choosing the correct answers.',
    std_questions : 'Answer the questions as best as you can.',
    std_culture : 'Answer the questions about Japanese culture as best as you can.',
    mistakes : 'The items outlined in <span class="t-red">red</span> were answered wrong before finding the correct answer. Review these problems before trying again.',
    multi_mistakes : 'The answers you selected that were wrong are outlined in <span class="t-red">red</span>. The correct answers are outlined in <span class="t-orange">orange</span>. Review these problems before trying again.'
  },
  
  
  // scroll to the specified element: Genki.scrollTo('#lesson-3')
  // scrolling can be delayed by passing a value that evaluates to true (true; 1; '.') to the second param; delay
  // the second param is mostly for script generated content, i.e. the exercises, since there's a small delay before the content is visible
  scrollTo : function (el, delay) {
    // check if el is a selector
    if (typeof el == 'string') {
      el = document.querySelector(el);
    }
    
    var scroll = function () {
      document.body.scrollTop = el.offsetTop;
      document.documentElement.scrollTop = el.offsetTop;
    };
    
    // scroll immediately or wait 100ms
    // the latter is for exercises, where there's a slight delay before content is available
    if (delay) {
      window.setTimeout(scroll, 100);
    } else {
      scroll();
    }
    
  },
  
  
  // To generate a quiz simply pass an object with the necessary data (see vocab-1/index.html and other quiz files for examples)
  generateQuiz : function (o) {
    var zone = document.getElementById('quiz-zone'), // area where quizzes are inserted
        
        // review button for drag and drop quizzes
        review = '<div id="review-exercise" class="center clearfix"><button class="button" onclick="Genki.review();">Review</button></div>'; 

    // create a drag and drop quiz
    if (o.type == 'drag') {
      var quiz = '<div id="quiz-info">' + o.info + '</div><div id="question-list">',
          dropList = '<div id="drop-list">',
          keysQ = [],
          keysA,
          i;

      // generate a key list for the quizlet so we can randomly sort questions and answers
      for (i in o.quizlet) {
        keysQ.push(i);
      }
      keysA = keysQ.slice(0);

      // generate the questions
      while (keysQ.length) {
        i = Math.floor(Math.random() * keysQ.length);
        quiz += '<div class="quiz-item">' + keysQ[i] + '</div>';
        dropList += '<div class="quiz-answer-zone" data-text="' + keysQ[i] + '" data-mistakes="0"></div>';
        keysQ.splice(i, 1);
        ++Genki.problems;
      }
      quiz += '</div>' + dropList + '</div>'; // close the question list and add the drop list


      // generate the answers
      quiz += '<div id="answer-list">';
      while (keysA.length) {
        i = Math.floor(Math.random() * keysA.length);
        quiz += '<div class="quiz-item" data-answer="' + keysA[i] + '">' + o.quizlet[keysA[i]] + '</div>';
        keysA.splice(i, 1);
      }
      quiz += '</div>'; // close the answer list

      // add the quiz to the document
      zone.innerHTML = quiz + review;
    }


    // create a kana drag and drop quiz
    else if (o.type == 'kana') {
      var quiz = '<div id="quiz-info">' + o.info + '</div><div id="question-list" class="clear">',
          answers = '<div id="answer-list">',
          kanaList = [],
          kana = o.quizlet,
          i = kana.length - 1,
          k;

      // create the columns for the student to drop the kana into
      for (; i > -1; i--) {
        quiz += '<div class="quiz-column">';

        // insert the romaji and empty container for dropping the kana
        for (k in kana[i]) {
          quiz += 
          '<div class="quiz-item-row">'+
            '<div class="quiz-answer-zone" data-text="' + kana[i][k] + '" data-mistakes="0"></div>'+
            '<div class="quiz-item">' + kana[i][k] + '</div>'+
          '</div>';

          // put the kana into an array for later..
          kanaList.push('<div class="quiz-item" data-answer="' + kana[i][k] + '">' + k + '</div>');
          ++Genki.problems;
        }

        quiz += '</div>'; // close the column
      }

      // randomize the kana order, so the student cannot memorize the locations
      while (kanaList.length) {
        i = Math.floor(Math.random() * kanaList.length);
        answers += kanaList[i];
        kanaList.splice(i, 1);
      }

      // add the kana list to the document
      zone.innerHTML = quiz + '</div>' + answers + '</div>' + review;
    }
    
    
    // create a verb conjugation drag and drop quiz
    else if (o.type == 'verb') {
      var quiz = '<div id="quiz-info">' + o.info + '</div><div id="question-list"><div class="quiz-column-title"></div>',
          dropList = '<div id="drop-list">',
          answers = [],
          keysQ = [],
          keysA,
          columns = -1, i, j;

      // generate a key list for the quizlet so we can randomly sort questions and answers
      for (i in o.quizlet) {
        keysQ.push(i);
      }
      keysA = keysQ.slice(0);
      
      // generate the column titles
      dropList += '<div class="quiz-title-row">';
      while (++columns < o.columns.length) {
        dropList += '<div class="quiz-column-title">' + o.columns[columns] + '</div>';
      }
      dropList += '</div>';

      
      // generate the questions
      while (keysQ.length) {
        columns = -1;
        i = Math.floor(Math.random() * keysQ.length);
        quiz += '<div class="quiz-item">' + keysQ[i] + '</div>';
        
        // create the answer row and contents
        dropList += '<div class="quiz-answer-row">';
        while (++columns < o.columns.length) {
          dropList += '<div class="quiz-answer-zone" data-text="' + keysQ[i] + '-' + columns + '" data-mistakes="0"></div>';
          ++Genki.problems;
        }
        dropList += '</div>';
        
        keysQ.splice(i, 1);
      }
      quiz += '</div>' + dropList + '</div>'; // close the question list and add the drop list


      // generate the answers
      for (i = 0, j = keysA.length; i < j; i++) {
        columns = -1;
        
        while (++columns < o.columns.length) {
          answers.push('<div class="quiz-item" data-answer="' + keysA[i] + '-' + columns + '">' + o.quizlet[keysA[i]][columns] + '</div>');
        }
      }
      
      // randomize the answer list
      quiz += '<div id="answer-list">';
      while (answers.length) {
        i = Math.floor(Math.random() * answers.length);
        
        quiz += answers[i];
        
        answers.splice(i, 1);
      }
      quiz += '</div>'; // close the answer list

      // add the quiz to the document
      zone.innerHTML = quiz + review;
    }
    
    
    // create a writing practice exercise
    else if (o.type == 'writing') {
      var quiz = '<div id="quiz-info">' + o.info + '</div><div id="question-list">',
          columns = o.columns, i;
      
      for (i in o.quizlet) {
        // create a new row
        quiz += '<div class="quiz-answer-row"><div class="quiz-item" data-helper="' + o.quizlet[i] + '">' + i + '</div>';
        
        // insert the writing zones
        while (columns --> 0) {
          quiz += '<div class="writing-zone"><input class="writing-zone-input" type="text" data-answer="' + i + '" data-mistakes="0" tabindex="0"></div>';
          ++Genki.problems;
        }
        
        quiz += '</div>'; // close the row
        columns = o.columns; // reset column value for next iteration
      }

      // add the quiz to the document
      zone.innerHTML = quiz + '</div>' + '<div id="check-answers" class="center"><button class="button" onclick="Genki.checkAnswers();">Check Answers</button></div>';
    }


    // create a multiple choice quiz
    else if (o.type == 'multi') {
      var quiz = '<div id="quiz-info">' + o.info + '</div><div id="question-list">',
          answers = '<div id="answer-list">',
          option = 65, // used for tagging answers as A(65), B(66), C(67)..
          isAnswer = false,
          q = o.quizlet,
          i = 0,
          j = q.length,
          n;

      // create individual blocks for each question and hide them until later
      for (; i < j; i++) {
        quiz += '<div id="quiz-q' + i + '" class="question-block" data-qid="' + (i + 1) + '" style="display:none;"><div class="quiz-multi-question">' + (q[i].question ? q[i].question : q[i].text) + '</div>';

        // ready-only questions contain text only, no answers
        if (q[i].text) {
          quiz += '<div class="quiz-multi-row"><button class="quiz-multi-answer next-question" onclick="Genki.progressQuiz(this, true);">NEXT</button></div>';
          ++Genki.exclude; // exclude this block from the overall score
          
        } else { // standard question block construction
          
          // add answers to the question block
          while (q[i].answers.length) {
            n = Math.floor(Math.random() * q[i].answers.length);

            // answers that begin with "A" are the correct answer. 'ATrue';
            // "!" is for answers that begin with "A", but aren't correct. '!Aomori Nebuta Festival'; lit. ! == NOT(correct)
            if (/^A|^\!/.test(q[i].answers[n])) {

              // marks the option as the correct answer if it begins with "A"
              if (q[i].answers[n].charAt(0) == 'A') {
                isAnswer = true;
              }

              q[i].answers[n] = q[i].answers[n].slice(1);
            }

            quiz += '<div class="quiz-multi-row"><button class="quiz-multi-answer" data-answer="' + isAnswer + '" data-option="' + String.fromCharCode(option++) + '" onclick="Genki.progressQuiz(this);">' + q[i].answers[n] + '</button></div>';
            isAnswer = false;

            q[i].answers.splice(n, 1);
          }
          
        }

        quiz += '</div>'; // ends the question block
        option = 65; // resets the option id so the next answers begin with A, B, C..
        ++Genki.problems; // increment problems number
      }

      // add the multi-choice quiz to the quiz zone
      zone.innerHTML = quiz + '</div><div id="quiz-progress"><div id="quiz-progress-bar"></div></div>';

      // begin the quiz
      Genki.progressQuiz('init');
    }
    
    
    // setup drag and drop if needed
    if (o.type == 'drag' || o.type == 'kana' || o.type == 'verb') {
      // setup drag and drop
      var drake = dragula([document.querySelector('#answer-list')], {
        isContainer : function (el) {
          return el.classList.contains('quiz-answer-zone');
        }
      });

      // check if the answer is correct before dropping the element
      drake.on('drop', function (el, target, source) {
        if (target.dataset.text) { // makes sure the element is a drop zone (data-text == data-answer)

          // if the answer is wrong we'll send the item back to the answer list
          if (el.dataset.answer != target.dataset.text) {
            document.getElementById('answer-list').appendChild(el);

            // global mistakes are incremented along with mistakes specific to problems
            target.dataset.mistakes = ++target.dataset.mistakes;
            ++Genki.mistakes;

          } else {
            target.className += ' answer-correct';

            // when all problems have been solved..
            // stop the timer, show the score, and congratulate the student
            if (++Genki.solved == Genki.problems) {
              Genki.endQuiz();
            }
          }
        }
      });
      
      Genki.drake = drake;
    }


    // setup timer
    var timer = new Timer(),
        clock = document.getElementById('quiz-timer');

    clock.innerHTML = '00:00:00'; // placeholder
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
      clock.innerHTML = timer.getTimeValues().toString()
    });

    Genki.timer = timer;
    
    // indicate the exercise has been loaded in
    document.getElementById('exercise').className += ' content-loaded ' + o.type + '-quiz';

    // jump to the quiz info
    Genki.scrollTo('#quiz-info', true);
  },
  
  
  // increment the progress bar (for multi-choice quizzes)
  incProgressBar : function () {
    var bar = document.getElementById('quiz-progress-bar'),
        progress = Math.floor((Genki.solved+1) / Genki.problems * 100);

    bar.style.width = progress + '%';
    bar.innerHTML = '<span id="quiz-progress-text">' + (Genki.solved+1) + '/' + Genki.problems + '</span>';
  },
  
  
  // show the next question in a multi-choice quiz
  progressQuiz : function (answer, exclude) {
    if (answer == 'init') {
      document.getElementById('quiz-q' + Genki.solved).style.display = '';
      Genki.incProgressBar();

    } else {
      // mark the selected answer for reviews
      answer.className += ' selected-answer';
      
      // hide NEXT button for read-only questions
      if (exclude) {
        answer.parentNode.className += ' hidden-answer';
      }

      // increment mistakes if the chosen answer was wrong and add a class to the parent
      if (answer.dataset.answer == 'false') {
        answer.parentNode.parentNode.className += ' wrong-answer';
        ++Genki.mistakes;
      }

      // if there's another question, show it and hide the last one
      var last = document.getElementById('quiz-q' + Genki.solved++),
          next = document.getElementById('quiz-q' + Genki.solved);
      
      if (next) {
        next.style.display = ''; // show the next question
        last.style.display = 'none'; // hide the prior question
        Genki.incProgressBar();
        
      } else { // end the quiz if there's no new question
        Genki.endQuiz(true);

        // show all questions and answers
        for (var q = document.querySelectorAll('[id^="quiz-q"]'), i = 0, j = q.length; i < j; i++) {
          q[i].style.display = '';
        }

        // hide the progress bar
        document.getElementById('quiz-progress').style.display = 'none';
      }
    }
  },
  
  
  // ends the quiz
  endQuiz : function (multi) {
    // calculate the total score based on problems solved and mistakes made
    var solved = Genki.solved - Genki.exclude,
        problems = Genki.problems - Genki.exclude;
    
    Genki.score = Math.floor((solved - Genki.mistakes) * 100 / problems);
    Genki.timer.stop();

    // hide the timer and store it so we can show the completion time in the results
    var timer = document.getElementById('quiz-timer');
    timer.style.display = 'none';

    // show the student their results
    document.getElementById('quiz-result').innerHTML = 
    '<div id="complete-banner" class="center">Quiz Complete!</div>'+
    '<div id="result-list">'+
      '<div class="result-row"><span class="result-label">Problems Solved:</span>' + problems + '</div>'+
      '<div class="result-row"><span class="result-label">Answers Wrong:</span>' + Genki.mistakes + '</div>'+
      '<div class="result-row"><span class="result-label">Score:</span>' + Genki.score + '%</div>'+
      '<div class="result-row"><span class="result-label">Completion Time:</span>' + timer.innerHTML + '</div>'+
      '<div class="result-row center">'+
        ( // depending on the score, a specific message will show
          Genki.score == 100 ? 'PERFECT! Great Job, you have mastered this quiz! Feel free to move on or challenge yourself by trying to beat your completion time.' :
          Genki.score > 70 ? 'Nice work! ' + Genki.lang[multi ? 'multi_mistakes' : 'mistakes'] :
          'Keep studying! ' + Genki.lang[multi ? 'multi_mistakes' : 'mistakes']
        )+
        '<div class="center">'+
          '<a href="' + Genki.path + '" class="button">Try Again</a>'+
          '<a href="' + document.getElementById('home-link').href + '" class="button">Back to Index</a>'+
        '</div>'+
      '</div>'+
    '</div>';

    // this class will indicate the quiz is over so post-test styles can be applied
    document.getElementById('exercise').className += ' quiz-over';
    Genki.scrollTo('#complete-banner', true); // jump to the quiz results
  },
  
  
  // check the answers for writing exercises
  checkAnswers : function () {
    // ask for confirmation, just in case the button was clicked by accident
    if (confirm('Checking your answers will end the quiz. Do you want to continue?')) {
      
      // hide check answers button
      document.getElementById('check-answers').style.display = 'none';

      // loop over the inputs and check to see if the answers are correct
      var input = document.querySelectorAll('.writing-zone-input'),
          i = 0, j = input.length;

      for (; i < j; i++) {
        
        // increment mistakes if the answer is incorrect
        if (input[i].value != input[i].dataset.answer) {
          input[i].dataset.mistakes = ++input[i].dataset.mistakes;
          ++Genki.mistakes;
        }
        
        // add classname to correct answers
        else {
          input[i].parentNode.className += ' answer-correct';  
        }
        
        // increment problems solved
        ++Genki.solved;
      }
      
      Genki.endQuiz(); // show quiz results
    }
  },
  
  
  // places draggable items into their correct places
  // allows the student to review meanings without having to consult their textbook
  review : function () {
    // ask for confirmation, just in case the button was clicked by accident
    if (confirm('Are you sure you want to review? Your current progress will be lost.')) {
      var a = document.querySelectorAll('[data-answer]'),
          i = 0,
          j = a.length;

      for (; i < j; i++) {
        document.querySelector('[data-text="' + a[i].dataset.answer + '"]').appendChild(a[i]);
      }

      // stop and hide timer + drag/drop
      Genki.timer.stop();
      Genki.drake.destroy();
      document.getElementById('quiz-timer').style.display = 'none';
      
      // show restart button
      document.getElementById('review-exercise').innerHTML = '<a href="' + Genki.path + '" class="button">Restart</a>';
      
      // change the quiz info
      document.getElementById('quiz-info').innerHTML = 'You are currently in review mode; go ahead and take your time to study. When you are ready to practice this exercise, click the "restart" button.';
    }
  },
  
  
  // toggle the exercise list
  toggleExercises : function () {
    var list = document.getElementById('exercise-list');
    list.className = list.className == 'list-open' ? '' : 'list-open';
  },
  
  
  // toggles the display of lists
  toggleList : function (el) {
    var closed = 'lesson-title',
        opened = closed + ' lesson-open';
    
    el.className = el.className == opened ? closed : opened;
    
    // close any open lists
    for (var a = el.parentNode.querySelectorAll('.lesson-title'), i = 0, j = a.length; i < j; i++) {
      if (a[i] != el) {
        a[i].className = closed;
      }
    }
  }
};


// # PAGE MODIFICATIONS #
(function () {
  var fileSys = false; // tells if GSR is being used on the local filesystem
  
  // # OFFLINE VERSION FUNCTIONS #
  if (window.location.protocol == 'file:') {
    
    // # LINK MODIFICATIONS #
    // append index.html to links if this project is hosted on the local file system
    // it makes browsing easier offline, since otherwise links will just open the directory and not the file
    for (var a = document.querySelectorAll('a[href$="/"]'), i = 0, j = a.length; i < j; i++) {
      if (!/http/.test(a[i].href)) {
        a[i].href += 'index.html';
      }
    }
    
    fileSys = true;
  }
  
  Genki.local = fileSys; // for use on other pages

  
  // # LESSON SPECIFIC FUNCTIONS #
  if (/\/lessons\//.test(window.location.pathname)) {
    
    // # PREV/NEXT EXERCISE BUTTONS #
    // show prev/next exercise if currently viewing one
    var title = { // title list
      workbook : 'title|Workbook',
      literacy : 'title|Reading and Writing'
    },
    
    exercises = [ // exercise list
      
      // Pre-Lesson
      'lesson-0/hiragana-1|Hiragana|p.24-25',
      'lesson-0/hiragana-2|Hiragana: Diacritical Marks|p.25',
      'lesson-0/hiragana-3|Hiragana: Combos|p.25-26',
      'lesson-0/katakana-1|Katakana|p.28',
      'lesson-0/katakana-2|Katakana: Diacritical Marks|p.28-29',
      'lesson-0/katakana-3|Katakana: Combos|p.29',
      'lesson-0/katakana-4|Katakana: Additional Combos|p.30',
      'lesson-0/match-1|Match: Hiragana and Katakana|p.24 & 28',
      'lesson-0/greetings|Greetings|p.34-35',
      'lesson-0/greetings-practice|Practice: Greetings|p.37',
      'lesson-0/culture-1|Culture Note: Greetings and Bowing|p.37',
      title.workbook,
      'lesson-0/workbook-1|Workbook: Greetings|p.11-12',
      
      // Lesson 1
      'lesson-1/vocab-1|Vocabulary: Part 1|p.40',
      'lesson-1/vocab-2|Vocabulary: Part 2|p.40',
      'lesson-1/vocab-3|Vocabulary: Countries|p.41',
      'lesson-1/vocab-4|Vocabulary: Majors|p.41',
      'lesson-1/vocab-5|Vocabulary: Occupations|p.41',
      'lesson-1/vocab-6|Vocabulary: Family|p.41',
      'lesson-1/culture-1|Culture Note: Japanese Names|p.45',
      'lesson-1/numbers-1|Numbers: 0-10|p.46-47',
      'lesson-1/numbers-2|Numbers: 11-20, 30, 40...|p.48',
      'lesson-1/numbers-3|Practice: Numbers|p.48; I-A, B & C',
      'lesson-1/time-1|Time|p.49',
      'lesson-1/time-2|Practice: Time|p.49-50; II-A & B',
      'lesson-1/phone-1|Practice: Telephone Numbers|p.50; III-A',
      'lesson-1/grammar-1|Practice: の|p.51; IV',
      'lesson-1/grammar-2|Practice: Describing People|p.51-52; V-A',
      'lesson-1/grammar-3|Practice: Q&A|p.52-53; V-B',
      'lesson-1/grammar-4|Practice: Describing People 2|p.53-54; VI-A',
      'lesson-1/grammar-5|Practice: Q&A 2|p.54; VI-B',
      'lesson-1/time-3|Time: Minutes|p.57',
      'lesson-1/age-1|Age|p.57',
      'lesson-1/vocab-7|Bonus Vocabulary: Words in Genki|p.24-57',
      title.workbook,
      'lesson-1/workbook-1|Workbook: Numbers|p.13',
      'lesson-1/workbook-2|Workbook: Time|p.14; I',
      'lesson-1/workbook-3|Workbook: Telephone Numbers|p.14; II',
      'lesson-1/workbook-4|Workbook: NounのNoun|p.15; I',
      'lesson-1/workbook-5|Workbook: XはYです|p.15; II',
      'lesson-1/workbook-6|Workbook: Question Sentences|p.16; I & II',
      'lesson-1/workbook-7|Workbook: Questions|p.19',
      title.literacy,
      'lesson-1/literacy-1|Hiragana Practice: Identifying Hiragana|p.290; I-A',
      'lesson-1/literacy-2|Hiragana Practice: Word Match|p.290; I-B',
      'lesson-1/literacy-3|Hiragana Practice: Diacritical Marks|p.290; I-E',
      'lesson-1/literacy-4|Hiragana Practice: Combos|p.290; I-F',
      'lesson-1/literacy-5|Hiragana Practice: Rearrange|p.291; I-H',
      'lesson-1/literacy-6|Reading Practice|p.292-293; II',
      title.workbook,
      'lesson-1/workbook-8|Workbook: Hiragana Writing Practice (あ-こ)|p.117; I',
      
      // Lesson 2
      'lesson-2/vocab-1|Vocabulary: Words that Point|p.60',
      'lesson-2/vocab-2|Vocabulary: Food|p.60',
      'lesson-2/vocab-3|Vocabulary: Things|p.60-61',
      'lesson-2/vocab-4|Vocabulary: Places|p.61',
      'lesson-2/vocab-5|Vocabulary: Money and Expressions|p.61',
      'lesson-2/culture-1|Culture Note: Japanese Currency|p.68',
      'lesson-2/numbers-1|Numbers: Hundreds|p.69',
      'lesson-2/numbers-2|Numbers: Thousands|p.69',
      'lesson-2/numbers-3|Numbers: Ten Thousands|p.69',
      'lesson-2/numbers-4|Practice: Numbers|p.69; I-A',
      'lesson-2/numbers-5|Practice: Prices|p.69-70; I-B',
      'lesson-2/grammar-1|Practice: これ, それ, and あれ|p.71-72; II-A & B',
      'lesson-2/grammar-2|Practice: この, その, and あの|p.72-73; III-A',
      'lesson-2/grammar-3|Practice: Asking for Directions|p.74; IV',
      'lesson-2/grammar-4|Practice: Giving Directions|p.74; IV',
      'lesson-2/grammar-5|Practice: も|p.75-76; VI',
      'lesson-2/grammar-6|Practice: Negative Statements|p.76; VII-A',
      'lesson-2/vocab-6|Bonus Vocabulary: Food|p.79',
      'lesson-2/vocab-7|Bonus Vocabulary: Classroom Objects|p.83',
      'lesson-2/vocab-8|Useful Expressions: In the Classroom|p.83',
      title.workbook,
      'lesson-2/workbook-1|Workbook: Numbers|p.20; I, II, & III',
      'lesson-2/workbook-2|Workbook: これ, それ, and あれ|p.21; I & II',
      'lesson-2/workbook-3|Workbook: この, その, and あの|p.22',
      'lesson-2/workbook-4|Workbook: ここ, そこ, and あそこ・だれの|p.23; I & II',
      'lesson-2/workbook-5|Workbook: Noun も|p.24; I',
      'lesson-2/workbook-6|Workbook: Noun じゃないです|p.24; II',
      'lesson-2/workbook-7|Workbook: Questions|p.26',
      
      // Lesson 3
      'lesson-3/vocab-1|Vocabulary: Entertainment and Sports|p.86',
      'lesson-3/vocab-2|Vocabulary: Food and Drinks|p.86',
      'lesson-3/kanji-1|Kanji: Entertainment and Food|p.86',
      'lesson-3/vocab-3|Vocabulary: Places and Time|p.86-87',
      'lesson-3/kanji-2|Kanji: Places and Time|p.86-87',
      'lesson-3/vocab-4|Vocabulary: U-verbs|p.87',
      'lesson-3/kanji-3|Kanji: U-verbs|p.87',
      'lesson-3/vocab-5|Vocabulary: Ru-verbs and Irregular verbs|p.87',
      'lesson-3/vocab-6|Vocabulary: Adverbs|p.87',
      'lesson-3/vocab-7|Vocabulary: Adjectives and Expressions|p.87',
      'lesson-3/kanji-4|Kanji: Verbs and Adjectives|p.87',
      'lesson-3/grammar-1|Practice: Verb Conjugation|p.95; I-A',
      'lesson-3/grammar-2|Practice: を and で|p.95-96; I-B',
      'lesson-3/grammar-3|Practice: Indicating the Goal of Movement|p.96; I-C',
      'lesson-3/grammar-4|Practice: Time Expressions|p.98; II-A',
      'lesson-3/grammar-5|Practice: Time Expressions 2|p.98; II-C',
      'lesson-3/grammar-6|Practice: Making Suggestions|p.99; III-A',
      'lesson-3/culture-1|Culture Note: Japanese Houses|p.101',
      title.workbook,
      'lesson-3/workbook-1|Workbook: Verb Conjugation|p.27',
      'lesson-3/workbook-2|Workbook: Noun を Verb|p.28',
      'lesson-3/workbook-3|Workbook: Verbs with Places|p.29; I & II',
      'lesson-3/workbook-4|Workbook: Time Expressions|p.30; I',
      'lesson-3/workbook-5|Workbook: Time References|p.30; II & III',
      'lesson-3/workbook-6|Workbook: Suggestion Using ～ませんか|p.31; I & II',
      'lesson-3/workbook-7|Workbook: Frequency Adverbs|p.32',
      'lesson-3/workbook-8|Workbook: Questions|p.35',
      
      // Lesson 4
      'lesson-4/vocab-1|Vocabulary: People and Things|p.104',
      'lesson-4/kanji-1|Kanji: People and Things|p.104',
      'lesson-4/vocab-2|Vocabulary: Activities and Places|p.104',
      'lesson-4/kanji-2|Kanji: Activities and Places|p.104',
      'lesson-4/vocab-3|Vocabulary: Time|p.105',
      'lesson-4/kanji-3|Kanji: Time|p.105',
      'lesson-4/vocab-4|Vocabulary: U-verbs and Ru-verbs|p.105',
      'lesson-4/vocab-5|Vocabulary: Adverbs and Expressions|p.105',
      'lesson-4/kanji-4|Kanji: Verbs|p.105',
      'lesson-4/vocab-6|Vocabulary: Location Words|p.106',
      'lesson-4/kanji-5|Kanji: Location Words|p.106',
      'lesson-4/culture-1|Culture Note: Japanese National Holidays|p.114',
      'lesson-4/grammar-1|Practice: Ｘがあります|p.116; I-C',
      'lesson-4/grammar-2|Practice: Describing Locations|p.117; II-A & B',
      'lesson-4/grammar-3|Practice: Past Tense of です|p.118; III-A',
      'lesson-4/grammar-4|Practice: Past Tense of Verbs|p.120; IV-A',
      'lesson-4/grammar-5|Practice: Past Tense|p.120; IV-B',
      'lesson-4/grammar-6|Practice: Past Tense 2|p.121; IV-C & D',
      'lesson-4/grammar-7|Practice: も|p.122; V-A',
      'lesson-4/grammar-8|Practice: Descriptions Using も|p.122-123; V-B',
      'lesson-4/grammar-9|Practice: ～時間|p.123; VI-A',
      'lesson-4/vocab-7|Bonus Vocabulary: Days 1-15|p.127',
      'lesson-4/vocab-8|Bonus Vocabulary: Days 16-31|p.127',
      'lesson-4/vocab-9|Bonus Vocabulary: Months|p.127',
      'lesson-4/kanji-6|Bonus Kanji: Months|p.127',
      'lesson-4/vocab-10|Useful Expressions: Time Words|p.127',
      'lesson-4/kanji-7|Useful Expressions: Time Words Kanji|p.127',
      title.workbook,
      'lesson-4/workbook-1|Workbook: Ｘがあります／います|p.36; I & II',
      'lesson-4/workbook-2|Workbook: Describing Where Things Are|p.37; I & II',
      'lesson-4/workbook-3|Workbook: Past Tense (Nouns)|p.38; I & II',
      'lesson-4/workbook-4|Workbook: Verb Conjugation (Past Tense)|p.39',
      'lesson-4/workbook-5|Workbook: Past Tense (Verbs)|p.40; I & II',
      'lesson-4/workbook-6|Workbook: も|p.41',
      'lesson-4/workbook-7|Workbook: ～時間・Particles|p.42; I & II',
      'lesson-4/workbook-8|Workbook: Questions|p.44',
      
      // Lesson 5
      'lesson-5/vocab-1|Vocabulary: Nouns|p.130',
      'lesson-5/kanji-1|Kanji: Nouns|p.130',
      'lesson-5/vocab-2|Vocabulary: い-adjectives|p.130-131',
      'lesson-5/kanji-2|Kanji: い-adjectives|p.130-131',
      'lesson-5/vocab-3|Vocabulary: な-adjectives|p.131',
      'lesson-5/kanji-3|Kanji: な-adjectives|p.131',
      'lesson-5/vocab-4|Vocabulary: Verbs and Expressions|p.131',
      'lesson-5/kanji-4|Kanji: Verbs and Expressions|p.131',
      'lesson-5/grammar-1|Practice: Present Affirmative Adjectives|p.137; I-A',
      'lesson-5/grammar-2|Practice: Present Negative Adjectives|p.137; I-B',
      'lesson-5/grammar-3|Practice: Present Adjectives|p.137-138; I-C',
      'lesson-5/grammar-4|Practice: Present Adjectives 2|p.138; I-D',
      'lesson-5/grammar-5|Practice: Past Affirmative Adjectives|p.139; II-A',
      'lesson-5/grammar-6|Practice: Past Negative Adjectives|p.139; II-B',
      'lesson-5/grammar-7|Practice: Past Adjectives|p.139; II-C',
      'lesson-5/grammar-8|Practice: Past Adjectives 2|p.140; II-D',
      'lesson-5/grammar-9|Practice: Modifying Nouns with Adjectives|p.140; III-A',
      'lesson-5/grammar-10|Practice: Describing People with Adjectives|p.141; III-B',
      'lesson-5/grammar-11|Practice: 好き(な)／きらい(な)|p.141; IV-A',
      'lesson-5/grammar-12|Practice: 好き(な)／きらい(な) 2|p.141; IV-B',
      'lesson-5/grammar-13|Practice: ～ましょう|p.142; V-A',
      'lesson-5/culture-1|Culture Note: Japanese Festivals|p.144',
      'lesson-5/vocab-5|Bonus Vocabulary: At the Post Office|p.145',
      'lesson-5/kanji-5|Bonus Kanji: At the Post Office|p.145',
      'lesson-5/vocab-6|Useful Expressions: At the Post Office|p.145',
      title.workbook,
      'lesson-5/workbook-1|Workbook: Adjective Conjugation (Present Tense)|p.45',
      'lesson-5/workbook-2|Workbook: Adjectives (Present Tense)|p.46; I & II',
      'lesson-5/workbook-3|Workbook: Adjective Conjugation (Present and Past Tenses)|p.47',
      'lesson-5/workbook-4|Workbook: Adjectives (Past Tense)|p.48; I & II',
      'lesson-5/workbook-5|Workbook: Adjective + Noun|p.49; I & II',
      'lesson-5/workbook-6|Workbook: 好き(な)／きらい(な)|p.50',
      'lesson-5/workbook-7|Workbook: ～ましょう|p.51; I & II',
      'lesson-5/workbook-8|Workbook: Questions|p.53; I & II'
    ],
    i = 0,
    j = exercises.length,
    k, a,
    timer = document.getElementById('quiz-timer'),
    current = window.location.pathname.replace(/.*?\/lessons\/(.*?\/.*?)\/.*/g, '$1'),
    more = '<div id="more-exercises" class="clear">',
    activeLesson;
    
    // find the current exercise
    for (; i < j; i++) {
      if (current == exercises[i].split('|')[0]) {
        break;
      }
    }
    
    // update the active lesson
    activeLesson = exercises[i] ? exercises[i].split('|') : null;
    
    // create the prev/next exercise links
    j = 2;
    while (j --> 0) {
      a = exercises[j == 1 ? i - 1 : i + 1]; // the prev/next exercise; j=1 is prev, j=0 is next
      
      // if there's a prev/next exercise we'll add the link to more
      if (a) {
        a = a.split('|');
        
        // correct the next/prev exercise if it was a title
        if (a[0] == 'title') {
          a = exercises[j == 1 ? i - 2 : i + 2].split('|');
        }
        
        // create the next/prev link
        more += '<a href="../../../lessons/' + a[0] + (fileSys ? '/index.html' : '/') + '" class="button ' + (j == 1 ? 'prev' : 'next') + '-ex" title="' + (j == 1 ? 'Previous' : 'Next') + ' exercise">' + a[1] + '</a>';
      }
    }
    
    // add exercise title to the document
    document.getElementById('quiz-result').insertAdjacentHTML('beforebegin', '<h2 id="exercise-title" class="center">' + (activeLesson ? ('第' + activeLesson[0].replace(/lesson-(\d+).*/, '$1') + '課 - ' + activeLesson[1]) : document.querySelector('TITLE').innerText.replace(/\s\|.*/, '')) + '</h2>');
    
    // add the "more exercises" buttons to the document
    timer.insertAdjacentHTML('afterend', more + '</div>');
    
    
    // # EXERCISE LIST #
    // Create the exercise list
    var list = '<nav id="exercise-list"><h3 class="main-title">Exercise List</h3><div id="lessons-list"><h4 class="lesson-title" onclick="Genki.toggleList(this);">Pre-Lesson</h4><ul id="lesson-0">',
        lesson = 'lesson-0',
        workbook = false,
        linkData;
    
    // loop over all the exercises and place them into their respectice lesson group
    for (i = 0, j = exercises.length; i < j; i++) {
      linkData = exercises[i].split('|');
      
      // if the lesson group is different create a new group
      if (linkData[0] != 'title' && !new RegExp(lesson).test(linkData[0])) {
        lesson = linkData[0].replace(/(lesson-\d+)\/.*/, '$1');
        list += '</ul><h4 class="lesson-title" onclick="Genki.toggleList(this);">' + lesson.charAt(0).toUpperCase() + lesson.replace(/-/, ' ').slice(1) + '</h4><ul id="' + lesson + '">';
      }
      
      // add a header to separate the workbook from the textbook exercises
      if (linkData[0] == 'title') {
        list += '<li><h4 class="sub-lesson-title">' + linkData[1] + '</h4></li>';
        
      } else {
        // add the exercise link to the group
        list += '<li><a href="../../../lessons/' + linkData[0] + (fileSys ? '/index.html' : '/') + '" data-page="' + linkData[2] + '" title="' + linkData[1] + '">' + linkData[1] + '</a></li>';
      }
      
    }
    
    // add the exercise list to the document
    document.getElementById('content').insertAdjacentHTML('afterbegin', list + '</ul></div></nav><div id="toggle-exercises" onclick="Genki.toggleExercises();" title="Toggle exercise list"></div>');
    
    if (activeLesson) { // open the current lesson
      Genki.toggleList(document.getElementById(activeLesson[0].replace(/(lesson-\d+)\/.*/, '$1')).previousSibling);

      // highlight the active exercise and scoll to it
      var active = document.querySelector('a[href*="' + activeLesson[0] + '"]');
      active.className += ' active-lesson';
      
      // jump to the active exercise
      document.getElementById('lessons-list').scrollTop = active.offsetTop - (active.getBoundingClientRect().height + (window.matchMedia && matchMedia('(pointer:coarse)').matches ? 0 : 6));
    }
  }
  
}());