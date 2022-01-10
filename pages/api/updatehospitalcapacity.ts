// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { prisma } from "@functionalities/DB/prismaInstance"
import { NextApiRequest, NextApiResponse } from "next"
import { updatedDiff } from "deep-object-diff"
import { capacity } from ".prisma/client"

const updateCapacity = async (
	registration_no: string,
	updatedCapacity: capacity
) => {
	return await prisma.capacity.update({
		where: {
			registration_no,
		},
		data: updatedCapacity,
	})
}

// ! entry point of get endpoint
export default async (req: NextApiRequest, res: NextApiResponse) => {
	// revoking other methods
	if (req.method !== "POST")
		return res.status(405).json({
			message: `Method not allowed! '${req.method}' is abstruse to this endpoint. Server side log.`,
		})

	console.log(req.body, updatedDiff(req.body.capacity, req.body.newCapacity))

	return res
		.status(200)
		.json(
			await updateCapacity(
				req.body.capacity.registration_no,
				updatedDiff(req.body.capacity, req.body.newCapacity) as capacity
			)
		)
}

// ! allowing client side promise resolving & suppressing false NO RESPONSE SENT alert, do not delete
export const config = {
	api: {
		externalResolver: true,
	},
}
