import { Server } from 'socket.io'
import { logger } from './logger.service.js'

var gIo = null

export const SOCKET_EVENT_SET_BLOCK = 'set-block'
export const SOCKET_EMIT_UPDATED_BLOCK = 'block-updated'
export const SOCKET_EVENT_UPDATE_BLOCK = 'update-block'

export const SOCKET_EMIT_IS_MENTOR = 'is-mentor'
let onlineUsers = 0

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
    onlineUsers++
    logger.info(`Online users: ${onlineUsers}`)
    const isMentor = onlineUsers === 1
    socket.emit(SOCKET_EMIT_IS_MENTOR, { isMentor })

    // socket.on('disconnect', socket => {
    //   onlineUsers--
    //   logger.info(`socket disconnected [id:${socket.id}]`)
    // })

    socket.on('disconnect',() => {
      onlineUsers--
      logger.info(`Socket disconnected [id: ${socket.id}]`);
      logger.info(`Online users: ${onlineUsers}`)
    })

    socket.on(SOCKET_EVENT_SET_BLOCK, block => {
      if (!block) return
      if (socket.myBlock === block) return
      if (socket.myBlock) {
        socket.leave(socket.myBlock)
        logger.info(`socket is leaving entity ${socket.myBlock} [id: ${socket.id}]`)
      }
      socket.join(block._id)
      logger.info(`joined block: ${block._id}`)
      socket.myBlock = block._id

    })

    socket.on(SOCKET_EVENT_UPDATE_BLOCK, block => {
      logger.info(`Block updated from socket from socket [id:${socket.id}]`)
      socket.broadcast.to(socket.myBlock).emit(SOCKET_EMIT_UPDATED_BLOCK, block)
    })
  })
}
