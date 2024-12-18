import z from 'zod'

const roomSchema = z.object({
    name: z.string(),
    private: z.number().max(1).min(0),
    description: z.string(),
    likes: z.number().int()
})

export function validateRoom(room) {
    return roomSchema.safeParse(room)
}

export function validatePartialRoom(room) {
    return roomSchema.partial().safeParse(room)
}