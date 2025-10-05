import mangum
import server
handler = mangum.Mangum(server.app, lifespan="off")
