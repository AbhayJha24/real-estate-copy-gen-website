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
              max_tokens: 250
            })
          };

          const airesp = await fetch("https://api.edenai.run/v2/text/generation", options);
          const resp  = await airesp.json()
        //   console.log(resp["openai"]["generated_text"]);

        // const testing_text = '\n\nWelcome to the epitome of luxury living - the newest addition to the city\'s skyline, XYZ Residences. Designed for the elite, this exclusive development boasts bespoke and modern apartments that are sure to impress even the most discerning individuals.\n\nAs you enter the premises, you will be greeted by five magnificent buildings, each with its own unique charm and character. The sleek and contemporary architecture is a testament to the developer\'s commitment to creating a one-of-a-kind living experience.\n\nStep inside your apartment and be prepared to be blown away. The interiors are a perfect blend of sophistication and comfort, with every detail carefully curated to cater to your every need. From high-end finishes to state-of-the-art appliances, no expense has been spared to ensure that you live in the lap of luxury.\n\nBut it\'s not just the interiors that make XYZ Residences stand out. The development also boasts a world-class fitness center, equipped with the latest equipment and facilities to help you stay in shape. And for those who prefer a more leisurely way to unwind, there\'s a stunning swimming pool where you can take a dip and soak in the breathtaking views of the city.\n\nLocation is everything, and XYZ Residences has got that covered too. With its prime location,';

        
        return NextResponse.json(resp["openai"]["generated_text"])
    }
}