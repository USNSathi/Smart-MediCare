// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { object, string } from "yup"
import { prisma } from "@functionalities/DB/prismaInstance"
import { saveImage } from "@functionalities/saveImage"

const hospitalInfoSchema = object().shape({
		hospitalName: string().required().min(10).max(100),
		registrationNo: string().required().min(10).max(10),
	}),
	hospitalAddressSchema = object().shape({
		phone: string().optional().min(12).max(14).nullable(),
		mobile: string().optional().min(14).max(14).nullable(),
		website: string().optional().max(255).url().nullable(),
		address: string().required(),
	}),
	hospitalAdminSchema = object().shape({
		adminName: string().required().min(2).max(50),
		adminEmail: string().required().email(),
		adminMobile: string().required().min(14).max(14),
		adminPassword: string().required().min(4).max(25),
	}),
	create = async ({
		hospital,
		address,
		capacity,
		staff,
		vacant_bed_log,
		log,
	}: any) => {
		return await prisma.hospital.create({
			data: {
				registration_no: hospital.registration_no,
				hospital_name: hospital.hospital_name,
				description: hospital.description,
				hospital_type: hospital.hospital_type,
				bed_type: hospital.bed_type,
				image_source: hospital.image_source,
				website: hospital.website,
				address: {
					create: {
						address: address.address,
						phone_no: address.phone_no,
						mobile_no: address.mobile_no,
						latitude: address.latitude,
						longitude: address.longitude,
					},
				},
				capacity: {
					create: {
						total_capacity: capacity.total_capacity,
						ward: capacity.ward,
						special_ward: capacity.special_ward,
						cabin: capacity.cabin,
						vip_cabin: capacity.vip_cabin,
						icu: capacity.icu,
						ccu: capacity.ccu,
						hdu: capacity.hdu,
						hfncu: capacity.hfncu,
						emergency: capacity.emergency,
						covid: capacity.covid,
						extra: capacity.extra,
					},
				},
				vacant_bed_log: {
					create: {
						ward: vacant_bed_log.ward,
						special_ward: vacant_bed_log.special_ward,
						cabin: vacant_bed_log.cabin,
						vip_cabin: vacant_bed_log.vip_cabin,
						icu: vacant_bed_log.icu,
						ccu: vacant_bed_log.ccu,
						hdu: vacant_bed_log.hdu,
						hfncu: vacant_bed_log.hfncu,
						emergency: vacant_bed_log.emergency,
						covid: vacant_bed_log.covid,
						extra: vacant_bed_log.extra,
					},
				},
				amenity: {
					create: {
						atm: null,
						baby_corner: null,
						cafeteria: null,
						gift_shop: null,
						locker: null,
						parking: null,
						pharmacy: null,
						prayer_area: null,
						wheelchair: null,
						wifi: null,
					},
				},
				blood_analytical_service: {
					create: {
						antibody_analysis: null,
						cbc: null,
						creatinine_analysis: null,
						crp: null,
						esr: null,
						fobt: null,
						hematocrit: null,
						kidney_function_analysis: null,
						lipid_profile: null,
						liver_function_analysis: null,
						rf: null,
						serum_analysis: null,
						sr: null,
					},
				},
				diagnostic_imaging_service: {
					create: {
						angiocardiography: null,
						angiography: null,
						coloscopy: null,
						ct: null,
						cta: null,
						cystoscopy: null,
						echocardiography: null,
						endoscopy: null,
						fluoroscopy: null,
						mammography: null,
						mra: null,
						mri: null,
						mrs: null,
						pet: null,
						pet_ct: null,
						spect: null,
						ultrasound: null,
						x_ray: null,
					},
				},
				general_service: {
					create: {
						autopsy: null,
						biopsy: null,
						blood_bank: null,
						bronchoscopy: null,
						echocardiography: null,
						ecg: null,
						emg: null,
						laparoscopy: null,
						phonocardiography: null,
						urinalysis: null,
					},
				},
				staff: {
					create: {
						mobile_no: staff.mobile_no,
						password: staff.password,
						name: staff.name,
						email: staff.email,
						role: staff.role,
						status: staff.status,
						joined_on: new Date(),
					},
				},
				log: {
					create: {
						mobile_no: log.mobile_no,
						task: log.task,
						role: log.role,
					},
				},
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

	if (req.body.step === "hospital info") {
		try {
			console.log(req.body.data)

			await hospitalInfoSchema.validate(req.body.data, {
				abortEarly: false,
			})

			// check if the hospital is already signed up
			if (
				(await prisma.hospital.findUnique({
					where: { registration_no: req.body.data.registrationNo },
				})) != null
			)
				return res
					.status(200)
					.json({ error: "Hospital is already registered! Try Login." })

			return res.status(200).json({})
		} catch (error) {
			return res.status(406).json(error)
		}
	} else if (req.body.step === "address info") {
		try {
			console.log(req.body.data)
			return res.status(200).json(
				await hospitalAddressSchema.validate(req.body.data, {
					abortEarly: false,
				})
			)
		} catch (error) {
			return res.status(406).json(error)
		}
	} else if (req.body.step === "admin info") {
		try {
			console.log(req.body.data)
			return res.status(200).json(
				await hospitalAdminSchema.validate(req.body.data, {
					abortEarly: false,
				})
			)
		} catch (error) {
			return res.status(406).json(error)
		}
	} else if (req.body.step == "submit") {
		try {
			console.log(req.body.data)

			req.body.data.hospital.image_source === "default"
				? (req.body.data.hospital.image_source =
						"/media/profile-image-default.jpg")
				: // save image and get the link
				  (req.body.data.hospital.image_source = saveImage(
						req.body.data.hospital.image_source,
						"hospitals",
						req.body.data.hospital.registration_no
				  ))

			await create(req.body.data)

			return res.status(302).json({
				reg: req.body.data.hospital.registration_no,
				user: req.body.data.staff.email,
			})

			// return res
			// 	.writeHead(302, {
			// 		Location: `/admin/dashboard?reg=${req.body.data.hospital.registration_no}&user=${req.body.data.staff.email}`,
			// 	})
			// 	.end()
		} catch (error) {
			return res.status(406).json(error)
		}
	}

	return res.status(406).json({ message: "Invalid data format!" })
}

// ! allowing client side promise resolving & suppressing false NO RESPONSE SENT alert, do not delete
export const config = {
	api: {
		externalResolver: true,
		bodyParser: {
			sizeLimit: "10mb",
		},
	},
}
