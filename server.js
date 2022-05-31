require("dotenv").config()
const { PORT = 3001, DATABASE_URL } = process.env
const express = require("express")
const app = express()

const mongoose = require("mongoose")

const cors = require("cors")
const morgan = require("morgan")

mongoose.connect(DATABASE_URL)

mongoose.connection
.on("open", () => console.log("You are connected to MongoDB"))
.on("close", () => console.log("You are disconnected from MongoDB"))
.on("error", (error) => console.log(error))

const mealSchema = new mongoose.Schema({
    day:{type: String, required: true},
    name: {type: String , required: true},
    description: {type: String},
    ingredients: {type: Array},
    time: {type: Number},
})

const Meal = mongoose.model("Meal", mealSchema)

  app.use(cors())
  app.use(morgan("dev"))
  app.use(express.json())
app.get("/", (req,res) =>{
    res.send ("you are home")
})

app.get("/meals", async (req,res)=>{
    try{
        res.json(await Meal.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get("/meals/new", async (req,res)=>{
  try{
     res.send("new")
  } catch (error) {
      res.status(400).json(error)
  }
})

app.post("/meals", async (req, res) => {
    try {
      res.json(await Meal.create(req.body))
    } catch (error) {
      res.status(400).json(error)
    }
  })

app.delete("/meals/:id", async (req, res) => {
    try {
      res.json(await Meal.findByIdAndDelete(req.params.id))
    } catch (error) {
      res.status(400).json(error)
    }
  })
  
  app.put("/meals/:id", async (req, res) => {
    try {
      res.json(
        await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true })
      )
    } catch (error) {
      res.status(400).json(error)
    }
  })

app.listen(PORT, ()=> console.log(`listening on ${PORT}`))