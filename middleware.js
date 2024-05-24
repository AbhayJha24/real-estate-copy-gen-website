import {NextResponse} from 'next/server';

export async function middleware(request) {

    console.log(request.nextUrl.pathname)

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
            // console.log(body);
        }
        catch(err){

            console.log(err)
        }

        
        let prompt = `You are a copywriter at a marketing agency working on a brochure for a real estate developer. Generate a narrative flow for the real estate brochure keeping in mind the brand positioning and features of the property. Brand Positioning : ${brandPositioning} and Features : ${features} Keep the tone of the narrative ${tone} and also make sure that the length of the copy is ${length}`;
        console.log(prompt)
        return NextResponse.redirect(new URL('/home', request.url))
    }
}