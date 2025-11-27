import Elysia from "elysia";
import { userServices } from "./userServices";
import { auth } from "./auth/auth";
import { fileServices } from "./fileServices";
import { messageServices } from "./messageServices";


export const app = new Elysia({
    name: 'app',
    prefix: '/api'
})
.mount(auth.handler)
.use(userServices)
.use(fileServices)
.use(messageServices)