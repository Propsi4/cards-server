import express,{Router} from 'express'
import {createRoom, canJoin, joinRoom, users, getToken, getUsername, getRooms } from './scripts'
const router = Router()
router.use(express.json())


router.post("/api/get_username", async (req,res) => {
  await getUsername(req,res)
})
router.post("/api/create_room", async (req,res) => {
  await createRoom(req,res)
})
router.post("/api/can_join", async (req, res) => {
  await canJoin(req,res)
})
router.post("/api/join_room",async (req, res) => {
  await joinRoom(req,res)
})
router.post("/api/users", async(req, res) => {
  await users(req,res)
})
router.post("/api/get_token", async(req, res) => {
  await getToken(req,res)
})
router.post("/api/rooms", async(req, res) => {
  await getRooms(req,res)
})
export default router