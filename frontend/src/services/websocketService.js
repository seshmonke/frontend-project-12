import { io } from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket) return;

        console.log("Connecting to socket...");
        this.socket = io('http://localhost:5001/', {
            auth: { token },
        });

        this.socket.on("connect", () => {
            console.log("Socket connected");
          });
      
          this.socket.on("disconnect", () => {
            console.log("Socket disconnected");
          });
      
          this.socket.on("error", (err) => {
            console.error("Socket error:", err);
          });
      
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (!this.socket) return;
        this.socket.on(event, callback);
      }
    
      off(event, callback) {
        if (!this.socket) return;
        this.socket.off(event, callback);
      }
    
      emit(event, data) {
        if (!this.socket) return;
        this.socket.emit(event, data);
      }
    
}
    

const socketService = new SocketService();
export default socketService;
