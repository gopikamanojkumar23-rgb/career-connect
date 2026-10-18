const jsonServer=require('json-server')
const careerserver=jsonServer.create()
const router = jsonServer.router('db.json')
const middileware = jsonServer.defaults()

const PORT = 3000

careerserver.use(middileware)
careerserver.use(router)

careerserver.listen(PORT,()=>{
    console.log(`career-server started running at PORT:${PORT} successfully...`);
})