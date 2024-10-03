import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('createTodo')

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
      const newTodo = JSON.parse(event.body)
      const userId = getUserId(event)
      const item = await createTodo(newTodo, userId)

      return {
        statusCode: 200,
        body: JSON.stringify({ item })
      }
    } catch (error) {
      throw new Error('Error when create todo' + error.message)
    }
  })
