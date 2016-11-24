//'<div data-id="' + data[i]._id + '" class="col-md-4"><div class="panel panel-primary"><div class="panel-heading my-company" data-id="' + data[i]._id + '">' + data[i].name + '</div><div class="panel-body" ><p>' + tracklist.join(" , ") + '</p></div>'


var React = require('react');
var action = require("../actions/company");
var Company = React.createClass({
    deleteBook(e) {
        e.preventDefault();
        action.deleteBook(this.props.item);
    },
    render: function () {
        return (
            <div  className="col-md-4">
                <div className="panel panel-primary">
                    <div className="panel-heading my-company" data-id= { this.props.item._id }> { this.props.item.name }  </div>
                    <div className="panel-body" ><p>
                        { this.props.item.join(" , ") }
                    </p>
                    </div>
                </div>
            </div>)
    }

});

module.exports = Company;