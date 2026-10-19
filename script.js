/* =========================================================
   SORTING VISUALIZER
   ========================================================= */
let sortInProgress = false;
let speed = 100;
const BAR_COUNT = 40;

function generateBars() {
  if (sortInProgress) return;
  const container = document.getElementById('sortBars');
  container.innerHTML = '';
  for (let i = 0; i < BAR_COUNT; i++) {
    const value = Math.floor(Math.random() * 85) + 15;
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = value + '%';
    container.appendChild(bar);
  }
}

function updateSpeed() {
  const val = +document.getElementById('speedRange').value;
  // Nilai lebih tinggi = lebih lambat (delay ms)
  speed = val;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startSort(type) {
  if (sortInProgress) return;
  switch (type) {
    case 'bubble':    bubbleSort(); break;
    case 'selection': selectionSort(); break;
    case 'insertion': insertionSort(); break;
    case 'quick':     quickSort(); break;
  }
}

/* ----- BUBBLE SORT ----- */
async function bubbleSort() {
  sortInProgress = true;
  const bars = document.querySelectorAll('#sortBars .bar');
  const n = bars.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      bars[j].classList.add('compare');
      bars[j + 1].classList.add('compare');
      await sleep(speed);

      const h1 = parseFloat(bars[j].style.height);
      const h2 = parseFloat(bars[j + 1].style.height);

      if (h1 > h2) {
        bars[j].style.height = h2 + '%';
        bars[j + 1].style.height = h1 + '%';
        bars[j].classList.add('swap');
        bars[j + 1].classList.add('swap');
        await sleep(speed);
        bars[j].classList.remove('swap');
        bars[j + 1].classList.remove('swap');
      }
      bars[j].classList.remove('compare');
      bars[j + 1].classList.remove('compare');
    }
    bars[n - i - 1].classList.add('sorted');
  }
  bars[0].classList.add('sorted');
  sortInProgress = false;
}

/* ----- SELECTION SORT ----- */
async function selectionSort() {
  sortInProgress = true;
  const bars = document.querySelectorAll('#sortBars .bar');
  const n = bars.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    bars[minIdx].classList.add('pivot');

    for (let j = i + 1; j < n; j++) {
      bars[j].classList.add('compare');
      await sleep(speed);
      const hMin = parseFloat(bars[minIdx].style.height);
      const hJ = parseFloat(bars[j].style.height);
      if (hJ < hMin) {
        bars[minIdx].classList.remove('pivot');
        minIdx = j;
        bars[minIdx].classList.remove('compare');
        bars[minIdx].classList.add('pivot');
      } else {
        bars[j].classList.remove('compare');
      }
    }

    if (minIdx !== i) {
      const h1 = parseFloat(bars[i].style.height);
      const h2 = parseFloat(bars[minIdx].style.height);
      bars[i].style.height = h2 + '%';
      bars[minIdx].style.height = h1 + '%';
      bars[i].classList.add('swap');
      bars[minIdx].classList.add('swap');
      await sleep(speed);
      bars[i].classList.remove('swap');
      bars[minIdx].classList.remove('swap');
    }
    bars[minIdx].classList.remove('pivot');
    bars[i].classList.add('sorted');
  }
  bars[n - 1].classList.add('sorted');
  sortInProgress = false;
}

/* ----- INSERTION SORT ----- */
async function insertionSort() {
  sortInProgress = true;
  const bars = document.querySelectorAll('#sortBars .bar');
  const n = bars.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      bars[j - 1].classList.add('compare');
      bars[j].classList.add('compare');
      await sleep(speed);

      const hPrev = parseFloat(bars[j - 1].style.height);
      const hCur = parseFloat(bars[j].style.height);
      let swapped = false;

      if (hPrev > hCur) {
        bars[j - 1].style.height = hCur + '%';
        bars[j].style.height = hPrev + '%';
        bars[j - 1].classList.add('swap');
        bars[j].classList.add('swap');
        swapped = true;
        await sleep(speed);
        bars[j - 1].classList.remove('swap');
        bars[j].classList.remove('swap');
      }

      bars[j - 1].classList.remove('compare');
      bars[j].classList.remove('compare');

      if (swapped) j--;
      else break;
    }
  }
  bars.forEach(b => b.classList.add('sorted'));
  sortInProgress = false;
}

