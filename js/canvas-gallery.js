import supabase, { supabaseTableName, supabaseStorageName, supabaseStorageUrl } from './config/supabase-client.js'
import { state } from "./index.js"
import { timeAgo } from './utils/date.js'
import filenameFormat from './utils/filname-formatter.js'

const handleCanvasSubmit = async (e) => {
  e.preventDefault()

  const { isUploadSuccess, uploadData } = await uploadCanvasImage()
  console.log(isUploadSuccess)
  console.log(uploadData)

  
  if (uploadData) {
    let response = await updateSupabaseDb(uploadData.fullPath)
    console.log(response[0])
    const imgContainer = document.createElement('div')
    const imageElement = document.createElement('img')
    const textContainer = document.createElement('div')
    const nameText = document.createElement('p')
    const dateText = document.createElement('p') 
    
    imgContainer.className = 'gallery-img-container'
    imageElement.className = 'gallery-image'
    imageElement.src = supabaseStorageUrl + response[0].img_url.replaceAll(" ", "%20")
    imageElement.alt = 'By: ' + response[0].name
    textContainer.className = 'gallery-txt-container'
    nameText.className = 'gallery-image-artist'
    nameText.textContent = 'By: ' + response[0].name.replaceAll('%20', ' ')
    dateText.className = 'gallery-image-created'
    dateText.textContent = timeAgo(response[0].created_at)
    
    imgContainer.appendChild(imageElement)
    imgContainer.appendChild(textContainer)
    textContainer.appendChild(nameText)
    textContainer.appendChild(dateText)
    document.getElementById('gallery').prepend(imgContainer)

  }

} 

const updateSupabaseDb = async (img_url) => {
  let response;
  const { data, error } = await supabase
    .from(`${supabaseTableName}`)
    .insert([{ name: state.name, img_url}])
    .select()

  if (error) {console.log(error)
    console.log(error.message)
  }
  if (data && data.length == 0 ) {
    console.log(data)
    console.log('hey')
  }
  if (data) {
    response = data
    console.log(data)
    alert('upload to database complete')
  }
  return data
}  

const uploadCanvasImage = async () => {
  // canvas -> blob
  let isUploadSuccess = false
  let uploadData;
  const blob = await new Promise(resolve => state.canvas.toBlob(resolve, 'image/png'))

  const { data, error } = await supabase
    .storage
    .from(`${supabaseStorageName}`)
    .upload(`${filenameFormat(state.name)}`, blob, {
      contentType: "image/png",
      upsert: false
    })

  if (error) { 
    console.log(error)
    console.log(error.message)
  }
  if (data && data.length == 0) {console.log(data)}
  if (data && data.length != 0) {
    isUploadSuccess = true
    uploadData = data
  }

  return { isUploadSuccess, uploadData }
}

const fetchImages = async () => {

  const { data, error }  = await supabase
    .from(`${supabaseTableName}`)
    .select()
    .order('created_at', { ascending: false })

  if (error) {console.log(error)}
  if (data && data.length == 0) {console.log(data)}
  if (data && data.length != 0) {
    state.gallery_items = data
    displayGallery(data)
  }
}
  
const displayGallery = () => {
  state.gallery_items.forEach(image => {
    const imgContainer = document.createElement('div')
    const imageElement = document.createElement('img')
    const textContainer = document.createElement('div')
    const nameText = document.createElement('p')
    const dateText = document.createElement('p') 
  
    imgContainer.className = 'gallery-img-container'
    imageElement.className = 'gallery-image'
    imageElement.src = supabaseStorageUrl + image.img_url.replaceAll('%20', ' ')
    imageElement.alt = 'By: ' + image.name
    textContainer.className = 'gallery-txt-container'
    nameText.className = 'gallery-image-artist'
    nameText.textContent = 'By: ' + image.name.replaceAll('%20', ' ')
    dateText.className = 'gallery-image-created'
    dateText.textContent = timeAgo(image.created_at)
    
    imgContainer.appendChild(imageElement)
    imgContainer.appendChild(textContainer)
    textContainer.appendChild(nameText)
    textContainer.appendChild(dateText)

    document.getElementById('gallery').appendChild(imgContainer)
  })
}

const initGallery = () => {
  fetchImages(state.gallery_items)
}








export { handleCanvasSubmit, initGallery }