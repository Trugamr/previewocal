import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

let number

const handler = nc<NextApiRequest, NextApiResponse>().get((req, res) => {
  if (number === undefined) {
    number = Math.random()
  }

  res.json({
    message: `hello world ${number}`,
  })
})

export default handler