/* ----- QUICK SORT ----- */
async function quickSort() {
  sortInProgress = true;
  const bars = document.querySelectorAll('#sortBars .bar');
  await quickSortHelper(bars, 0, bars.length - 1);
  bars.forEach(b => b.classList.add('sorted'));
  sortInProgress = false;
}

async function quickSortHelper(bars, low, high) {
  if (low < high) {
    const pi = await partition(bars, low, high);
    await quickSortHelper(bars, low, pi - 1);
    await quickSortHelper(bars, pi + 1, high);
  }
}

async function partition(bars, low, high) {
  const pivotH = parseFloat(bars[high].style.height);
  bars[high].classList.add('pivot');
  let i = low - 1;

  for (let j = low; j < high; j++) {
    bars[j].classList.add('compare');
    await sleep(speed);
    const hJ = parseFloat(bars[j].style.height);

    if (hJ < pivotH) {
      i++;
      const hI = parseFloat(bars[i].style.height);
      bars[i].style.height = hJ + '%';
      bars[j].style.height = hI + '%';
      bars[i].classList.add('swap');
      bars[j].classList.add('swap');
      await sleep(speed);
      bars[i].classList.remove('swap');
      bars[j].classList.remove('swap');
    }
    bars[j].classList.remove('compare');
  }

  const hI1 = parseFloat(bars[i + 1].style.height);
  bars[i + 1].style.height = pivotH + '%';
  bars[high].style.height = hI1 + '%';
  bars[high].classList.remove('pivot');
  bars[i + 1].classList.add('sorted');
  return i + 1;
}

/* =========================================================
   SEARCHING VISUALIZER
   ========================================================= */
let searchArray = [];
let searchInProgress = false;

function generateSearchArray() {
  if (searchInProgress) return;
  const container = document.getElementById('searchArray');
  container.innerHTML = '';
  searchArray = [];

  let value = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < 20; i++) {
    value += Math.floor(Math.random() * 8) + 1;
    searchArray.push(value);
    const cell = document.createElement('div');
    cell.className = 'search-cell';
    cell.textContent = value;
    container.appendChild(cell);
  }
}

function resetSearchCells() {
  document.querySelectorAll('.search-cell').forEach(c => {
    c.classList.remove('active', 'visited', 'found');
  });
}

async function runSearch(type) {
  if (searchInProgress) return;
  const targetInput = document.getElementById('searchTarget');
  const target = parseInt(targetInput.value);
  if (isNaN(target)) {
    alert('Masukkan angka yang ingin dicari terlebih dahulu!');
    return;
  }
  resetSearchCells();
  searchInProgress = true;

  if (type === 'linear') await linearSearch(target);
  else await binarySearch(target);

  searchInProgress = false;
}

async function linearSearch(target) {
  const cells = document.querySelectorAll('.search-cell');
  for (let i = 0; i < searchArray.length; i++) {
    cells[i].classList.add('active');
    await sleep(280);
    if (searchArray[i] === target) {
      cells[i].classList.remove('active');
      cells[i].classList.add('found');
      return;
    }
    cells[i].classList.remove('active');
    cells[i].classList.add('visited');
  }
  await sleep(300);
  alert(`❌ Angka ${target} tidak ditemukan (Linear Search).`);
}

