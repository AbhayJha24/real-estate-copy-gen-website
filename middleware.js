// Necessary Imports

import {NextResponse} from 'next/server';
import { createClient } from '@supabase/supabase-js'


// Function for generating random alphanumeric id for primary key of the database

const randomAlphaNumeric = length => {
    let s = '';
    Array.from({ length }).some(() => {
      s += Math.random().toString(36).slice(2);
      return s.length >= length;
    });
    return s.slice(0, length);
};


// Main Middleware Function

export async function middleware(request) {

    /* For handling POST /generate endpoint */

    if(request.nextUrl.pathname === "/generate"){
        // Call the API to generate the text

        let brandPositioning = "";
        let features = "";
        let tone = "";
        let length = "";

        try{
            const body = await request.json();
            if(body){
                brandPositioning = body.brandPositioning;
                features = body.features;
                tone = body.tone;
                length = body.length;
            }
        }
        catch(err){
            console.log(err)
            return NextResponse.json({error: "Bad Request !"}, {status: 400})
        }

        const lengthTranslation = {
            "Short": "4-6 sentences",
            "Medium": "8-10 sentences",
            "Long": "15-20 sentences",
        }
        
        const tokensCalculation = {
            "Short": 90,
            "Medium": 150,
            "Long": 300,
        }

        
        let prompt = `You are a copywriter at a marketing agency working on a brochure for a real estate developer. Generate a narrative flow for the real estate brochure keeping in mind the brand positioning and features of the property. <Brand Positioning> ${brandPositioning} </Brand Positioning> and <Features> ${features} </Features> Keep the tone of the narrative ${tone} and also make sure that the length of the copy is ${lengthTranslation[length]}`;

        const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: process.env.AUTH_KEY,
            },
            body: JSON.stringify({
              providers: "openai",
              text: prompt,
              temperature: 0.2,
              max_tokens: tokensCalculation[length]
            })
          };

          const airesp = await fetch("https://api.edenai.run/v2/text/generation", options);
          const resp  = await airesp.json()
        
        return NextResponse.json(resp["openai"]["generated_text"])
    }


    /* For handling POST /insert */

    else if(request.nextUrl.pathname === "/insert"){
        // Code for inserting the generated text into the database

        const supabaseUrl = 'https://hlfvdyibpagifzipxcbw.supabase.co'
        const supabaseKey = process.env.SUPABASE_KEY

        let positioning;
        let features;
        let tone;
        let length;
        let output;

        try{
            const body = await request.json();
            if(body){
                positioning = body.brandPositioning;
                features = body.features;
                tone = body.tone;
                length = body.length;
                output = body.output;
            }
        }
        catch(err){
            console.log(err)
            return NextResponse.json({error: "Bad Request !"}, {status: 400})
        }

        const id = randomAlphaNumeric(15);

        let data = {
            id: id, 
            positioning: positioning,
            features: features,
            tone: tone,
            length: length,
            output: output
        }

        try{
            const supabase = createClient(supabaseUrl, supabaseKey);
            console.log("Connection Successful !");
            const { dbres, error } = await supabase.from('marketingcopy').insert([data]).select();

            if(error){
                console.log(`Failed to Insert data into the database ! ${error.message}`);
                return NextResponse.json({error: "Internal Server Error !"}, {status: 500})
            }
            else{
                console.log(`Data inserted successfully into the database !`);
                return NextResponse.json("Data inserted into the database")
            }
           
        }
        catch(e){
            console.log("Failed to Connect to the database");
            return NextResponse.json({error: "Internal Server Error !"}, {status: 500})
        }
    }


    /* For handing POST /regenerate endpoint */

    else if(request.nextUrl.pathname === "/regenerate"){
        let selectedPart = "";
        let type = "";
        let completeText = "";

        try{
            const body = await request.json();
            if(body){
                selectedPart = body.selectedPart;
                type = body.type;
                completeText = body.completeText;
            }
            // console.log(body);
        }
        catch(err){
            console.log(err)
            return NextResponse.json({error: "Bad Request !"}, {status: 400})
        }

        
        let prompt = `Please regenerate the narrative flow by modifying ONLY the selection portion of the complete text. Do not regenerate any other aspect of the complete text and ONLY give the output. <COMPLETE TEXT> ${completeText} </COMPLETE TEXT> <SELECTED PORTION> ${selectedPart} </SELECTED PORTION> Please make the text of the selection portion ${type}. Generate and return the complete text containing the modification, without providing any other information or sentences.`;

        const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: process.env.AUTH_KEY,
            },
            body: JSON.stringify({
              providers: "openai",
              text: prompt,
              temperature: 0.2,
              max_tokens: 300
            })
          };

          const airesp = await fetch("https://api.edenai.run/v2/text/generation", options);
          const resp  = await airesp.json()
        
        return NextResponse.json(resp["openai"]["generated_text"])
    }
}