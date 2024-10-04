import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import { JwksClient } from 'jwks-rsa'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-w5x0roc81tzbjmee.us.auth0.com/.well-known/jwks.json'

const jwks = new JwksClient({ jwksUri: jwksUrl })

export async function handler(event) {
  logger.info('Processing event: ', event)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  const signingKey = await jwks.getSigningKey(jwt.header.kid)
  const publicKey = signingKey.publicKey || signingKey.rsaPublicKey

  return jsonwebtoken.verify(token, publicKey, { complete: false })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
