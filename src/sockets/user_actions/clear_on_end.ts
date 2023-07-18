import rooms from "../../store/rooms";

export const clear_on_end = (roomID : string, token : string, setting : boolean) => {
    if(!rooms[roomID]) return;
    if(rooms[roomID].owner.token !== token) return;
    console.log(setting);
    rooms[roomID].clear_on_end = setting;
}