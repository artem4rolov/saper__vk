// класс для точки на поле
// изначально точка без мины, вокруг этой точки нет мин и эта точка не открыта
class Point {
  constructor() {
    // в точке есть мина
    this.is_mine = false;
    // вокруг этой точки сколько мин
    this.mine_around = 0;
    // открыта точка или нет
    this.is_open = false;
  }
}

// игра
// хранение данных игры
var game = {
  // размер поля
  width: 10,
  height: 10,
  // поле с точками (двухмерный массив) и расставленными минами
  field: [],
  // количество мин
  mine_count: 10,
  // количество открытых мин
  open_mine_count: 0,
  // метод, создающий точки на поле и заполняющий минами рандомные точки на поле
  fillField: function () {
    // очищаем массив с точками, при перезапуске игры
    this.field = [];

    // сначала бежим по оси X (по столбцам), каждый столбец по оси X заполняем точками (Point)
    for (var i = 0; i < this.width; i++) {
      // временный массив, чтобы заполнить точками
      var tmp = [];
      // на каждой итерации цикла (это каждый столбец игрового поля) заполняем этот столбец точками (Point) - строчками, если так понятнее
      for (var j = 0; j < this.height; j++) {
        // заполняем стобец точками
        tmp.push(new Point());
      }
      // теперь полученный столбец со строкам помещаем на поле
      // и так 10 раз, в итоге будет поле 10x10
      this.field.push(tmp);
    }

    // i++ не пишем, потому что мы не расставляем в каждой последующей точке мину, i++ будет засчитываться только тогда, когда в рандомной точке поставим мину
    for (var i = 0; i < this.mine_count; ) {
      // на кадой итерации цикла создаем рандомные координаты для точки
      // отнимаем от рандомного числа 0.001 чтобы точно не попалось крайнее число
      var x = parseInt(Math.random() * this.width - 0.0001);
      var y = parseInt(Math.random() * this.height - 0.0001);

      // если в рандомной точке мины нет - ставим туда мину
      if (!this.field[x][y].is_mine) {
        this.field[x][y].is_mine = true;
        // теперь переходим к следующей бомбе
        i++;
      }
    }
  },

  // считаем мины вокруг точки
  mine_around_counter: function (x, y) {
    // начальная точка, проверяем что наша точка не сверху и слева (что мы не выходим за пределы поля, когда считаем мины вокруг, поскольку точка может быть угловая)
    var x_start = x > 0 ? x - 1 : x;
    var y_start = y > 0 ? y - 1 : y;

    // конечная точка справа (не вышли ли мы за пределы поля справа)
    var x_end = x < this.width - 1 ? x + 1 : x;
    var y_end = y < this.heigth - 1 ? y + 1 : y;
    // счетчик мин
    var count = 0;

    // бежим по ячейкам вокруг нашей точки и проверяем её
    for (var i = x_start; i <= x_end; i++) {
      for (var j = y_start; j <= y_end; j++) {
        // если в какой-то из точек есть мина И эта точка не является точкой, от которой идет отсчет (в аргументах функции координаты текущей точки не дожны быть равны координате точки рядом, в которой будет мина)
        if (this.field[i][j].is_mine && !(x === i && y === j)) {
          count++;
        }
      }
      // показываем число мин,находящихся рядом с нашей точкой
      this.field[x][y].mine_around = count;
    }
  },

  // считаем остальные мины рядом
  start_mine_counter: function () {
    // бежим по всем столбцам
    for (var i = 0; i < this.width; i++) {
      // бежим по всем строкам в столбце
      for (var j = 0; j < this.height; j++) {
        // считаем все мины
        this.mine_around_counter(i, j);
      }
    }
  },

  // инициализация
  start: function () {
    // заполняем поле точками и рандомно минами
    this.fillField();
    // считаем мины
    this.start_mine_counter();
  },
};

// интерфейс
var page = {
  // инициализация
  init: function () {
    this.game_interface.init();
  },
  // игровое поле
  game_interface: {
    init: function () {
      // запускаем заполнение поля точками и расставляем рандомно мины
      game.start();
      // берем корневой div из DOM
      this.div = document.querySelector(".field");
      // рисуем наше поле
      this.draw_field();
      // указываем контекст
      var self = this;
      // вешаем обработчик события клика на корневой div
      this.div.addEventListener("click", function (e) {
        if (e.target.matches("td")) {
          self.open(e);
        }
      });
    },
    // рисуем поле
    draw_field: function () {
      // создаем таблицу
      var table = document.createElement("table");
      // бежим по строкам нашего поля (по оси Y)
      for (var i = 0; i < game.height; i++) {
        // создаем строку (table row)
        var tr = document.createElement("tr");
        // теперь бежим по столбцам нашего поля (по оси X)
        for (var j = 0; j < game.width; j++) {
          // создаем ячейку
          var td = document.createElement("td");
          // пихаем ячейку в строку (пока не дойдем до конца нашего поля по оси X)
          tr.appendChild(td);
        }
        // пихаем полученую строку в таблицу, пока не дойдем до конца нешего поля (по оси Y)
        table.appendChild(tr);
      }
      // пихаем полученную таблицу в корневой div в DOM
      this.div.appendChild(table);
    },
    // обработчик события на открытие ячейки
    open: function (e) {
      // узнаем номер ячейки в строке (у эелмента td есть свойство cellIndex)
      x = e.target.cellIndex;
      // узнаем номер ячейки в столбце (родитель ячейки - tr, у нее есть свойство rowIndex)
      y = e.target.parentNode.rowIndex;
      // если в этой ячейке есть мина
      if (game.field[x][y].is_mine) {
        // останавливаем и перезапускаем игру
        alert("game over");
      } else {
        // если мины нет, пишем сколько рядом с этой ячейкой бомб
        e.target.innerHTML = game.field[x][y].mine_around;
      }
    },
  },
};

window.onload = function () {
  page.init();
};
