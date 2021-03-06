import {view} from './view.js'

export var model = {

  //Вспомогательный метод работы с storage
  localStorage: function(){
    var arr = [];
    for (var key in localStorage){
      var showBooks = localStorage.getItem(key);
      arr.push(showBooks);
    }

    var books = arr.filter(function(x) {
      return x !== undefined && x !== null && x !== 'INFO';
    });

    var arr = [];
    books.forEach(function(item, index){
      var books = JSON.parse(item);
      arr.push(books);
    });
    return arr;
  },

  //Сохранить в хранилище
  handleClickSave: function(book){
    localStorage.removeItem('loglevel:webpack-dev-server');

    if(localStorage.length === 0){
      var size = localStorage.length + 1;
    }
    else{
      var arr = [];
      this.localStorage().forEach(function(item){
        arr.push(item.id);
      });
        var size = Math.max.apply(null, arr) + 1;
    }
  
    book.id = Number(size);

    var newBook = JSON.stringify(book);
    localStorage.setItem(size, newBook);

    document.getElementById("name").value = '';
    document.getElementById("author").value = '';
    document.getElementById("year").value = '';
    document.getElementById("numberPages").value = '';

    this.showStorage();

  },

  //Проверка
  validation: function(book){

    var error = [];
    var yearBook = Number(book.yearBook);
    var numberPages = Number(book.numberPages);

    for(var item in book){
      if(book[item] === ''){
        var message = "Заполните все поля";
        error.push(message);
        break;
      }
    }

    if(book.nameBook.length < 4){
      var message = "Название книги не может быть меньше 4 символов";
      error.push(message);
    }

    if(book.authorBook.length < 4){
      var message = "Имя автора не может быть меньше 4 символов";
      error.push(message);
    }

    if(isNaN(yearBook) || book.yearBook.length < 4 || book.yearBook.length > 4){
      var message = "Введите правильный год";
      error.push(message);
    }
    
    if(isNaN(numberPages)){
      var message = "Введите правильное количество страниц";
      error.push(message);
    }

    if(error.length !== 0){
      view.validation(error);
      error = [];
    }
    else{
      this.handleClickSave(book);
    }
    

  },

  //Показать блок управления
  showControl: function(id, className){
    localStorage.removeItem('loglevel:webpack-dev-server');
    if(document.getElementById("buttonGroup")){
      return false;
    }
    if(className === 'book'){
      view.showControl(id, className);
    }
  },


  //Показать все элементы хранилища
  showStorage: function(){
    var arr = this.localStorage();
    view.clearDom();
    view.showBooks(arr);
    console.log(arr);
  },

  //Модальное окно удаления
  ModalWindowDeleteBook: function(id){
    view.showQuery();
  },

  //Удалить книгу
  handleClickDelete: function(id){
    localStorage.removeItem(id);
    this.showStorage();
  },

  //Изменить книгу
  handleClickEdit: function(id){
    var data = JSON.parse(localStorage.getItem(id));
    view.handleClickEdit(data.nameBook, data.authorBook, data.yearBook, data.numberPages, id);
  },

  //Сохранить изменения
  editBook: function(id, book){
    var editBook = JSON.stringify(book);
    localStorage.setItem(id, editBook);
    this.showStorage();
  },

  //Поиск книги
  searchBook: function(searchValue){
    var search = searchValue.toLowerCase();
    
    var arr = this.localStorage();

    var books = arr.filter(function(data){
      let nameBook =    data.nameBook.toLowerCase();
      let authorBook =  data.authorBook.toLowerCase();
      let yearBook =    data.yearBook.toLowerCase();
      let numberPages = data.numberPages.toLowerCase();
      return nameBook.includes(search)   || 
             authorBook.includes(search) || 
             yearBook.includes(search)   || 
             numberPages.includes(search);
    });

    view.clearDom();
    view.showBooks(books);
  },

  //Сортировка по автору или по названию
  sortingBook: function(data){
    var books = this.localStorage();
   
    books.sort(function(a, b){
     
      if(data === 'author'){
        var sortA = a.authorBook;
        var sortB = b.authorBook;
      }
  
      if(data ==='name'){
        var sortA = a.nameBook;
        var sortB = b.nameBook;
      }

      if(sortA < sortB) return -1;
      if(sortA > sortB) return 1;

    });

    view.clearDom();
    view.showBooks(books);
  }




}
