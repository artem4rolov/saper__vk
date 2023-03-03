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
    const row = Math.floor(index / WIDTH);
    // // если в ячейке бомба - крестик, иначе пусто
    event.target.innerHTML = isBomb(row, column) ? "x" : " ";
  });

  function isBomb(row, column) {
    const index = row * WIDTH + column;

    return bombs.includes(index);
  }
}
