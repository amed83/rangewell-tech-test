
import {LOAD_DEALS,
    CREATING_NEW_DEAL,
    SAVE_NEW_DEAL, 
    LOAD_STATS,EDIT_DEAL,SAVE_EDIT,RELOAD_DEALS} from './types'


export const loadDeals = (deals)=>{
    return dispatch=>{
        dispatch({
            type:LOAD_DEALS,
            payload:deals
        })
    }
}

export const creatingNewDeal = (dealData)=>{
    return dispatch=>{
        dispatch({
            type:CREATING_NEW_DEAL,
            payload:dealData
        })
    }
}

export const saveNewDeal= (newDeal)=>{
    return dispatch=>{
        dispatch({
            type:SAVE_NEW_DEAL,
            payload:newDeal
        })
        
    }
}


export const editDeal=(deal)=>{
    return dispatch=>{
        dispatch({
            type:EDIT_DEAL,
            payload:deal
        })
    }
}

export const saveEditing = (deal)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:SAVE_EDIT,
            payload:deal
        })
        const state= getState().dealReducer
        const dealToSave = state.deals.find(deal=>deal._id===state.dealToEdit._id)
        dispatch(saveOnDbAndReload(dealToSave))
    }
}


export const saveOnDbAndReload = (updateDeal)=>{
    return dispatch =>{
        fetch('http://localhost:3001/api/deal/editDeal',
                {method: 'POST', body: JSON.stringify(updateDeal),
                    headers:{"Content-Type": "application/json"}
            })
            .then(result=>{
                dispatch({
                    type:RELOAD_DEALS,
                })
            })
        }
}

export const loadStats = (stats)=>{
        return dispatch=>{
            dispatch({
                type:LOAD_STATS,
                payload:stats
            })
        }
}