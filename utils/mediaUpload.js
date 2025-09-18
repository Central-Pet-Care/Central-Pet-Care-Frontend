import { createClient } from "@supabase/supabase-js"

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodW91ZHlvdHR2dGFhd2Rzd2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTEzMzcsImV4cCI6MjA3Mzc4NzMzN30.2iVseQSlhNxOc9Dg0wK2382txWoa2N4MLyyFhF0o1dk"

const url = "https://fhuoudyottvtaawdswlz.supabase.co"

const supabase = createClient(url,key)

export default function uploadMediaToSupabase(file){

    return new Promise((resolve, reject)=>{
        if(file == null){
            reject("File not added")
        }
          let fileName = file.name
          const extension = fileName.split(".")[fileName.split(".").length -1]

          
    
          const timestamp =  new Date().getTime()
          fileName = timestamp+"."+extension

          supabase.storage.from("images").upload(fileName, file,{
                cacheControl : "3600",
                upsert : false
                
            }).then(()=>{
                const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
                resolve(publicUrl)

            }).catch((err)=>{
                reject(err)
            })
    })
       
}

            // if(extension != "jpg" && extension != "png"){
            //     alert("Please select a jpg or png file")
            //     return
            // }
    
            