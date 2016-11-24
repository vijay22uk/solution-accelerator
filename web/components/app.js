var React = require('react');
var CompanyList = require('./companyList');

var App = React.createClass({
    getInitialState() {
        return {
            allowAdd:true
        }
    },
    toggleAdd(e){
        var _value = e.target.checked;
        this.setState({allowAdd : _value}) ;
    },
    render: function () {
            return (<div className ="container-fluid"> <button className="btn btn-primary" style="background-color: #191919; margin-bottom:10px" id="addcompanyBtn" type="button">Add</button>
            <CompanyList allowAdd = {this.state.allowAdd} list={[]} /> 
            </div>);
    }

});
module.exports = App;