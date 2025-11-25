import { treaty } from '@elysiajs/eden'
import { app } from '../app'

export const { api } = treaty<typeof app>(process.env.HOST || 'localhost:3000', {fetch: {credentials: 'include'}})