import multer, { memoryStorage } from 'multer'


export const upload = multer({
    
    storage : multer.memoryStorage() ,

    limits: {
        fileSize : 5 * 1024 * 1024
    }

})

export const uploadFile = (req,res, next) =>
    upload.single("file")(req , res, (err)=>
    err ? res.status(400).json({
        message : err.message
    }) : next()
    )