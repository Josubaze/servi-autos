import { connect, connection } from 'mongoose'

const conn = { 
    isConnected: false
}

export async function connectDB(){
    if(conn.isConnected) return; 
    const db = await connect(process.env.DATABASE_URL, {
        dbName: 'ServiAutos', 
    });
    conn.isConnected = db.connections[0].readyState   
}

connection.on('connected', () => {
    console.log('✅ Mongoose connected to database');
})

connection.on('error', (err) => {
    console.log('⚠️ Mongoose conection error', err);
})


