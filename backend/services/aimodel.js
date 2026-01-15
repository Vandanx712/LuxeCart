import dotenv from 'dotenv'
import { ApiError } from '../utill/apierror.js'
import Bytez from 'bytez.js'

dotenv.config()

const runbytez = async (Model, input) => {
    const sdk = new Bytez(process.env.BYTEZ_API_KEY)
    try {
        const model = sdk.model(Model)

        const { output, error } = await model.run(input)
        if (error) throw new ApiError(500, error)
        return output
    } catch (error) {
        console.error('Bytez error:', error)
    }
}

const cleanOutput = (text)=>{
    let final = text
    if(!final) return ''
    final = final.split('Begin:')[1]
    final = final.replace(/\n+/g, " ").trim();

    if(final.includes('Final output:')) final = final.split('Final output:')[1]
    return final
}

export const getAiDescription = async (name, imgurl) => {
    try {
        const imgdescription = await runbytez('upro/blip', imgurl)
        if (!imgdescription) throw new ApiError('Image caption generation failed')

        const descriptionPrompt = `
        Generate a concise eCommerce product description.

        Product name: ${name}
        Description hints: ${imgdescription}

        Constraints:
        One paragraph. 25 words. No lists. No headings. No extra text. describe material,size and color.

        Begin:`;

        const finalDescription = await runbytez('Qwen/Qwen3-4B-Instruct-2507', descriptionPrompt)
        return cleanOutput(finalDescription)
    } catch (error) {
        console.error(error)
    }
}