import User from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/jwtToken.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// const { faker } = require('@faker-js/faker');

var balance = 100000

export const createUser = async (req, res) => {
    
    try {
        // var amount =req.body;
        const { email, username, password} = req.body
        const newUser = new User({
            email,
            username,
            password,
            balance
        })
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.json({
                status:false,
                message:"User already exists."
            })
        }else{
            newUser.save(async(_, user) => {
            res.status(201).json(user);
            console.log(user.email);
            if(user){
                // amount = faker.finance.amount()
                console.log('amount===>',balance);
                sendEmail({
                    email: user.email,
                    subject:"Verification Link" ,
                    message:"This is your verification link after signup'<a href='https://blog.logrocket.com/implementing-a-secure-password-reset-in-node-js/'>Please click to view your token.</a>" +"The amount credited to Your wallet is:-" + balance
                })
            }
        })
    }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

export const createSignIn = async (req, res) => {
    try { 
        const {email} = req.body
        const user = await User.findOne({
            email
        })
        if(user){
            sendToken(user,res);
        }else if(user){
            res.status(200).json(user)
        }else if(!user) return res.status(404).json({
            sucess:false,
            message:"User not found."
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export const transfer = async (req, res) => {
    try {
        // var amount =req.body;
        const {email,amount} = req.body
        const user = await User.findOne({
            email,amount
        })
        if(user){
            var Balance = user.balance - amount; 
            console.log('Balance===>',Balance)
            // amount = faker.finance.amount()
            // console.log('amounts===>',amount)
            if(Balance > 0){
                res.status(200).json({
                    success:true,
                    message:"Transaction Successfull."
                })
                console.log(user.email)
                console.log('userBalance===>',user.balance)
                sendEmail({
                    email: user.email,
                    subject:"Transaction Successfull !!!" ,
                    message:"Your Transaction is been successfully sent to user:-" + user.email + "and the amount is been credited to the user is:-" + Balance
                })
            }else if(!Balance){
                res.status(404).json({
                    success:false,
                    message:"Insufficient Balance...Transaction Failed!!!"
                }) 
            }
        }else if(!user) return res.status(404).json({
            sucess:false,
            message:"User not found."
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}