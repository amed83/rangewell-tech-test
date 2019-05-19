

import React, { Component } from "react";
import {connect} from 'react-redux'
import {saveEditing} from './actions/index'

class Edit extends Component{
    
    constructor(props){
        super(props)
        this.state={
            
        }
    }
    
    
    componentDidMount(){
        
        this.setState({
            dealName:this.props.deal.title,
            dealValue:this.props.deal.amountRequired
        })
    }
    
    handleChange=(e)=>{
        const dealName=  e.target.name
        const dealValue= e.target.value
        this.setState({
            [e.target.name]:dealValue
        })
    }
    
    saveEditMethod(){
        this.props.saveEdit(this.state)
    }
    
    render(){
        
        return(
            <div>
                {!this.props.reloadAfterUpdate && 
                    <div>
                    <form action="">
                        <input type="text" className='Input' name='dealName' value={this.state.dealName|| ''} 
                            onChange={this.handleChange} placeholder='deal name'/>
                        <input type="text" className='Input' name='dealValue'  value={this.state.dealValue || ''}       
                            onChange={this.handleChange} placeholder='amount'/>
                    </form>
                    <button className="addBtn" onClick={()=>this.saveEditMethod()}>Save Edit</button>
                    </div>
               }
            </div>
        )
    }
    
}


const mapStateToProps = state=>{
    return{
        deal:state.dealReducer.dealToEdit,
        deals:state.dealReducer.deals,
        reloadAfterUpdate:state.dealReducer.reloadAfterUpdate
    }
}

const mapDispatchToProps = dispatch=>{
    return{
        saveEdit:(deal)=>dispatch(saveEditing(deal))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Edit)