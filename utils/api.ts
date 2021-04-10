import { NextApiRequest, NextApiResponse } from 'next'
import absoluteUrl from 'next-absolute-url'
import { Middleware } from 'next-connect'

export interface ExtendedNextApiRequest extends NextApiRequest {
  protocol: string
  host: string
  origin: string
}

export const injectOrigin: Middleware<
  ExtendedNextApiRequest,
  NextApiResponse
> = (req, res, next) => {
  const { protocol, host, origin } = absoluteUrl(req)

  req.protocol = protocol
  req.host = host
  req.origin = origin

  next()
}
