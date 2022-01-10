// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { object, string } from "yup"
import { prisma } from "@functionalities/DB/prismaInstance"
import { staff } from "@prisma/client"

const hospitalStaffSchema = object().shape({
		staffName: string().required().min(2).max(50),
		staffMobile: string().required().min(11).max(14),
		staffEmail: string().required().email(),
	}),
	createStaff = async (staff: staff) => {
		await prisma.$queryRaw`
			INSERT INTO staff
			(mobile_no, password, name, email, role, status, registration_no)
			VALUES
			('${staff.mobile_no}', '${staff.password}', '${staff.name}', '${staff.email}',
			 '${staff.role}', '${staff.status}', '${staff.registration_no}')
		`

		return await prisma.staff.findUnique({
			where: {
				email: staff.email,
			},
		})
	}

// ! entry point of get endpoint
export default async (req: NextApiRequest, res: NextApiResponse) => {
	// revoking other methods
	if (req.method !== "POST")
		return res.status(405).json({
			message: `Method not allowed! '${req.method}' is abstruse to this endpoint. Server side log.`,
		})

	console.log(req.body)

	if (req.headers["x-field-validated"] == "true") {
		return res.status(200).json(await createStaff(req.body))
	}

	try {
		await hospitalStaffSchema.validate(req.body, {
			abortEarly: false,
		})
	} catch (error) {
		return res.status(406).json(error)
	}

	return res.status(200).json({ validated: true })
}

// ! allowing client side promise resolving & suppressing false NO RESPONSE SENT alert, do not delete
export const config = {
	api: {
		externalResolver: true,
	},
}
