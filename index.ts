import express  from "express"
import { config } from "dotenv"
config();
import { AuthController, BoardController } from "./controllers";
import { MongooseService } from "./services/mongoose";
import { IUserRole } from "./models";

function launchAPI() {
    const app = express();
    app.use('/auth', AuthController.getInstance().buildRouter());
    app.use('/board', BoardController.getInstance().buildRouter());
    app.listen(process.env.PORT, () => console.log("Listening on port: " + process.env.PORT));
}

async function setupAPI() {
    const mongooseService = await MongooseService.getInstance();
    const userServices = mongooseService.userServices;
    const rootUser = await userServices.findUserByLogin("root");
    if(!rootUser) {
        await userServices.createUser({
            login: "root",
            password: "root",
            role: IUserRole.SuperAdmin,
            email: "root@board.fr",
            firstName: "super",
            lastName: "admin"
        });
    }
}

async function main(): Promise<void> {
    await setupAPI();
    launchAPI();
}

main().catch(console.error);