import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const blockService = {
  remove,
  query,
  getById,
  add,
  update,
}

async function query() {
  try {
    const collection = await dbService.getCollection('block')
    const blocks = await collection.find().toArray()
    return blocks
  } catch (err) {
    logger.error('Cannot find blocks', err)
    throw err
  }
}

async function getById(blockId) {
  try {
    const collection = await dbService.getCollection('block')
    const block = collection.findOne({ _id: new ObjectId(blockId) })
    return block
  } catch (err) {
    logger.error(`Cannot find block ${blockId}`, err)
    throw err
  }
}

async function remove(blockId) {
  try {
    const collection = await dbService.getCollection('block')
    await collection.deleteOne({ _id: new ObjectId(blockId) })
  } catch (err) {
    logger.error(`Cannot remove block ${blockId}`, err)
    throw err
  }
}

async function add(block) {
  try {
    const collection = await dbService.getCollection('block')
    await collection.insertOne(block)
    return block
  } catch (err) {
    logger.error('Cannot add block', err)
    throw err
  }
}

async function update(block) {
  try {
    // Create a copy of the block object and exclude _id field
    const blockToSave = { ...block };
    delete blockToSave._id;

    const collection = await dbService.getCollection('block');
    await collection.updateOne({ _id: new ObjectId(block._id) }, { $set: blockToSave });
    console.log('iddddddd',blockToSave._id);
    return block;
    // return blockToSave?;
  } catch (err) {
    logger.error(`Cannot update block ${block._id}`, err);
    throw err;
  }
}

