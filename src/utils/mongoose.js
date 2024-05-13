import { connect, connection } from 'mongoose'

const conn = { 
    isConnected: false
}

export async function connectDB(){
    if(conn.isConnected) return; 
    const db = await connect('mongodb://root:root123@localhost:27017/?tls=false');
    conn.isConnected = db.connections[0].readyState   
}

connection.on('connected', () => {
    console.log('Mongoose is connected');
})

connection.on('error', (err) => {
    console.log('Mongoose conection error', err);
})