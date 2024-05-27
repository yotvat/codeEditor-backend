import { blockService } from './block.service.js'
import { logger } from '../../services/logger.service.js'

export async function getBlocks(req,res) {
  try {
    logger.debug('Getting blocks')
    const blocks = await blockService.query()
    res.json(blocks)
  } catch (err) {
    logger.error('Failed to get blocks', err)
    res.status(500).send({ err: 'Failed to get blocks' })
  }
}

export async function getBlockById(req, res) {
  try {
    const { blockId } = req.params
    const block = await blockService.getById(blockId)
    res.json(block)
  } catch (err) {
    logger.error('Failed to get block', err)
    res.status(500).send({ err: 'Failed to get block' })
  }
}

export async function addBlock(req, res) {
  try {
    const block = req.body
    const addedBlock = await blockService.add(block)
    res.json(addedBlock)
  } catch (err) {
    logger.error('Failed to add block', err)
    res.status(500).send({ err: 'Failed to add block' })
  }
}

export async function updateBlock(req, res) {
  try {
    const block = req.body
    const updatedBlock = await blockService.update(block)
    res.json(updatedBlock)
  } catch (err) {
    logger.error('Failed to update block', err)
    res.status(500).send({ err: 'Failed to update block' })
  }
}

export async function removeBlock(req, res) {
  try {
    const { blockId } = req.params
    await blockService.remove(blockId)
    res.send('block deleted')
  } catch (err) {
    logger.error('Failed to remove block', err)
    res.status(500).send({ err: 'Failed to remove block' })
  }
}
