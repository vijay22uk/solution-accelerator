import {EventEmitter } from "events";
import dispatcher from "../dispatcher";
import helper from "../helpers/Resthelper";
class BookmarkStore extends EventEmitter {
    constructor() {
        super()
        this.BookList = [];
        helper.get("/api/company")
        .then(this.setData.bind(this))
    }
    setData(data){
        this.BookList = data ;
        this.emit("change");
    }
    getAll() {
        return this.BookList;
    }
    createBook(book) {
        var _book = {name:book.name}
        this.BookList.push(_book);
        // emit to componenets
        this.emit("change");
        helper.post("/api/company",_book)
        .then(function () {
            console.log("posted to server");
        })
    }
    deleteBook(book){
        var index = this.BookList.findIndex(function(_item) {
            return _item._id ===book._id;
        });
        this.BookList.splice(index,1);
        this.emit("change");
    }
    handleActions(action) {
        switch(action.type){
            case "CREATE_BOOK":{
                this.createBook({name:action.name})
                break;
            }
            case "DELETE_BOOK":{
                this.deleteBook(action.payload);
                  break;
            }
        }
    }

}
const bookmarkStore = new BookmarkStore();
dispatcher.register(bookmarkStore.handleActions.bind(bookmarkStore))
module.exports = bookmarkStore;