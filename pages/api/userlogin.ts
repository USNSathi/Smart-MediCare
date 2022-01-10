// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { object, string } from "yup"
import { prisma } from "@functionalities/DB/prismaInstance"

const userLoginSchema = object().shape({
		mobile: string().required().min(14).max(14),
		password: string().required().min(4).max(25),
	}),
	findUser = async (mobile_no: string) => {
		return await prisma.user.findUnique({
			where: { mobile_no },
		})
	}

// ! entry point of get endpoint
export default async (req: NextApiRequest, res: NextApiResponse) => {
	// revoking other methods
	if (req.method !== "POST")
		return res.status(405).json({
			message: `Method not allowed! '${req.method}' is abstruse to this endpoint. Server side log.`,
		})

	try {
		
		// form data type validation
		await userLoginSchema.validate(req.body.data, {
			abortEarly: false,
		})
		
		const user = await findUser(req.body.data.mobile)
		console.log(req.body.data, user?.password, user?.password.toString() == req.body.password.toString())

		// user existence
		if (user == null)
			return res.status(200).json({ user: "User not found! Try Sign Up." })

			
			// credential check
			if (user.password == req.body.password)
			{// todo redirect user with session
			return res.status(200).json(user)}
			else
		{return	res.status(200).json({ error: "Password not valid!" })}
		
	} catch (error) {
		return res.status(406).json(error)
	}
}

// ! allowing client side promise resolving & suppressing false NO RESPONSE SENT alert, do not delete
export const config = {
	api: {
		externalResolver: true,
	},
}
