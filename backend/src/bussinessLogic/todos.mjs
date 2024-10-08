import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import {
  getFormattedUrl,
  generateAttachmentUrl
} from '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('businessLogic')
const todosAccess = new TodosAccess()

export const getToDosByUserId = async (userId) => {
  logger.info(`Retrieving all todos for user ${userId}`, { userId })
  return todosAccess.getToDosByUserId(userId)
}

export const createTodo = async (newTodo, userId) => {
  const todoId = uuid.v4()

  const todoItem = {
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }

  logger.info(`Creating todo ${todoId} for user ${userId}`, { userId, todoId, todoItem: todoItem })

  return await todosAccess.create(todoItem)
}

export const updateTodo = async (userId, todoId, updateTodo) => {
  logger.info(`Updating todo ${todoId} for user ${userId}`)
  return await todosAccess.update(userId, todoId, updateTodo)
}

export const deleteTodo = async (userId, todoId) => {
  logger.info(`Deleting todo with ID: ${todoId} for user with ID: ${userId}`)
  return await todosAccess.delete(userId, todoId)
}

export async function updateAttachedFileUrl(userId, todoId) {
  logger.info('Adding a attachment')
  const attachmentUrl = await getFormattedUrl(todoId)
  const uploadUrl = await generateAttachmentUrl(todoId)
  await todosAccess.updateAttachedFileUrl(userId, todoId, attachmentUrl)
  return uploadUrl
}
