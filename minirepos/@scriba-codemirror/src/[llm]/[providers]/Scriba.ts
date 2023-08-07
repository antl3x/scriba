import { ILLMProvider } from './[@types].mjs'
import { io } from 'socket.io-client'

/* -------------------------------------------------------------------------- */
/*                                   Scriba                                   */
/* -------------------------------------------------------------------------- */

type tInput = {
  authUserJWT: string
  apiProxyEndpoint?: string
}

/**
 * Scriba LLM Provider
 * @param i
 * @returns
 */
export const Scriba = (
  i: tInput
): ILLMProvider<ReturnType<typeof _connectWsClient>> => {
  const meta = {
    '<vendor>': 'Scriba' as const,
    '<vendorCli>': _connectWsClient(i)
  }

  return {
    '<meta>': meta
  }
}

/* -------------------------------------------------------------------------- */
/*                              _connectWsClient                              */
/* -------------------------------------------------------------------------- */
/**
 * Scriba utilises a websocket client to communicate with the server.
 */
function _connectWsClient(i: tInput) {
  console.debug('[@scriba/obsidian] starting websocket client')

  const wsCli = io(i.apiProxyEndpoint || 'https://api.usescriba.com', {
    transports: ['websocket'],
    auth: {
      token: i.authUserJWT
    },
    extraHeaders: {
      Authorization: 'Bearer' + i.authUserJWT
    }
  })

  wsCli.on('connect_error', err => {
    console.log(`[@scriba/obsidian] ws connect_error due to ${err.message}`)
  })

  return wsCli
}
