import data from './qtns.json' with { type: 'json' };

let offset = 0
let step = 0;
let questions = data.questions;
// let questions = data.questions.slice(0, 5);
let currentQtn = 0;
let answers = [];

let setUpQuestions = () => {
    let template = document.querySelector('template');
    let cards = document.querySelector('cards');
    cards.innerHTML = ''; // Clear if any
    for (let index = 0; index < questions.length; index++) {
        let question = questions[index];
        let card = document.importNode(template.content, true);
        card.querySelector('qtn').innerText = question.question;
        let input1 = card.childNodes[1].childNodes[3].childNodes[1];
        let input2 = card.childNodes[1].childNodes[5].childNodes[1];
        input1.name = 'qtn-' + index;
        input1.value = question.options[0].love_language;
        input1.addEventListener('click', () => updateScore(input1));
        input2.name = 'qtn-' + index;
        input2.value = question.options[1].love_language;
        input2.addEventListener('click', () => updateScore(input2));

        let span1 = card.childNodes[1].childNodes[3].childNodes[3];
        let span2 = card.childNodes[1].childNodes[5].childNodes[3];
        span1.innerText = question.options[0].choice;
        span2.innerText = question.options[1].choice;
        cards.appendChild(card);
    }
}

let setUpProgressBar = () => {
    document.querySelector('progress').max = questions.length;
}

let setUpSwipeStepSize = () => {
    let card = document.querySelector('card');
    step = card.clientWidth;
}

let updateProgress = () => {
    document.querySelector('progress').value = answers.length;
}

let updateArrows = () => {
    leftArrow.ariaDisabled = currentQtn === 0;
    rightArrow.ariaDisabled = currentQtn >= answers.length || currentQtn === questions.length - 1;
}

let leftArrow;
let rightArrow;

let swipeLeft = () => {
    offset += step;
    document.querySelector('cards').style.translate = offset + 'px';
    currentQtn--;
    updateProgress();
    updateArrows();
}

let onClickLeft = () => {
    if (leftArrow.ariaDisabled === 'true') {
        return;
    }
    swipeLeft();
}

let swipeRight = () => {
    currentQtn++;
    offset -= step;
    document.querySelector('cards').style.translate = offset + 'px';
    updateProgress();
    updateArrows();
}

let onClickRight = () => {
    if (rightArrow.ariaDisabled === 'true') {
        return;
    }
    swipeRight();
}

window.onload = () => {
    let storedAnswers = localStorage.getItem('answers');
    if (storedAnswers?.length > 0) {
        answers = storedAnswers.split(',');
        showResult();
    } else {
        setUpQuestions();
        setUpProgressBar();
        setUpSwipeStepSize();
        setUpArrows();
        adjustArrowPos();
    }
    document.querySelector('result button').addEventListener('click', restart);
}

let setUpArrows = () => {
    leftArrow = document.querySelector('.arrow.left');
    rightArrow = document.querySelector('.arrow.right');
    leftArrow.addEventListener('click', onClickLeft);
    rightArrow.addEventListener('click', onClickRight);
}

let restart = () => {
    localStorage.removeItem('answers');
    answers = [];
    currentQtn = 0;
    document.querySelector('test').ariaHidden = false;
    document.querySelector('result').ariaHidden = true;
    document.querySelector('.test-name').style.visibility = 'visible';
    setUpQuestions();
    setUpProgressBar();
    setUpSwipeStepSize();
    setUpArrows();
    adjustArrowPos();
    document.querySelector('.submit').ariaHidden = true;
}

function updateScore(input) {
    let value = input.value;
    if (currentQtn < answers.length) {
        answers[currentQtn] = value;
    } else {
        answers.push(value);
    }
    if (currentQtn < questions.length - 1) {
        swipeRight();
    } else {
        updateProgress();
        updateArrows();
        showResultButton();
    }
}

let adjustArrowPos = () => {
    let bottomCardPos = document.querySelectorAll('card:first-of-type .ans')[1].offsetTop;
    let arrowPos = leftArrow.offsetTop;
    document.querySelector(':root').style.setProperty('--arrow-correction', bottomCardPos - arrowPos + 'px');
}

let showResultButton = () => {
    let button = document.querySelector('.submit');
    button.ariaHidden = false;
    button.addEventListener('click', showResult);
}

let showResult = () => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    document.querySelector('test').ariaHidden = true;
    document.querySelector('result').ariaHidden = false;
    document.querySelector('.test-name').style.visibility = 'hidden';
}

let languageMap = {
    words: 'Words of Affirmation',
    time: 'Quality Time',
    service: 'Acts of Services',
    gifts: 'Gifts',
    touch: 'Physical Touch'
}

// Draw the chart and set the chart values
function drawChart() {
    let resMap = {};
    console.log('answers', resMap);
    answers.forEach(key => {
        resMap[key] = (resMap[key] || 0) + 1;
    });
    let sortedResult = Object.entries(resMap).sort((a, b) => b[1] - a[1]);
    let result = languageMap[sortedResult[0][0]];
    document.querySelector('.result').innerText = result;
    document.querySelector('img.love-language').src = sortedResult[0][0] + '.svg';
    let detailedResult = `After <b>${result}</b>, your secondary language is <b>${languageMap[sortedResult[1][0]]}</b> and <b>${languageMap[sortedResult[2][0]]}</b>. Finally <b>${languageMap[sortedResult[sortedResult.length - 1][0]]}</b> is your least favourite.`
    document.querySelector('.detailed').innerHTML = detailedResult;

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Love Language');
    dataTable.addColumn('number', 'Score');
    // A column for custom tooltip content
    dataTable.addColumn({ type: 'string', role: 'tooltip' });
    dataTable.addRows([
        [`Words (${percent(resMap.words)}%)`, percent(resMap.words), `Words of Affirmation (${percent(resMap.words)}%)`],
        [`Time (${percent(resMap.time)}%)`, percent(resMap.time), `Quality Time (${percent(resMap.time)}%)`],
        [`Services (${percent(resMap.time)}%)`, percent(resMap.service), `Acts of Services (${percent(resMap.time)}%)`],
        [`Gifts (${percent(resMap.time)}%)`, percent(resMap.gifts), `Gifts (${percent(resMap.time)}%)`],
        [`Touch (${percent(resMap.time)}%)`, percent(resMap.touch), `Physical Touch (${percent(resMap.time)}%)`]
    ]);

    console.log({ dataTable, result })

    let deviceWidth = window.innerWidth;
    let chartWidth = '80%';

    // Optional; add a title and set the width and height of the chart
    var options = {
        height: deviceWidth > 500 ? 400 : deviceWidth,
        legend: 'none',
        pieSliceText: 'label',
        backgroundColor: 'transparent',
        tooltip: {
            text: 'percentage'
        },
        chartArea: { width: chartWidth, height: chartWidth }
    };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'click', (e) => {
        e.preventDefault();
    });

    localStorage.setItem('answers', answers);
}

let percent = (val) => Math.floor(val / questions.length * 100);