async function binarySearch(target) {
  const cells = document.querySelectorAll('.search-cell');
  let left = 0;
  let right = searchArray.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    cells[mid].classList.add('active');
    await sleep(600);

    if (searchArray[mid] === target) {
      cells[mid].classList.remove('active');
      cells[mid].classList.add('found');
      return;
    }
    cells[mid].classList.remove('active');
    cells[mid].classList.add('visited');

    if (searchArray[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  await sleep(300);
  alert(`❌ Angka ${target} tidak ditemukan (Binary Search).`);
}

/* =========================================================
   PLAYGROUND
   ========================================================= */
function runCode() {
  const code = document.getElementById('codeInput').value;
  const output = document.getElementById('output');
  output.innerHTML = '';

  const originalLog = console.log;

  // Override console.log agar output tampil di UI
  console.log = (...args) => {
    const line = document.createElement('div');
    line.textContent = args
      .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
      .join(' ');
    output.appendChild(line);
  };

  try {
    const result = new Function(code)();
    if (result !== undefined) {
      const line = document.createElement('div');
      line.textContent = '=> ' + String(result);
      line.style.color = '#fbbf24';
      output.appendChild(line);
    }
    if (output.children.length === 0) {
      const line = document.createElement('div');
      line.textContent = '(Kode berjalan tanpa output)';
      line.style.color = '#94a3b8';
      output.appendChild(line);
    }
  } catch (err) {
    const line = document.createElement('div');
    line.textContent = '⚠ Error: ' + err.message;
    line.style.color = '#ef4444';
    output.appendChild(line);
  } finally {
    console.log = originalLog;
  }
}

function clearOutput() {
  document.getElementById('output').innerHTML = '';
}

/* =========================================================
   QUIZ
   ========================================================= */
const quizData = [
  {
    question: 'Apa kompleksitas waktu rata-rata dari algoritma Quick Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correct: 1
  },
  {
    question: 'Algoritma searching mana yang memerlukan data dalam keadaan terurut?',
    options: ['Linear Search', 'Binary Search', 'DFS', 'BFS'],
    correct: 1
  },
  {
    question: 'Struktur data apa yang menerapkan prinsip LIFO (Last In First Out)?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correct: 1
  },
  {
    question: 'Manakah yang BUKAN termasuk algoritma sorting?',
    options: ['Bubble Sort', 'Merge Sort', 'Dijkstra', 'Insertion Sort'],
    correct: 2
  },
  {
    question: 'Kompleksitas waktu Binary Search adalah...',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correct: 2
  }
];

let quizAnswered = 0;
let quizCorrect = 0;

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = '';
  quizAnswered = 0;
  quizCorrect = 0;

  quizData.forEach((q, qIndex) => {
    const item = document.createElement('div');
    item.className = 'quiz-item';

    const questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.textContent = `${qIndex + 1}. ${q.question}`;
    item.appendChild(questionEl);

    const optionsEl = document.createElement('div');
    optionsEl.className = 'quiz-options';

    q.options.forEach((opt, oIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = `${String.fromCharCode(65 + oIndex)}. ${opt}`;

      btn.addEventListener('click', () => {
        const buttons = optionsEl.querySelectorAll('.quiz-option');
        buttons.forEach(b => (b.disabled = true));

        if (oIndex === q.correct) {
          btn.classList.add('selected-correct');
          item.classList.add('correct');
          quizCorrect++;
        } else {
          btn.classList.add('selected-wrong');
          item.classList.add('wrong');
          buttons[q.correct].classList.add('selected-correct');
        }

        quizAnswered++;
        if (quizAnswered === quizData.length) {
          showQuizResult();
        }
      });

      optionsEl.appendChild(btn);
    });

    item.appendChild(optionsEl);
    container.appendChild(item);
  });

  document.getElementById('quizResult').classList.add('hidden');
}

function showQuizResult() {
  const result = document.getElementById('quizResult');
  const percent = Math.round((quizCorrect / quizData.length) * 100);
  let message = '';

  if (percent === 100) message = '🏆 Sempurna! Kamu jago algoritma!';
  else if (percent >= 80) message = '🎉 Hebat! Pemahamanmu sangat baik.';
  else if (percent >= 60) message = '👍 Bagus! Sedikit lagi ya.';
  else if (percent >= 40) message = '📚 Perlu belajar lebih giat lagi.';
  else message = '💪 Jangan menyerah, terus belajar!';

  result.innerHTML = `
    Skor kamu: <span style="color: var(--primary)">${quizCorrect} / ${quizData.length}</span>
    (${percent}%)<br/>
    <span style="font-size:1rem; font-weight:500; color:var(--text-muted)">${message}</span>
    <br/><br/>
    <button class="btn btn-primary" onclick="renderQuiz()">🔄 Ulangi Quiz</button>
  `;
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  generateBars();
  generateSearchArray();
  renderQuiz();
});