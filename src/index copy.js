import React from 'react';
import ReactDOM from 'react-dom';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import './index.css';

let n = 2;
const options = Array(8).fill( { label: '2', value: 2} ).map( obj => ({ label: n.toString(), value: n++}) )

class NumberCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var value = event.target.value;
        if (this.props.checked) {
            value = true;
        }
        this.props.handleChange(value,this.props.index)
    }

    render() {
        return (
            <div className="number">
                {this.props.number}
                <input
                    name="test"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.handleChange} />
            </div>
        );
    }
}

class NumberGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
    
        }
        this.childs = [ {checked:false, number:2},
                        {checked:false, number:3},
                        {checked:false, number:4},
                        {checked:false, number:5},
                        {checked:false, number:6},
                        {checked:false, number:7},
                        {checked:false, number:8},
                        {checked:false, number:9},]
        this.handleInputChange = this.handleInputChange.bind(this);                
    }   
    
    handleInputChange(val,index) {  
        this.childs.forEach( ( data ) => {
            data.checked = false;
        })
        this.childs[index].checked=val;
        this.setState({})
    }    

    render() {
        return (
            <div>
                {
                    this.childs.map((val,i) => {
                        return  <NumberCheck key ={i} index={i} number={val.number} checked={val.checked} handleChange={this.handleInputChange}/>    
                    })
                }
          </div>
        );
    }    
} 

class Game extends React.Component {
    render() {
      return (
        <div className="game">
            Çarpım tablosu Sayılarını Seçiniz:
            <ReactMultiSelectCheckboxes options={options} />
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );