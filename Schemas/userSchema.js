import z from 'zod'

const userSchema = z.object({
    username: z.string().max(45),
    email: z.string(),
    password: z.string(),
    userImage: z.string().optional()
})


export function validateUser(user){
    return userSchema.safeParse(user)
}

export function validatePartialUser(user) {
    return userSchema.partial().safeParse(user)
}