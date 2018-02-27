import React, { Component } from 'react';
import logo from './Stack-Overflow-Logo.png';
import './App.css';
import styled from "styled-components"

const Container = styled.div`
  background-color : #F5FFFA;
  .logo{
    width: 250px;
  }
  .head{
    text-align: center;
  }
  `

const Graph = styled.div`
  position : relative;
  grid-column : 1;
  grid-row : 3/ span 2;
  // background : rgba(166,166,166,0.5);
  text-align : center;
  overflow: hidden;
  padding-bottom : 15px; 
  margin : 15px; 
  img{
    position :relative;
    width : 75%;
  }
`

const SelectorTag = styled.select`
  font-size: 14px;
  padding: 8px;
  margin: 5px;
  width: 35%;
  color: #4b4f5d;
  -webkit-appearance: None;
  -webkit-border-radius: 0px;
`

const SelectorDetail = styled.select`
  font-size: 14px;
  padding: 8px;
  margin: 5px;
  width: 17%;
  color: #4b4f5d;
  -webkit-appearance: None;
  -webkit-border-radius: 0px;
`

const Button = styled.button`
    // -webkit-border-radius: 0;
    // -moz-border-radius: 0;
    border-radius: 2px;
    color: #757575;
    font-size: 14px;
    background: #ffffff;
    padding: 10px 20px 10px 20px;
    text-decoration: none;
    margin: 3px;
    width: 10%;
    &:hover{
        background-color : #f6f6f7;
        cursor: pointer;
        
    }
`

class App extends Component {
  tagList(){
    var returnVal = []
    var tagList = [ 'javascript','java','python','android','php','c#','html','jquery','css','ios','mysql','c++','sql','swift','node.js','angularjs','r','angular','arrays','json','sql-server','c','reactjs','ruby-on-rails','python-3.x','asp.net','excel','django','spring','ajax']
    for(var i = 0; i < tagList.length; i++){
      returnVal.push(<option value={tagList[i]}>{tagList[i]}</option>)
    }
    return returnVal
  }  

  rangeList(){
    var returnVal = []
    var rangeList = [ 'week', 'day']
    for(var i = 0; i < rangeList.length; i++){
      returnVal.push(<option value={rangeList[i]}>{'per ' + rangeList[i]}</option>)
    }
    return returnVal
  }  

  detailList(){
    var returnVal = []
    var detailList = [ 'view', 'predict']
    for(var i = 0; i < detailList.length; i++){
      returnVal.push(<option value={detailList[i]}>{detailList[i]}</option>)
    }
    return returnVal
  }  

  async runBackend(){
    let formData = new FormData();
    var response = await fetch("/predict",
    {
      method: 'post',
      body : formData
    })
    var data = await response.json()
    console.log(data)
  }

  async showImage(tag,detail,range){
    let formData = new FormData();
    formData.append('tag', this.state.tag);
    formData.append('detail', this.state.detail);
    formData.append('range', this.state.range);
    var response = await fetch("/predict",
    {
      method: 'post',
      body : formData
    })
    var data = await response.json()

    this.setState({
      img : data.path,
    })
    console.log(this.state.img)
  }

  constructor(props){
    super(props)
    this.state = {
      tag : "javascript",
      detail: "view",
      range: "week",
      // img : "img/predict/week/c#.png"
      img : "img/others/TagFre.png",
    }
    this.handletag = this.handletag.bind(this)
    this.handledetail = this.handledetail.bind(this)
    this.handlerange = this.handlerange.bind(this)
  }

  handletag(e){
    this.setState({
      tag : e.target.value,
    })
  }

  handlerange(e){
    this.setState({
      range: e.target.value,
    })
  }

  handledetail(e){
    this.setState({
      detail : e.target.value,
    })
  }

  render() {
    console.log(this.state)
    return (
      <Container>
        <header className="head">
          <img src={logo} className="logo"/>
          {/* <h1 className="App-title">Welcome to Stackoverflow </h1> */}
        </header>
        <div>
        <SelectorTag value={this.state.tag} onChange={this.handletag}>
          {this.tagList()}
        </SelectorTag>
        <SelectorDetail value={this.state.range} onChange={this.handlerange}>
          {this.rangeList()}
        </SelectorDetail>
        <SelectorDetail value={this.state.detail} onChange={this.handledetail}>
          {this.detailList()}
        </SelectorDetail>
        <Button onClick={()=>this.showImage(this.state.tag)} > Show Graph</Button>
        {/* <Button onClick={()=>this.runBackend()} > Run</Button> */}
        </div>
        {/* <div>
          {this.state.range}
        </div> */}
        <Graph>
          {
              <div>
                <img src={"http://localhost:8000/"+this.state.img}/>
              </div>
          }
          
        </Graph>
     </Container>
    );
  }
}

export default App;
