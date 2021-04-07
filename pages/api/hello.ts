import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>().get((req, res) => {
  res.json({
    message: 'hello world',
  })
})

export default handler
