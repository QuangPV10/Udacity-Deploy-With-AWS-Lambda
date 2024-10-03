import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('updateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event: ', event)

    try {
      const updatedTodo = JSON.parse(event.body)
      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)

      await updateTodo(userId, todoId, updatedTodo)

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Updated Successfully' })
      }
    } catch (error) {
      logger.error('Error when update', { error })

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Updated Failed' })
      }
    }
  })
