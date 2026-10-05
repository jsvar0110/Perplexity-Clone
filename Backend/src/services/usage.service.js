import usageModel from "../models/usage.model.js";

export const LIMITS = { image: 2, tts: 5 }
const today = () => new Date().toISOString().slice(0, 10)

export async function consumeUsage(userId, feature) {

    if (process.env.DISABLE_LIMITS === "true") return { allowed: true, used: 0 }

    try {

        const doc = await usageModel.findOneAndUpdate(

            { user: userId, date: today(), [feature]: { $lt: LIMITS[feature] } },
            { $inc: { [feature]: 1 } },
            { upsert: true, returnDocument: "after" }

        )
        return { allowed: true, used: doc[feature] }

    } catch (err) {

        if (err.code === 11000) return {
            allowed: false
        }

        throw err
    }

}

export const refundUsage = (userId, feature) =>
    process.env.DISABLE_LIMITS === "true" ? null : usageModel.updateOne(
        { user: userId, date: today(), [feature]: { $gt: 0 } },
        { $inc: { [feature]: -1 } }
    )