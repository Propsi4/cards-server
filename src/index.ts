import express from 'express'
import http from "http"
import apiRouter from "./api/router"
import socketConnetion from './sockets/sockets'

const PORT = 5000
const app = express()
app.use(apiRouter)
const server = http.createServer(app)
socketConnetion(server)

server.listen(PORT, () => {
    console.log('App listening at '+ PORT)
  });