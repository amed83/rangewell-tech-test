
import {
    LOAD_DEALS,
    CREATING_NEW_DEAL,
    SAVE_NEW_DEAL,LOAD_STATS,
    EDIT_DEAL,
    SAVE_EDIT,
    RELOAD_DEALS,
    END_UPDATE
}from '../actions/types'

const initialState={
    deals:'',
    newDeal:{dealName:'',dealAmount:''},
    stats:'',
    dealToEdit:'',
    edit:false,
    reloadAfterUpdate:false
}

const dealReducer = (state=initialState,action)=>{
    switch(action.type){
        case LOAD_DEALS:
        return {
            ...state,
            deals:action.payload
        }

        case CREATING_NEW_DEAL:{
            //updating on each input
            const dealDetails = action.payload
            const dealProps = {...state}
            const props = Object.values(dealDetails)
            dealProps.newDeal[props[0]]=props[1]
            return dealProps
        }
        case SAVE_NEW_DEAL:{
            const dealToSave= action.payload
            return {
                ...state,
                deals:[...state.deals,dealToSave],
                newDeal:
                {...state.newDeal,
                    dealName:'',
                    dealAmount:''
                }
            }
        }
        case LOAD_STATS:{
            return{
                ...state,
                stats:action.payload
            }
        }
        case EDIT_DEAL:{
            return {
                ...state,
                dealToEdit:action.payload,
                edit:true
            }
        }
        case SAVE_EDIT:{
            const indexToEdit = state.deals.findIndex(item=>item._id===state.dealToEdit._id)
        
            const{dealName,dealValue}= action.payload
            const cloneDeals= [...state.deals]
            const updateObj = {
                ...cloneDeals[indexToEdit],
                title:dealName,
                amountRequired:dealValue
            }
            cloneDeals[indexToEdit]=updateObj
            return{
                ...state,
                deals:cloneDeals,
                edit:false
            }
        }
        case RELOAD_DEALS:{
            return{
                ...state,
                reloadAfterUpdate:true
            }
        }
        case END_UPDATE:{
            return{
                ...state,
                reloadAfterUpdate:false
            }
        }

        default:
        return state
    }

    
}


export default dealReducer