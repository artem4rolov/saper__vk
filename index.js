startGame(16, 16, 15);

// задаем ширину, высоту для поля, и количество бомб
function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
  const field = document.querySelector(".field");

  // количество ячеек на поле
  const cellsCount = WIDTH * HEIGHT;

  // заполняем поле кнопками
  field.innerHTML = "<button></button>".repeat(cellsCount);
  // массив всех кнопок
  const cells = [...field.children];

  // количество закрытых ячеек изначально равно количеству всех ячеек на поле
  // при первом открытии начинаем уменьшать это количество
  let closedCount = cellsCount;

  // создаем массив бомб
  const bombs = [...Array(cellsCount).keys()]
    // получаем объект с ячейками
    // рандомно сортируем его (сортируем индексы)
    .sort(() => Math.random() - 0.5)
    // оставляем только количество, которое равно количеству бомб
    // получаем рандомные индексы бомб
    .slice(0, BOMBS_COUNT);

  // клик на поле
  field.addEventListener("click", (event) => {
    // если клик произошел не по кнопке (не по полю) - ничего не делаем
    if (event.target.tagName !== "BUTTON") {
      return;
    }

    // ищем индекс ячейки в массиве ячеек
    const index = cells.indexOf(event.target);
    // номер колонки - остаток деления индекса на ширину ряда
    const column = index % WIDTH;
    // номер строки - индекс деленный на ширину строки
    const row = Math.floor(index / WIDTH);
    // открываем ячейку по клику
    open(row, column);
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
      return;
    }
    // блокируем ячейку
    cell.disabled = true;

    // проверяем ячейку на наличие бомбы
    if (isBomb(row, column)) {
      // если внутри бомба - завершаем работу функции
      cell.innerHTML = "x";
      alert("you loose");
      startGame(16, 16, 15);
      return;
    }

    // уменьшаем количество закрытых ячеек
    closedCount--;

    // если количество закрытых ячеек будет меньше или равно количеству бомб в игре - выигрыш
    if (closedCount <= BOMBS_COUNT) {
      alert("you won");
      startGame(16, 16, 15);
      return;
    }

    // считаем бомбы вокруг ячейки
    const count = getMinesCount(row, column);

    // если количество бомб вокруг не равно 0
    if (count !== 0) {
      cell.innerHTML = count;
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
}
