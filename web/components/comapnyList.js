var React = require('react');
var Bookmark = require('./company')
var bookstore = require("../stores/CompanyStore");
var action = require("../actions/company");
var CompanyList = React.createClass({
    componentWillMount() {
        debugger
        bookstore.on('change', this.refresh);
    },
    refresh(){
        debugger
        this.setState({ list:  bookstore.getAll(),
            input:"" });
    },
    handleInputName(e) {
        this.setState({ input: e.target.value });
    },
    addBook(e) {
        e.preventDefault();
        action.createBook(this.state.input);
    },
    getInitialState() {
        return {
            list: this.props.list,
            input: ""
        }
    },
    render: function () {
        return (<div>
            <ul className="list-group">
                {
                    this.state.list.map(function (item, i) {
                        return (
                            <Bookmark item={item} key={"item" + i} />
                        )
                    })
                }
            </ul>
        </div>)
    }
});

module.exports = CompanyList;