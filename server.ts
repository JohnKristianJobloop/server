import express from "express"
import cors from "cors"
import { validateBody } from "./util/validateBody.js"
import { fetchUsername } from "./util/postgresFunctions/fetchUser.js"
import { updateHighScore } from "./util/postgresFunctions/updateUser.js"
import { postNewUser } from "./util/postgresFunctions/postUser.js"
import { fetchTopTen } from "./util/postgresFunctions/fetchTopTen.js"
import { usernameChecker } from "./util/sanitizeUsername.js"
import { difficultyOptions, initializeServer } from "./util/initializeServer.js"

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())


/* Skjekker om postgres serveren har korrekte tables, bruker gratisversjonen av render som
av og til wiper serveren. */
await initializeServer(difficultyOptions)


/* Endpoint for å sette eller oppdatere highscore. */
app.post("/setscore", async (req, res)=>{
    const body = req.body

    /* Hvis body mangler data, returner status 401 missing data. */
    if (!validateBody(body)){
       return res.status(400).json({message: "Missing Username/Highscore"})
    }

    /* Destrukturerer body og saniterer username */
    const {username, highscore, difficulty} = body
    let sanitUsername = usernameChecker(username)

    /* Skjekker om brukernavnet finnes fra før. */
    const existingUsername = await fetchUsername(sanitUsername, difficulty)
    console.log(existingUsername)

    /* Hvis postgres serveren gir error, send 500 error til client.  */
    if (!existingUsername.success){
        console.log(existingUsername.error)
        return res.status(500).json({message: "Internal Server Error"})
    }

    /* Hvis brukernavnet ikke finnes, prøv å post en ny bruker. */
    if (existingUsername.success && existingUsername.data?.rowCount === 0){
        const setHighscore = await postNewUser(sanitUsername, highscore, difficulty)
        console.log(setHighscore)

        /* Hvis server error, send 500 status. hvis success send 200 status. */
        if (!setHighscore.success){
            console.log(setHighscore.error)
            return res.status(500).json({message: "Internal Server Error"})
        } return res.status(200).json({message: "Highscore Set!"})
    }

    /* Hvis brukernavnet allerede finnes, prøv å oppdater highscore til navn. */
    if (existingUsername.success && existingUsername.data?.rowCount){
        const update = await updateHighScore(sanitUsername, highscore, difficulty)
        console.log(update)

        /* Hvis servererror, send 500 status, hvis ikke send 200 status. */
        if (!update.success){
            console.log(update.error)
            return res.status(500).json({message: "Internal Server Error"})
        } return res.status(200).json({message: "Highscore Set!"})
    }
})


/* Endpoint for å fetche highscore for set difficulty. */
app.get("/highscore", async (req,res)=>{
    const {difficulty} = req.body
    const data = await fetchTopTen(difficulty)
    console.log(data)
    /* Hvis server fail, send 500 error, hvis ikke send 200 status + data. */
    if (!data.success){
        console.log(data.error)
        return res.status(500).json({message: "Internal Server Error"})
    } return res.status(200).json({message: "Success!", data: data.data?.rows})
})





/* App lytter til standard ip + port. */
app.listen(port, ()=>{
    console.log("server running")
})