import z from 'zod'

const messageSchema = z.object({
    user_id: z.string(),
    content: z.string(),
    room_id: z.string()
})


export function validateMessage(message) {
    return messageSchema.safeParse(message)
}

export function validatePartialMessage(message) {
    return messageSchema.partial().safeParse(message)
}