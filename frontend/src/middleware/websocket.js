import socketService from "../services/websocketService.js";
import { addNewMessage } from "../slices/messagesSlice.js";

const socketMiddleware = (store) => {
    let token = null;

    return next => action => {
        console.log("Redux action:", action);
        switch (action.type) {
            case 'auth/loginSuccess':
                token = action.payload.token;
                socketService.connect(token);
                socketService.on("newMessage", (payload) => {
                    store.dispatch(addNewMessage(payload));
                  });
                break;
            case 'auth/logout': 
                socketService.disconnect();
                break;
            default:
                break;
          
        }
        return next(action);
    };
};

export default socketMiddleware;