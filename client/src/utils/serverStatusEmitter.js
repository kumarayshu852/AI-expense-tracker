// Simple pub-sub — api.js (jo React component nahi hai) yahan se
// server status context ko notify kar payega bina props/context import kiye
const listeners = new Set()

export const subscribeServerStatus =(callback)=>{
    listeners.add(callback)
    return() =>listeners.delete(callback)// cleanup function 
}

export const emitServerStatus =(isDown)=>{
    listeners.forEach((callback) => callback(isDown))
}