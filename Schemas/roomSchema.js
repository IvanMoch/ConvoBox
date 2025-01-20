import z from 'zod'

const roomSchema = z.object({
    name: z.string(),
    description: z.string(),
})

export function validateRoom(room) {
    return roomSchema.safeParse(room)
}

export function validatePartialRoom(room) {
    return roomSchema.partial().safeParse(room)
}