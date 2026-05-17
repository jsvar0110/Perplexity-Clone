import {tavily as Tavily} from "@tavily/core"

const tavily = Tavily({
    apiKey : process.env.TAVILY_API_KEY
})


export const searchInternet = async ({query}) => {

    const result = await tavily.search( query , {
        maxResults : 5 ,
        // searchDepth : "advanced" ,
    })

    console.log(JSON.stringify(result))

    return JSON.stringify(result)

}