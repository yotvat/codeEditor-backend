import { Server } from 'socket.io'
import { logger } from './logger.service.js'

var gIo = null
var mentorSocketIds = {}

export const SOCKET_EVENT_SET_BLOCK = 'set-block'
export const SOCKET_EMIT_UPDATED_BLOCK = 'block-updated'
export const SOCKET_EVENT_UPDATE_BLOCK = 'update-block'
export const SOCKET_EVENT_LEAVE_BLOCK = 'leave-block'

export const SOCKET_EMIT_IS_MENTOR = 'is-mentor'

export const socketService = {
  setupSocketAPI,
}

export function setupSocketAPI(server) {
  gIo = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  gIo.on('connection', socket => {
    logger.info(`New connected socket[id:${socket.id}]`)

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected [id: ${socket.id}]`);

      Object.keys(mentorSocketIds).forEach(blockId => {
        if (mentorSocketIds[blockId] === socket.id) {
          delete mentorSocketIds[blockId]
        }
      })

    })

    socket.on(SOCKET_EVENT_SET_BLOCK, block => {

      if (!block) return
      if (socket.myBlock) {
        socket.leave(socket.myBlock)
        logger.info(`socket is leaving block ${socket.myBlock} [id: ${socket.id}]`)
      }

      // if (socket.myBlock === block._id) return
      socket.join(block._id)
      logger.info(`joined block: ${block._id}`)
      socket.myBlock = block._id

      //check if there's no mentor
      if (!mentorSocketIds[block._id]) {
        //assign mentor
        mentorSocketIds[block._id] = socket.id
        socket.emit(SOCKET_EMIT_IS_MENTOR, { isMentor: true })
      } else {
        //get the list of current users in room
        const usersInRoom = gIo.sockets.adapter.rooms.get(block._id)
        //check if there's only 1 user. if so --> updating the mentor with their socketId 
        if (usersInRoom.size === 1) {
          mentorSocketIds[block._id] = socket.id
          socket.emit(SOCKET_EMIT_IS_MENTOR, { isMentor: true })
        } else {
          socket.emit(SOCKET_EMIT_IS_MENTOR, { isMentor: false })
        }
      }
    })

    socket.on(SOCKET_EVENT_LEAVE_BLOCK, blockId => {
      if (socket.myBlock === blockId) {
        socket.leave(blockId)
        logger.info(`Socket left block ${blockId} [id: ${socket.id}]!!!!!`)
        socket.myBlock = null
      }
    })

    socket.on(SOCKET_EVENT_UPDATE_BLOCK, block => {
      logger.info(`Block updated from socket from socket [id:${socket.id}]`)
      socket.broadcast.to(socket.myBlock).emit(SOCKET_EMIT_UPDATED_BLOCK, block)
    })


  })
}
