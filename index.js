startGame(16, 16, 30);

// задаем ширину, высоту для поля, и количество бомб
function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
  // смайлик по центру
  const emotions = document.querySelector(".emotions");
  // таймер с минутами слева
  // первая цифра минут
  const minutes1 = document.querySelector(".minutes-1");
  // вторая цифра минут
  const minutes2 = document.querySelector(".minutes-2");
  // секундомер справа
  // первая цифра секунд *100
  const seconds1 = document.querySelector(".seconds-1");
  // вторая цифра секунд *10
  const seconds2 = document.querySelector(".seconds-2");
  // третья цифра секунд *1
  const seconds3 = document.querySelector(".seconds-3");

  // удаляем классы для смайлика
  emotions.classList.remove("emotions-loose");
  emotions.classList.remove("emotions-win");

  // останавливаем минутный таймер и добавляем заглушки
  // левая цифра
  minutes1.classList.remove("sprite-img-1");
  minutes1.classList.remove("paused");
  minutes1.classList.add("placeholder-1");
  // правая цифра
  minutes2.classList.remove("sprite-img-2");
  minutes2.classList.remove("paused");
  minutes2.classList.add("placeholder-2");

  // останавливаем секундомер и добавляем заглушки
  // первая цифра
  seconds1.classList.remove("sprite-img-3");
  seconds1.classList.remove("paused");
  seconds1.classList.add("placeholder-2");
  // вторая цифра
  seconds2.classList.remove("sprite-img-4");
  seconds2.classList.remove("paused");
  seconds2.classList.add("placeholder-2");
  // третья цифра
  seconds3.classList.remove("sprite-img-5");
  seconds3.classList.remove("paused");
  seconds3.classList.add("placeholder-2");

  // поле с кнопками
  const field = document.querySelector(".field");

  // количество ячеек на поле
  const cellsCount = WIDTH * HEIGHT;

  // заполняем поле кнопками
  field.innerHTML = '<button class="btn"></button>'.repeat(cellsCount);
  // массив всех кнопок
  const cells = [...field.children];

  // количество закрытых ячеек изначально равно количеству всех ячеек на поле
  // при первом открытии начинаем уменьшать это количество
  let closedCount = cellsCount;

  // создаем массив бомб
  let bombs = [...Array(cellsCount).keys()]
    // получаем объект с ячейками
    // рандомно сортируем его (сортируем индексы)
    .sort(() => Math.random() - 0.5)
    // оставляем только то количество, которое равно количеству бомб
    // получаем рандомные индексы бомб
    .slice(0, BOMBS_COUNT);

  // нажатие на смайлик перезапускает игру
  emotions.addEventListener("click", () => {
    startGame(16, 16, 30);
  });

  // при нажатии левой кнопки мыши меняется смайлик
  field.addEventListener("mousedown", (event) => {
    if (event.target.tagName !== "BUTTON") {
      return;
    }
    // уточняем, что это именно левая кнопка мыши
    event.which == 1 && emotions.classList.add("emotions-warning");
  });

  // при отпускании левой кнопки мыши меняется смайлик
  field.addEventListener("mouseup", (event) => {
    if (event.target.tagName !== "BUTTON") {
      return;
    }
    // уточняем, что это именно левая кнопка мыши
    event.which == 1 && emotions.classList.remove("emotions-warning");
  });

  // клик на поле
  field.addEventListener("click", (event) => {
    // если клик произошел не по кнопке (не по полю) - ничего не делаем
    if (event.target.tagName !== "BUTTON") {
      return;
    }

    // запускаем таймер
    minutes1.classList.remove("placeholder-1");
    minutes1.classList.add("sprite-img-1");
    minutes2.classList.remove("placeholder-2");
    minutes2.classList.add("sprite-img-2");

    // запускаем секундомер
    seconds1.classList.remove("placeholder-2");
    seconds1.classList.add("sprite-img-3");
    seconds2.classList.remove("placeholder-2");
    seconds2.classList.add("sprite-img-4");
    seconds3.classList.remove("placeholder-2");
    seconds3.classList.add("sprite-img-5");

    // ищем индекс ячейки в массиве ячеек
    const index = cells.indexOf(event.target);

    // если ячейка заблочена - останавливаем обработчик
    if (
      cells[index].classList.contains("block") ||
      cells[index].classList.contains("question")
    ) {
      return;
    }

    // номер колонки - остаток деления индекса на ширину ряда
    const column = index % WIDTH;
    // номер строки - индекс деленный на ширину строки
    const row = Math.floor(index / WIDTH);
    // открываем ячейку по клику
    open(row, column);
  });

  field.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    if (closedCount === cellsCount) {
      return;
    }
    // ищем индекс ячейки в массиве ячеек
    const index = cells.indexOf(event.target);

    // если на ячейке уже стоит блок - ставим вопрос
    if (cells[index].classList.contains("block")) {
      cells[index].classList.remove("block");
      cells[index].classList.add("question");
      return;
    }

    // если на ячейке стоит вопрос - снимаем вопрос
    if (cells[index].classList.contains("question")) {
      cells[index].classList.remove("question");
      return;
    }

    cells[index].classList.toggle("block");
  });

  // проверка границ координат
  // за полем бомб быть не может
  function isValid(row, column) {
    return row >= 0 && row < HEIGHT && column >= 0 && column < WIDTH;
  }

  // проверяем количество мин рядом с нашей ячейкой, на которую кликнули
  function getMinesCount(row, column) {
    // количество мин рядом с ячейкой
    let count = 0;

    // получаем индекс ячейки
    const index = row * WIDTH + column;
    // получаем ячейку
    const cell = cells[index];

    // перебираем все соседние ячейки
    // у соседних ячеек колонка или ряд отличаются на +1 или -1
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        // проверяем ячейку на границы поля и на наличие бомбы
        // бомбы за границей поля быть не может
        if (isBomb(row + y, column + x)) {
          count++;
        }
      }
    }

    // добавляем ячейкам классы в соответствии с количеством бомб
    switch (count) {
      case 1:
        cell.classList.add("one");
        break;
      case 2:
        cell.classList.add("two");
        break;
      case 3:
        cell.classList.add("three");
        break;
      case 4:
        cell.classList.add("four");
        break;
      case 5:
        cell.classList.add("five");
        break;
      case 6:
        cell.classList.add("six");
        break;
      case 7:
        cell.classList.add("seven");
        break;
      case 8:
        cell.classList.add("eight");
        break;
      default:
        // cell.classList.add("two");
        break;
    }

    return count;
  }

  // функция открытия ячейки
  function open(row, column) {
    // если ячейка не валидна - останавливаем функцию
    if (!isValid(row, column)) {
      return;
    }

    // получаем индекс ячейки
    const index = row * WIDTH + column;
    // получаем ячейку из массива всех ячеек
    const cell = cells[index];

    // если ячейка уже открыта - останавливаем функцию
    if (cell.disabled === true) {
      // даем класс открытой ячейке
      cell.classList.add("zero");
      return;
    }
    // блокируем ячейку
    cell.disabled = true;

    // проверяем ячейку на наличие бомбы
    if (isBomb(row, column)) {
      // если внутри бомба - завершаем игру
      // добавляем класс ячейке с красной бомбой
      cell.classList.add("explosion");
      // при проигрыше показываем все бомбы
      showAllBombs();
      // останавливаем таймер
      minutes1.classList.add("paused");
      minutes2.classList.add("paused");
      // останавливаем секундомер
      seconds1.classList.add("paused");
      seconds2.classList.add("paused");
      seconds3.classList.add("paused");
      // меняем смайлик
      emotions.classList.add("emotions-loose");
      return;
    }

    // уменьшаем количество закрытых ячеек
    closedCount--;

    // если количество закрытых ячеек будет меньше или равно количеству бомб в игре - выигрыш
    if (closedCount <= BOMBS_COUNT) {
      // при выигрыше показываем все бомбы
      showAllBombs();
      // останавливаем таймер
      minutes1.classList.add("paused");
      minutes2.classList.add("paused");
      // останавливаем секундомер
      seconds1.classList.add("paused");
      seconds2.classList.add("paused");
      seconds3.classList.add("paused");
      // меняем смайлик
      emotions.classList.add("emotions-win");
      return;
    }

    // считаем бомбы вокруг ячейки
    const count = getMinesCount(row, column);

    // если количество бомб вокруг не равно 0
    if (count !== 0) {
      return;
    }

    // если бомб вокруг ячейки нет - открываем все соседние ячейки
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        open(row + y, column + x);
      }
    }
  }

  // проверка ячейки на наличие бомбы
  function isBomb(row, column) {
    // если координата выходит за пределы - возвращаем false
    if (!isValid(row, column)) {
      return false;
    }
    const index = row * WIDTH + column;

    return bombs.includes(index);
  }

  // показываем все бомбы
  function showAllBombs() {
    cells.forEach((cell, index) => {
      if (bombs.includes(index) && cell.classList.contains("block")) {
        cell.classList.add("opened");
      }
      if (bombs.includes(index)) {
        cells[index].classList.add("hidden");
      }
      // блокируем поле
      cell.disabled = true;
    });
  }
}

// таймер
function timer() {
  // хуета
}

// timer();
