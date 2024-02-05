import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        // Get all users from MongoDB
        const users = await User.find().select('-password').lean();

        // If no users 
        if (!users) {
            return res.status(400).json({ message: 'No users found' });
        }

        res.json(users);
    } catch (err) {
        return res.status(500).json({ message: "Unable to fetch users" });
    }
}


// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password, roles } = req.body;

        // Confirm data
        if (!username || !email || !password || !Array.isArray(roles) || !roles.length) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for Validation
        const emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordExpression: RegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (!emailExpression.test(email.toString())) {
            return res.status(400).json({ message: "Invalid email address format" });
        }
        if (!passwordExpression.test(password.toString())) {
            return res.status(400).json({
                message: "Enter valid password in range 7-15 with uppercase, lowercase, number & @",
            });
        }

        // Check for duplicate username
        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate) {
            return res.status(409).json({ message: 'User already exist' });
        }

        // Hash password 
        const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

        const user = new User({
            username,
            email,
            password: hashedPwd,
            roles,
        });
        await user.save();
      
        return res.status(200).json({ message: `New user ${username} created` });

    } catch (err) {
        return res.status(500).json({ message: "Unable to create user" })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id, username, email, roles, active, password } = req.body

        // Confirm data 
        if (!id || !username || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
            return res.status(400).json({ message: 'All fields except password are required' })
        }

        // Does the user exist to update?
        const user = await User.findById(id).exec()
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
        user.username = username
        user.roles = roles
        user.active = active

        if (password) {
            // Hash password 
            user.password = await bcrypt.hash(password, 10) // salt rounds 
        }
        const updatedUser = await user.save()
        res.json({ message: `${updatedUser.username} updated` })
    } catch (err) {
        return res.status(500).json({ message: "Unable to update user" })
    }
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req: express.Request, res: express.Response) => {

}

export default { getAllUsers, createNewUser, updateUser, deleteUser };