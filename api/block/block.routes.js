import express from 'express'

import {
  getBlocks,
  getBlockById,
  addBlock,
  updateBlock,
  removeBlock,
} from './block.controller.js'

export const blockRoutes = express.Router()

blockRoutes.get('/', getBlocks)
blockRoutes.get('/:blockId', getBlockById)
blockRoutes.post('/', addBlock)
blockRoutes.put('/:blockId', updateBlock)
blockRoutes.delete('/:blockId', removeBlock)
