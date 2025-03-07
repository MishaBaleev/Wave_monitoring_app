import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        modal:{
            title: "",
            message: ""
        },
        backend_port: 8000,
        is_connected: false,
        mission: []
    },
    reducers: {
        updateModal: (state, action) => {
            state.modal.title = action.payload.title 
            state.modal.message = action.payload.message
        },
        changeConnected: (state, action) => {
            state.is_connected = action.payload 
        },
        addMissionElement: (state, action) => {
            state.mission.push({id: action.payload.id, coords: [action.payload.coords[0], action.payload.coords[1], 3], speed: 3})
            // let coord_arr = state.mission.map(item => {return item.coords})
            // console.log("--add element--")
            // state.mission.forEach(item => {
            //     console.log(JSON.parse(JSON.stringify(item)))
            // })
        },
        deleteMissionElement: (state, action) => {
            let new_mission = []
            state.mission.forEach(item => {
                if (item.id !== action.payload.id){
                    new_mission.push(item)
                }
            })
            state.mission = new_mission
        },
        updateMissionElement: (state, action) => {
            let command_type = action.payload.type 
            if (command_type === "coords"){
                state.mission = state.mission.map(item => {
                    if (item.id === action.payload.id){
                        item.coords = [action.payload.value[0], action.payload.value[1], item.coords[2]]
                    }
                    return item
                })
            }
            if (command_type === "alt"){
                state.mission = state.mission.map(item => {
                    if (item.id === action.payload.id){
                        item.coords = [item.coords[0], item.coords[1], action.payload.value]
                    }
                    return item
                })
            }
            if (command_type === "speed"){
                state.mission = state.mission.map(item => {
                    if (item.id === action.payload.id){
                        item.speed = action.payload.value
                    }
                    return item
                })
            }
            // console.log("--aupdate element--")
            // state.mission.forEach(item => {
            //     console.log(JSON.parse(JSON.stringify(item)))
            // })
        },
        clearMission: (state, action) => {
            state.mission = []
        }

    }
})
export const {updateModal, changeConnected, updateMissionElement, addMissionElement, deleteMissionElement, clearMission} = appSlice.actions 
export default appSlice.reducer